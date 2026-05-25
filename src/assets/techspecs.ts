import { Connection, RowDataPacket } from 'mysql2/promise'
import { PrismaClient } from '../../generated/prisma/client.js'
import { TechnicalSpecificationUncheckedCreateInput } from '../../generated/prisma/models.js'
import { getAssetMap } from './asset.js'

const tonerCommentQuery = (floor: number, ceiling: number) => `
    SELECT TRIM(i.barcode) AS barcode, r.remarks AS remarks
    FROM inventory i
    JOIN inventory_remark_master r ON r.inventory_id = i.inventory_id
    WHERE i.inventory_id BETWEEN ${floor} AND ${ceiling}
      AND r.remarks REGEXP 'C[[:space:]:-]*[0-9]'
      AND r.remarks REGEXP 'M[[:space:]:-]*[0-9]'
      AND r.remarks REGEXP 'Y[[:space:]:-]*[0-9]'
      AND r.remarks REGEXP '[BK][[:space:]:-]*[0-9]'
`

interface TonerCommentRow {
  barcode: string,
  remarks: string
}

interface TonerLife {
  c: number | null,
  m: number | null,
  y: number | null,
  k: number | null
}

function parseTonerLife(comment: string): TonerLife | null {
  if (!comment) return null
  const grab = (letters: string): number | null => {
    const re = new RegExp(`\\b[${letters}][\\s:\\-]*(\\d{1,3})\\b`, 'i')
    const m = comment.match(re)
    return m ? parseInt(m[1], 10) : null
  }
  const c = grab('C')
  const m = grab('M')
  const y = grab('Y')
  const k = grab('BK')
  const found = [c, m, y, k].filter((v) => v !== null).length
  if (found < 3) return null
  return { c, m, y, k }
}

async function getTonerByBarcodeMap(
  con: Connection,
  floor: number,
  ceiling: number
): Promise<Record<string, TonerLife>> {
  const [results] = await con.query<(TonerCommentRow & RowDataPacket)[]>(tonerCommentQuery(floor, ceiling))
  const map: Record<string, TonerLife> = {}
  for (const r of results) {
    const parsed = parseTonerLife(r.remarks)
    if (parsed) {
      map[r.barcode.trim()] = parsed
    }
  }
  return map
}

const techSpecQuery = (floor: number, ceiling: number) => `
    SELECT
        TRIM(barcode) AS barcode,
        
        -- TECHNICAL SPECS
        CAST(acc_cas AS UNSIGNED) AS cassettes,
        TRIM(acc_fin) AS internal_finisher,
        CASE 
            WHEN meter_k=1 THEN meter_color*1000 
            ELSE meter_color
        END AS meter_colour,
        CASE 
            WHEN meter_k=1 THEN meter_black*1000 
            ELSE meter_black
        END AS meter_black,
        CAST(drum_life_C AS UNSIGNED) AS drum_life_c,
        CAST(drum_life_M AS UNSIGNED) AS drum_life_m,
        CAST(drum_life_Y AS UNSIGNED) AS drum_life_y,
        CAST(drum_life_K AS UNSIGNED) AS drum_life_k
    FROM inventory
    WHERE 
      inventory_id BETWEEN ${floor} AND ${ceiling}
      AND ((meter_k=1 AND meter_color < 2147483) OR (meter_k=0 AND meter_color < 2147483647))
      AND ((meter_k=1 AND meter_black < 2147483) OR (meter_k=0 AND meter_black < 2147483647))
      AND ((meter_k=1 AND (meter_black + meter_color) < 2147483) OR (meter_k=0 AND (meter_black + meter_color) < 2147483647))

`

interface TechSpecRow {
  barcode: string,
  cassettes: number,
  internal_finisher: string,
  meter_colour: number,
  meter_black: number,
  drum_life_c: number,
  drum_life_m: number,
  drum_life_y: number,
  drum_life_k: number
}

function techSpecMapper(
  r: TechSpecRow,
  assetMap: Record<string, number>,
  tonerByBarcode: Record<string, TonerLife>): TechnicalSpecificationUncheckedCreateInput {

  const toner = tonerByBarcode[r.barcode]
  return {
    asset_id: assetMap[r.barcode],
    cassettes: r.cassettes,
    internal_finisher: r.internal_finisher,
    meter_black: r.meter_black,
    meter_colour: r.meter_colour,
    meter_total: r.meter_black + r.meter_colour,
    drum_life_c: r.drum_life_c,
    drum_life_m: r.drum_life_m,
    drum_life_y: r.drum_life_y,
    drum_life_k: r.drum_life_k,
    toner_life_c: toner?.c ?? null,
    toner_life_m: toner?.m ?? null,
    toner_life_y: toner?.y ?? null,
    toner_life_k: toner?.k ?? null
  }

}

const techSpecCreator = (prisma: PrismaClient, e: any) => prisma.technicalSpecification.createMany({ data: e })

async function createTechSpecificationEntitiesBatch(
  prisma: PrismaClient,
  con: Connection,
  floor: number,
  ceiling: number,
  assetMap: Record<string, number>) {

  console.log(`fetching source entities. ${floor} - ${ceiling}`)
  const [results] = await con.query<(TechSpecRow & RowDataPacket)[]>(techSpecQuery(floor, ceiling))
  const tonerByBarcode = await getTonerByBarcodeMap(con, floor, ceiling)

  console.log('mapping')
  const mappedEntities = Array.from(results).map((r) => {
    return techSpecMapper(r, assetMap, tonerByBarcode)
  }).filter((r) => !!r.asset_id)

  console.log('creating new entities')
  await techSpecCreator(prisma, mappedEntities)

  console.log(`done. ${mappedEntities.length} created`)
  return mappedEntities.length

}

export async function createTechSpecEntities(prisma: PrismaClient, con: Connection) {

  const assetMap = await getAssetMap(prisma)

  const start = 0
  const step = 50000
  for (let i = start; i <= 600000; i = i + step) {
    let floor = i + 1
    let ceiling = i + step
    await createTechSpecificationEntitiesBatch(prisma, con, floor, ceiling, assetMap)
  }
}
