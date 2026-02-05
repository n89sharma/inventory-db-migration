import { PrismaClient } from '../../generated/prisma/client.js'
import { RowDataPacket, Connection } from 'mysql2/promise'
import { getAssetMap } from './asset.js'
import { getUserMap } from '../core/user.js'

const commentQuery = (floor: number, ceiling: number) => `
    SELECT 
        TRIM(i.barcode) AS barcode,
        UPPER(TRIM(u.user_name)) AS created_by,
        TRIM(c.remarks) AS comment,
        CASE 
            WHEN c.added_on = '0000-00-00 00:00:00' THEN '2000-01-01 00:00:00'
            ELSE c.added_on
        END AS created_at,
        CASE 
            WHEN c.added_on = '0000-00-00 00:00:00' THEN '2000-01-01 00:00:00'
            ELSE c.added_on
        END AS updated_at
    FROM inventory_remark_master c
    JOIN inventory i USING(inventory_id)
    JOIN user u ON u.user_id = c.added_by
    WHERE c.inventory_remark_master_id BETWEEN ${floor} AND ${ceiling}
`

interface CommentRow extends RowDataPacket {
    barcode: string,
    created_by: string,
    comment: string,
    created_at: string,
    updated_at: string
}

function commentMapper(
    r: CommentRow, 
    assetMap: Record<string, number>,
    userMap: Record<string, number>
) {
    return {
        asset_id: assetMap[r.barcode],
        created_by_id: userMap[r.created_by] ? userMap[r.created_by] : 289,
        comment: r.comment,
        created_at: new Date(r.created_at),
        updated_at: new Date(r.updated_at)
    }
}

const commentCreator = (prisma: PrismaClient, e: any) => prisma.comment.createMany({data: e})

async function createAssetEntitiesBatch(
    prisma: PrismaClient, 
    con: Connection, 
    floor: number, 
    ceiling: number,
    assetMap: Record<string, number>,
    userMap: Record<string, number>) {

    console.log(`fetching source entities. ${floor} - ${ceiling}`)
    const [results] = await con.query<CommentRow[]>(commentQuery(floor, ceiling))
    
    console.log('mapping')
    const mappedEntities = Array.from(results).map((r) => {
        return commentMapper(r, assetMap, userMap)
    }).filter((r) => !!r.asset_id)

    console.log('creating new entities')
    await commentCreator(prisma, mappedEntities)
    
    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length
}

export async function createCommentEntities(prisma: PrismaClient, con: Connection){

    const start = 0
    const step = 20000
    const assetMap = await getAssetMap(prisma)
    const userMap = await getUserMap(prisma)

    for(let i=start; i<381007; i=i+step) {
        let floor = i + 1
        let ceiling = i + step
        await createAssetEntitiesBatch(prisma, con, floor, ceiling, assetMap, userMap)
    }
}