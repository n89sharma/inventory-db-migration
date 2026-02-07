import { PrismaClient } from '../../generated/prisma/client.js'
import { RowDataPacket, Connection } from 'mysql2/promise'
import { accessoryMap } from '../utils/enummaps.js'
import { getAssetMap } from '../assets/asset.js'

const accessoriesQuery =(floor: number, ceiling: number) => `
    SELECT
        TRIM(i.barcode) AS barcode,
        UPPER(TRIM(a.name)) AS accessory
    FROM accessory a 
    JOIN inventory_accessory ia USING(accessory_id)
    JOIN inventory i USING(inventory_id)
    WHERE ia.inventory_accessory_id BETWEEN ${floor} AND ${ceiling}
    GROUP BY 1,2
`

interface AccessoryRow extends RowDataPacket {
    barcode: string,
    accessory: string
}

function accessoryMapper(
    r: AccessoryRow, 
    assetMap: Record<string, number>) {

    return {
        asset_id: assetMap[r.barcode],
        accessory: accessoryMap[r.accessory]
    }
}

const accessoryCreator = (prisma: PrismaClient, e: any) => prisma.assetAccessory.createMany({data: e})

async function createAccessoriesBatch(
    prisma: PrismaClient, 
    con: Connection, 
    floor: number, 
    ceiling: number,
    assetMap: Record<string, number>) {

    console.log(`fetching source entities. ${floor} - ${ceiling}`)
    const [results] = await con.query<AccessoryRow[]>(accessoriesQuery(floor, ceiling))
    
    console.log('mapping')
    const mappedEntities = Array.from(results).map((r) => {
        return accessoryMapper(r, assetMap)
    }).filter((r) => !!r.asset_id)

    console.log('creating new entities')
    await accessoryCreator(prisma, mappedEntities)
    
    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length
}

export async function createAssetAccessories(prisma: PrismaClient, con: Connection){

    const start = 0
    const step = 50000
    const assetMap = await getAssetMap(prisma)

    for(let i=start; i<1577279; i=i+step) {
        let floor = i + 1
        let ceiling = i + step
        await createAccessoriesBatch(prisma, con, floor, ceiling, assetMap)
    }
}