import { Connection, RowDataPacket } from 'mysql2/promise'
import { PrismaClient } from '../../generated/prisma/client.js'
import { WarehouseUncheckedCreateInput } from '../../generated/prisma/models.js'
import { createManyEntities } from '../utils/utils.js'

//--------------------------------------------------------------------
// (3) WAREHOUSE

const warehouseQuery = `
    SELECT
        city_alias AS city_code,
        name AS street,
        status AS is_active
    FROM warehouse
`

interface WarehouseRow extends RowDataPacket {
  city_code: string,
  street: string,
  is_active: number
}

const warehouseMapper = (r: WarehouseRow): WarehouseUncheckedCreateInput => ({
  city_code: r.city_code,
  street: r.street,
  is_active: !!r.is_active
})

const warehouseCreator = (prisma: PrismaClient, e: any) => prisma.warehouse.createMany({ data: e })

export async function createWarehouseEntities(prisma: PrismaClient, con: Connection) {
  return await createManyEntities(prisma, con, warehouseQuery, warehouseMapper, warehouseCreator)
}

export async function getWarehouseMap(prisma: PrismaClient) {
  const rows = await prisma.warehouse.findMany()

  return rows.reduce((map, r) => {
    map[`${r.city_code}:${r.street}`] = r.id
    return map
  }, {} as Record<string, number>)
}