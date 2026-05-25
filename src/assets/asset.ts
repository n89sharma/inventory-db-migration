import { Connection, RowDataPacket } from 'mysql2/promise'
import { PrismaClient } from '../../generated/prisma/client.js'
import { AssetUncheckedCreateInput } from '../../generated/prisma/models.js'
import { getBrandMap } from '../core/brand.js'
import { getBinLocationMap } from '../core/location.js'
import { getModelMap } from '../core/model.js'
import { getOrganizationMap } from '../core/organization.js'
import { getCountryIdMap, getReadinessIdMap, getStatusIdMap } from '../core/referenceData.js'
import { getWarehouseMap } from '../core/warehouse.js'
import { getArrivalMap, getOriginalArrivalMap } from '../transfers/arrivals.js'
import { getDepartureMap } from '../transfers/departures.js'
import { getHoldMap } from '../transfers/holds.js'
import { getInvoiceMap } from '../transfers/invoices.js'

const countryCommentQuery = (floor: number, ceiling: number) => `
    SELECT TRIM(i.barcode) AS barcode, r.remarks AS remarks
    FROM inventory i
    JOIN inventory_remark_master r ON r.inventory_id = i.inventory_id
    WHERE i.inventory_id BETWEEN ${floor} AND ${ceiling}
      AND r.remarks LIKE '%made in%'
`

interface CountryCommentRow {
  barcode: string,
  remarks: string
}

const assetQuery = (floor: number, ceiling: number) => `
    SELECT
        TRIM(barcode) AS barcode,
        TRIM(serial_number) AS serial_number,
        TRIM(b.name) AS brand,
        TRIM(m.name) AS model,
        TRIM(w.city_alias) AS code,
        TRIM(w.name) AS street,
        
        TRIM(pw.city_alias) AS warehouse_code,
        TRIM(pw.name) AS warehouse_street,
        TRIM(p.name) AS bin,

        -- TYPE AND STATUS ENUMS
        TRIM(s.name) AS status,
        TRIM(ts.name) AS technical_status,

        -- RELATIONS
        TRIM(a.external_invoice_number) AS purchase_invoice_number,
        TRIM(v.account_number) AS arrival_vendor_account_number,
        TRIM(d.external_invoice_number) AS sales_invoice_number,
        TRIM(c.account_number) AS departure_customer_account_number,
        TRIM(a.transaction_number) AS arrival_number,
        TRIM(d.departure_number) AS departure_number,
        TRIM(h.ah_number) AS hold_number,

        i.added_on AS created_at
    FROM inventory i
    JOIN model m USING(model_id)
    JOIN brand b ON b.brand_id=m.brand_id
    JOIN warehouse w USING(warehouse_id)
    JOIN status s USING(status_id)
    LEFT JOIN inventory_location p USING(position_id)
    LEFT JOIN warehouse pw ON pw.warehouse_id = p.warehouse_id
    LEFT JOIN review ts USING(review_id)
    LEFT JOIN arrival a USING(arrival_id)
    LEFT JOIN customer v ON a.vendor_id = v.customer_id
    LEFT JOIN departure d using(departure_id)
    LEFT JOIN customer c ON d.customer_id = c.customer_id
    LEFT JOIN allot_hold_master h ON h.allot_hold_id = i.hold_id
    WHERE i.inventory_id BETWEEN ${floor} AND ${ceiling}
`

interface AssetRow {
  barcode: string,
  serial_number: string,
  brand: string,
  model: string,
  code: string,
  street: string,

  warehouse_code: string,
  warehouse_street: string,
  bin: string,

  status: string,
  technical_status: string,

  purchase_invoice_number: string,
  arrival_vendor_account_number: string,
  sales_invoice_number: string,
  departure_customer_account_number: string,
  arrival_number: string,
  departure_number: string,
  hold_number: string,

  created_at: string
}

function assetMapper(
  r: AssetRow,
  brandMap: Record<string, number>,
  modelMap: Record<string, number>,
  warehouseMap: Record<string, number>,
  invoiceMap: Record<string, number>,
  arrivalMap: Record<string, number>,
  departureMap: Record<string, number>,
  holdMap: Record<string, number>,
  originalArrivalMap: Record<string, string>,
  orgMap: Record<string, number>,
  statusMap: Record<string, number>,
  readinessMap: Record<string, number>,
  binLocationMap: Record<string, number>,
  countryByBarcode: Record<string, number>): AssetUncheckedCreateInput {

  if (!statusMap[r.status]) throw new Error(`No status in ${r.barcode}, ${r.status}`)
  return {
    barcode: r.barcode,
    serial_number: r.serial_number,
    model_id: modelMap[`${brandMap[r.brand]}:${r.model}`],
    location_id: binLocationMap[`${warehouseMap[`${r.warehouse_code}:${r.warehouse_street}`]}:${r.bin}`],
    status_id: statusMap[r.status],
    readiness_id: !!readinessMap[r.technical_status] ? readinessMap[r.technical_status] : readinessMap['Not Tested'],
    purchase_invoice_id: invoiceMap[`${orgMap[r.arrival_vendor_account_number]}:${r.purchase_invoice_number}`],
    sales_invoice_id: null,
    arrival_id: arrivalMap[r.arrival_number] ? arrivalMap[r.arrival_number] : arrivalMap[originalArrivalMap[r.barcode]],
    departure_id: departureMap[r.departure_number],
    hold_id: holdMap[r.hold_number],
    country_of_origin_id: countryByBarcode[r.barcode] ?? null,
    created_at: new Date(r.created_at)
  }
}

