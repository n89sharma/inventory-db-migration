import { PrismaClient } from '../../generated/prisma/client.js'
import { RowDataPacket, Connection } from 'mysql2/promise'
import { getAssetMap } from '../assets/asset.js'
import { getErrorMap } from '../core/error.js'
import { getUserMap } from '../core/user.js'
import { getBrandMap } from '../core/brand.js'

const errorQuery = `
    SELECT
        TRIM(i.barcode) AS barcode,
        TRIM(b.name) AS brand,
        TRIM(e.short_name) AS code,
        CASE 
            WHEN ie.error_status = 2 THEN TRUE 
            ELSE FALSE
        END AS is_fixed,
        CASE 
            WHEN TRIM(ie.updated_on) = '0000-00-00 00:00:00' THEN NULL
            ELSE TRIM(ie.updated_on)
        END AS updated_on,
        UPPER(TRIM(u.user_name)) AS username
    FROM inventory_errors ie
    JOIN error e USING(error_id)
    JOIN inventory i USING(inventory_id)
    JOIN error_category c USING(error_category_id)
    JOIN brand b ON b.brand_id = c.Brand_id
    LEFT JOIN user u ON u.user_id = ie.updated_by
    GROUP BY 1,3
`

interface ErrorRow extends RowDataPacket {
    barcode: string,
    brand: string,
    code: string,
    is_fixed: boolean,
    updated_on: string,
    username: string
}

function errorMapper(
    r: ErrorRow,
    assetMap: Record<string, number>,
    userMap: Record<string, number>,
    errorMap: Record<string, number>,
    brandMap: Record<string, number>) {
    
    return {
        asset_id: assetMap[r.barcode],
        error_id: errorMap[`${brandMap[r.brand]}:${r.code}`],
        is_fixed: !!r.is_fixed,
        added_by: null,
        added_at: null,
        fixed_by: userMap[r.username] ? userMap[r.username] : null,
        fixed_at: r.updated_on ? new Date(r.updated_on) : null
    }
    
}

const errorCreator = (prisma: PrismaClient, e: any) => prisma.assetError.createMany({data: e})

export async function createAssetErrorEntities(prisma: PrismaClient, con: Connection) {
    console.log(`fetching source entities.`)
    const [results] = await con.query<ErrorRow[]>(errorQuery)
    
    console.log('mapping')
    const assetMap = await getAssetMap(prisma)
    const userMap = await getUserMap(prisma)
    const errorMap = await getErrorMap(prisma)
    const brandMap = await getBrandMap(prisma)

    const mappedEntities = Array.from(results).map((r) => {
        return errorMapper(r, assetMap, userMap, errorMap, brandMap)
    }).filter((r) => !!r.asset_id)

    console.log('creating new entities')
    await errorCreator(prisma, mappedEntities)
    
    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length
}