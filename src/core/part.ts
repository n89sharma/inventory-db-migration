import { PrismaClient } from '../../generated/prisma/client.js'
import { RowDataPacket } from 'mysql2/promise'
import { createManyEntities } from './createntities.js'
import { Connection } from 'mysql2/promise'

//--------------------------------------------------------------------
// (6) PART

const partQuery = `
    SELECT
        p.part_number AS part_number,
        MAX(p.part_description) AS description,
        MAX(p.dealer_price) AS dealer_price,
        MAX(p.sale_price) AS sale_price,
        MAX(p.cost_price) AS cost
    FROM bulk_item p
    GROUP BY 1
`

interface PartRow extends RowDataPacket {
    description: string,
    part_number: string,
    dealer_price: string,
    sale_price: string,
    cost: string
}

const partMapper = (r: PartRow) => ({
    description: r.description,
    part_number: r.part_number,
    dealer_price: parseFloat(r.sale_price).toFixed(2),
    sale_price: parseFloat(r.sale_price).toFixed(2),
    cost: parseFloat(r.cost).toFixed(2)
})

const partCreator = (prisma: PrismaClient, e: any) => prisma.part.createMany({data: e})

export async function createPartEntities(prisma: PrismaClient, con: Connection) {
    return await createManyEntities(prisma, con, partQuery, partMapper, partCreator)
}

export async function getPartMap(prisma: PrismaClient) {
  const parts = await prisma.part.findMany()
  
  return parts.reduce((map, part) => {
    map[part.part_number] = part.id
    return map
  }, {} as Record<string, number>)
}