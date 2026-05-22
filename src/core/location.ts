import { Connection, RowDataPacket } from 'mysql2/promise'
import { PrismaClient } from '../../generated/prisma/client.js'
import { LocationUncheckedCreateInput } from '../../generated/prisma/models.js'
import { getZoneIdMap } from './referenceData.js'
import { getWarehouseMap } from './warehouse.js'

//--------------------------------------------------------------------
// (4) LOCATION

const locationQuery = `
    SELECT 
        TRIM(w.city_alias) AS city_code,
        TRIM(w.name) AS street,
        TRIM(l.name) AS bin
    FROM inventory_location l
    JOIN warehouse w USING(warehouse_id)
    WHERE TRIM(l.name) LIKE '%-%' AND w.warehouse_id IN (3,12)
    GROUP BY 1,2,3
`

interface LocationRow {
  city_code: string,
  street: string,
  bin: string
}

const locationMapper = (
  r: LocationRow,
  warehouseMap: Record<string, number>,
  zoneMap: Record<string, number>): LocationUncheckedCreateInput => ({

    warehouse_id: warehouseMap[`${r.city_code}:${r.street}`],
    zone_id: zoneMap['BIN'],
    bin: r.bin
  })

const locationCreator = (prisma: PrismaClient, e: any) => prisma.location.createMany({ data: e })

export async function createLocationEntities(prisma: PrismaClient, con: Connection) {

  await createStandardZoneLocations(prisma)

  console.log('fetching source entities')
  const [results] = await con.query<(LocationRow & RowDataPacket)[]>(locationQuery)

  console.log('mapping')
  const warehouseMap = await getWarehouseMap(prisma)
  const zoneMap = await getZoneIdMap(prisma)
  const mappedEntities = Array.from(results).map((r) => {
    return locationMapper(r, warehouseMap, zoneMap)
  })

  console.log('creating new entities')
  await locationCreator(prisma, mappedEntities)

  console.log(`done. ${mappedEntities.length} created`)
  return mappedEntities.length
}

export async function createStandardZoneLocations(prisma: PrismaClient) {
  const warehouses = await prisma.warehouse.findMany()
  const zoneMap = await getZoneIdMap(prisma)
  const zones = ['TECH', 'SHIPPING_AND_RECEIVING', 'PARTS']

  const data = warehouses.flatMap((w) =>
    zones.map((z) => ({
      warehouse_id: w.id,
      zone_id: zoneMap[z],
    }))
  )

  await prisma.location.createMany({ data })
  return data.length
}

export async function getBinLocationMap(prisma: PrismaClient) {
  const rows = await prisma.location.findMany({ where: { zone: { zone: "BIN" } } })
  return rows.reduce((map, l) => {
    map[`${l.warehouse_id}:${l.bin}`] = l.id
    return map
  }, {} as Record<string, number>)
}