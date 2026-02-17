import { Connection, RowDataPacket } from 'mysql2/promise'
import { PrismaClient } from '../../generated/prisma/client.js'
import { getAssetMap } from '../assets/asset.js'
import { getTransferMap } from '../transfers/transfers.js'

const assetTransferQuery = (floor: number, ceiling: number) => `
    SELECT
        TRIM(h.barcode) AS barcode,
        TRIM(t.transfer_number) AS transfer_number
    FROM inventory_history h 
    JOIN transfer t USING(transfer_id)
    WHERE 
        TRIM(t.transfer_number) != ''
        AND h.inventory_history_id BETWEEN ${floor} AND ${ceiling}
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

async function createAssetTransferBatch(
    prisma: PrismaClient,
    con: Connection,
    floor: number,
    ceiling: number,
    assetMap: Record<string, number>,
    transferMap: Record<string, number>) {

    console.log(`fetching source entities. ${floor} - ${ceiling}`)
    const [results] = await con.query<AssetTransferRow[]>(assetTransferQuery(floor, ceiling))

    console.log('mapping')
    const mappedEntities = Array.from(results).map((r) => {
        return assetTransferMapper(r, assetMap, transferMap)
    }).filter((r) => !!r.asset_id)

    console.log('creating new entities')
    await assetTransferCreator(prisma, mappedEntities)

    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length
}

export async function createAssetTransferEntities(prisma: PrismaClient, con: Connection) {

    const start = 0
    const step = 50000
    const assetMap = await getAssetMap(prisma)
    const transferMap = await getTransferMap(prisma)

    for (let i = start; i < 250000; i = i + step) {
        let floor = i + 1
        let ceiling = i + step
        await createAssetTransferBatch(prisma, con, floor, ceiling, assetMap, transferMap)
    }
}