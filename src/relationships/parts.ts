import { Connection, RowDataPacket } from 'mysql2/promise'
import { PrismaClient } from '../../generated/prisma/client.js'
import { getUserMap } from '../core/user.js'
import { getAssetMap } from '../assets/asset.js'

const assetPartsQuery = `
    SELECT 
        TRIM(v.barcode) AS recipient,
        TRIM(i.barcode) AS donor,
        v.added_on AS updated_at,
        UPPER(TRIM(u.user_name)) AS updated_by,
        TRIM(v.remark) AS notes
    FROM value_added v
    LEFT JOIN inventory i ON i.inventory_id=v.source_key_item
    LEFT JOIN user u ON u.user_id=v.added_by
    WHERE SOURCE='Old Machine'
`

interface AssetPartRow extends RowDataPacket {
    recipient: string,
    donor: string,
    updated_at: string,
    updated_by: string,
    notes: string
}

function assetPartMapper(
    r: AssetPartRow,
    assetMap: Record<string, number>,
    userMap: Record<string, number>
) {
    return {
        recipient_asset_id: assetMap[r.recipient],
        donor_asset_id: assetMap[r.donor],
        updated_at: new Date(r.updated_at),
        updated_by: userMap[r.updated_by],
        notes: r.notes
    }
}

const assetPartCreator = (prisma: PrismaClient, e:any) => prisma.assetPart.createMany({data: e})

export async function createAssetPartEntities(prisma: PrismaClient, con: Connection) {

    console.log(`fetching source entities.`)
    const [results] = await con.query<AssetPartRow[]>(assetPartsQuery)

    console.log('mapping')
    const assetMap = await getAssetMap(prisma)
    const userMap = await getUserMap(prisma)

    const mappedEntities = Array.from(results).map((r) => {
        return assetPartMapper(r, assetMap, userMap)
    }).filter((r) => !!r.recipient_asset_id)

    console.log('creating new entities')
    await assetPartCreator(prisma, mappedEntities)

    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length
}