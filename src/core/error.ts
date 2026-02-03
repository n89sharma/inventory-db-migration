import { PrismaClient } from '../../generated/prisma/client.js'
import { RowDataPacket } from 'mysql2/promise'
import { Connection } from 'mysql2/promise'
import { getBrandMap } from './brand.js'

//--------------------------------------------------------------------
// (5) ERROR

const errorQuery = `
    SELECT 
        TRIM(b.name) AS brand_name,
        TRIM(e.short_name) AS code,
        MAX(TRIM(e.name)) AS description,
        CASE 
            WHEN MAX(TRIM(c.category_name)) LIKE '%ÃƒÆ’Ã%' THEN 'Unknown'
            ELSE MAX(TRIM(c.category_name))
        END AS category
    FROM error e
    LEFT JOIN error_category c USING(error_category_id)
    JOIN brand b ON b.brand_id = c.Brand_id
    GROUP BY 1,2
`

interface ErrorRow extends RowDataPacket {
    brand_name: string,
    code: string,
    description: string,
    category: string
}

const errorMapper = (r: ErrorRow, brandMap: Record<string, number>) => ({
    brand_id: brandMap[r.brand_name],
    code: r.code,
    description: r.description,
    category: r.category
})

const errorCreator = (prisma: PrismaClient, e: any) => prisma.error.createMany({data: e})

export async function createErrorEntities(prisma: PrismaClient, con: Connection) {

    console.log('fetching source entities')
    const [results] = await con.query<ErrorRow[]>(errorQuery)
    
    console.log('mapping')
    const brandMap = await getBrandMap(prisma)
    const mappedEntities = Array.from(results).map((r) => {
        return errorMapper(r, brandMap)
    }) 
    
    console.log('creating new entities')
    await errorCreator(prisma, mappedEntities)
    
    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length
}