async function getCountryByBarcodeMap(
  con: Connection,
  countryMap: Record<string, number>,
  floor: number,
  ceiling: number
): Promise<Record<string, number>> {
  const [results] = await con.query<(CountryCommentRow & RowDataPacket)[]>(countryCommentQuery(floor, ceiling))
  const map: Record<string, number> = {}
  for (const r of results) {
    const countryId = getCountryIdFromComment(r.remarks, countryMap)
    if (countryId !== null) {
      map[r.barcode.trim()] = countryId
    }
  }
  return map
}

function getCountryIdFromComment(comment: string, countryMap: Record<string, number>): number | null {
  const match = comment?.match(/made in (\w+)/i)
  if (!match) return null
  return countryMap[match[1].toUpperCase()] ?? null
}

const assetCreator = (prisma: PrismaClient, e: any) => prisma.asset.createMany({ data: e })

async function createAssetEntitiesBatch(
  prisma: PrismaClient,
  con: Connection,
  floor: number,
  ceiling: number,
  brandMap: Record<string, number>,
  modelMap: Record<string, number>,
  warehouseMap: Record<string, number>,
  invoiceMap: Record<string, number>,
  arrivalMap: Record<string, number>,
  departureMap: Record<string, number>,
  holdMap: Record<string, number>,
  originalArrivalMap: Record<string, string>,
  orgMap: Record<string, number>,
  statusMap: Record<string, number>,
  readinessMap: Record<string, number>,
  binLocationMap: Record<string, number>,
  countryMap: Record<string, number>) {

  console.log(`fetching source entities. ${floor} - ${ceiling}`)
  const [results] = await con.query<(AssetRow & RowDataPacket)[]>(assetQuery(floor, ceiling))
  const countryByBarcode = await getCountryByBarcodeMap(con, countryMap, floor, ceiling)

  console.log('mapping')

  const mappedEntities = Array.from(results).map((r) => {
    return assetMapper(
      r,
      brandMap,
      modelMap,
      warehouseMap,
      invoiceMap,
      arrivalMap,
      departureMap,
      holdMap,
      originalArrivalMap,
      orgMap,
      statusMap,
      readinessMap,
      binLocationMap,
      countryByBarcode
    )
  })

  console.log('creating new entities')
  await assetCreator(prisma, mappedEntities)

  console.log(`done. ${mappedEntities.length} created`)
  return mappedEntities.length
}

export async function createAssetEntities(prisma: PrismaClient, con: Connection) {

  const brandMap = await getBrandMap(prisma)
  const modelMap = await getModelMap(prisma)
  const warehouseMap = await getWarehouseMap(prisma)
  const invoiceMap = await getInvoiceMap(prisma)
  const arrivalMap = await getArrivalMap(prisma)
  const departureMap = await getDepartureMap(prisma)
  const holdMap = await getHoldMap(prisma)
  const originalArrivalMap = await getOriginalArrivalMap(con)
  const orgMap = await getOrganizationMap(prisma)
  const statusMap = await getStatusIdMap(prisma)
  const readinessMap = await getReadinessIdMap(prisma)
  const binLocationMap = await getBinLocationMap(prisma)
  const countryMap = await getCountryIdMap(prisma)

  const start = 0
  const step = 50000
  for (let i = start; i <= 600000; i = i + step) {
    let floor = i + 1
    let ceiling = i + step
    await createAssetEntitiesBatch(
      prisma,
      con,
      floor,
      ceiling,
      brandMap,
      modelMap,
      warehouseMap,
      invoiceMap,
      arrivalMap,
      departureMap,
      holdMap,
      originalArrivalMap,
      orgMap,
      statusMap,
      readinessMap,
      binLocationMap,
      countryMap
    )
  }
}

export async function getAssetMap(prisma: PrismaClient) {
  const entities = await prisma.asset.findMany()

  return entities.reduce((map, e) => {
    map[e.barcode] = e.id
    return map
  }, {} as Record<string, number>)
}
