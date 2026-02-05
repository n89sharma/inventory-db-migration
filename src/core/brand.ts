import { PrismaClient } from '../../generated/prisma/client.js'
import { RowDataPacket } from 'mysql2/promise'
import { Connection } from 'mysql2/promise'
import { createManyEntities } from './utils.js'

//--------------------------------------------------------------------
// (1) BRANDS
const brandQuery = `
    SELECT
        TRIM(name) AS brand_name
    FROM brand
    GROUP BY 1
`

interface BrandRow extends RowDataPacket{
    brand_name: string
}

const brandMapper = (r: BrandRow) => ({ name: r.brand_name})

const brandCreator = (prisma: PrismaClient, e: any) => prisma.brand.createMany({data: e})

export async function createBrandEntities(prisma: PrismaClient, con: Connection) {
    return await createManyEntities(prisma, con, brandQuery, brandMapper, brandCreator)
}

export async function getBrandMap(prisma: PrismaClient) {
  const brands = await prisma.brand.findMany()
  
  return brands.reduce((map, brand) => {
    map[brand.name] = brand.id
    return map
  }, {} as Record<string, number>)
}
