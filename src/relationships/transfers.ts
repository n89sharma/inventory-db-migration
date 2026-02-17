import { Connection, RowDataPacket } from 'mysql2/promise'
import { PrismaClient } from '../../generated/prisma/client.js'
import { getAssetMap } from '../assets/asset.js'
import { getTransferMap } from '../transfers/transfers.js'

const assetTransferQuery  = `
    SELECT
        TRIM(h.barcode) AS barcode,
        TRIM(t.transfer_number) AS transfer_number
    FROM inventory_history h 
    JOIN transfer t USING(transfer_id)
    WHERE 
        TRIM(t.transfer_number) != ''
    GROUP BY 1,2
`

interface AssetTransferRow extends RowDataPacket {
    barcode: string,
    transfer_number: string
}

function assetTransferMapper(
    r: AssetTransferRow,
    assetMap: Record<string, number>,
    transferMap: Record<string, number>
) {
    return {
        asset_id: assetMap[r.barcode],
        transfer_id: transferMap[r.transfer_number]
    }
}

const assetTransferCreator = (prisma: PrismaClient, e: any) => prisma.assetTransfer.createMany({ data: e })

export async function createAssetTransferEntities(prisma: PrismaClient, con: Connection) {

    console.log(`fetching source entities.`)
    const [results] = await con.query<AssetTransferRow[]>(assetTransferQuery)

    console.log('mapping')
    const assetMap = await getAssetMap(prisma)
    const transferMap = await getTransferMap(prisma)

    const mappedEntities = Array.from(results).map((r) => {
        return assetTransferMapper(r, assetMap, transferMap)
    }).filter((r) => !!r.asset_id && !!r.transfer_id)

    console.log('creating new entities')
    await assetTransferCreator(prisma, mappedEntities)

    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length
}