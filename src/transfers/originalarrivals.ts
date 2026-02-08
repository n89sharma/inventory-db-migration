import { PrismaClient } from '../../generated/prisma/client.js'
import { RowDataPacket, Connection } from 'mysql2/promise'
import { getOrganizationMap } from '../core/organization.js'
import { getWarehouseMap } from '../core/warehouse.js'
import { getUserMap } from '../core/user.js'
import { getArrivalMap } from './arrivals.js'
import { getAssetMap } from '../assets/asset.js'

const missingArrivalsQuery = `
    select
        barcode
    from "Asset"
    where arrival_id is null
`

const sourceHistoryArrivalQuery = `
    SELECT
        TRIM(barcode) AS barcode,
        TRIM(a.transaction_number) AS arrival_number
    FROM inventory_history i
    JOIN arrival a USING(arrival_id)
    WHERE barcode IN (?)
`

interface OriginalArrivalRow extends RowDataPacket {
    barcode: string,
    arrival_number: string
}

interface Barcode extends RowDataPacket {
    barcode: string
}

export async function updateOriginalArrivalOfAssets (
    prisma: PrismaClient,
    con: Connection) {

    const arrivalMap = await getArrivalMap(prisma)
    const assetMap = await getAssetMap(prisma)

    console.log('fetching missing target entities')
    const assetWithoutArrivalId = await prisma.$queryRawUnsafe<Barcode[]>(missingArrivalsQuery)

    console.log('fetching source entities')
    const [results] = await con.query<OriginalArrivalRow[]>(
        sourceHistoryArrivalQuery, 
        Array.from(assetWithoutArrivalId))
    
    let i = 0;
    for(const r of results) {
        i++;
        console.log(`updating ${r.barcode}, ${r.arrival_number} | ${i}\\${results.length}`)
        await prisma.asset.update({
            where:{ barcode: r.barcode},
            data:{ arrival_id: arrivalMap[r.arrival_number]}
        })
    }
}