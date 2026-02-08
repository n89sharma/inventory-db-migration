import { PrismaClient } from '../../generated/prisma/client.js'
import { RowDataPacket, Connection } from 'mysql2/promise'
import { getAssetMap } from './asset.js'

const techSpecQuery = (floor: number, ceiling: number) => `
    SELECT
        TRIM(barcode) AS barcode,
        
        -- TECHNICAL SPECS
        CAST(acc_cas AS UNSIGNED) AS cassettes,
        TRIM(acc_fin) AS internal_finisher,
        CASE 
            WHEN meter_k=1 THEN meter_color*1000 
            ELSE meter_color
        END AS meter_colour,
        CASE 
            WHEN meter_k=1 THEN meter_black*1000 
            ELSE meter_black
        END AS meter_black,
        CAST(drum_life_C AS UNSIGNED) AS drum_life_c,
        CAST(drum_life_M AS UNSIGNED) AS drum_life_m,
        CAST(drum_life_Y AS UNSIGNED) AS drum_life_y,
        CAST(drum_life_K AS UNSIGNED) AS drum_life_k
    FROM inventory
    WHERE inventory_id BETWEEN ${floor} AND ${ceiling}
`

interface TechSpecRow extends RowDataPacket {
    barcode: string,
    cassettes: number,
    internal_finisher: string,
    meter_colour: number,
    meter_black: number,
    drum_life_c: number,
    drum_life_m: number,
    drum_life_y: number,
    drum_life_k: number
}

function techSpecMapper(
    r: TechSpecRow, 
    assetMap: Record<string, number>) {

    return { 
        asset_id: assetMap[r.barcode],
        cassettes: r.cassettes,
        internal_finisher: r.internal_finisher,
        meter_black: r.meter_black,
        meter_colour: r.meter_colour,
        meter_total: r.meter_black + r.meter_colour,
        drum_life_c: r.drum_life_c,
        drum_life_m: r.drum_life_m,
        drum_life_y: r.drum_life_y,
        drum_life_k: r.drum_life_k
    }
    
}

const techSpecCreator = (prisma: PrismaClient, e: any) => prisma.technicalSpecification.createMany({data: e})

async function createTechSpecificationEntitiesBatch(
    prisma: PrismaClient, 
    con: Connection, 
    floor: number, 
    ceiling: number,
    assetMap: Record<string, number>) {

    console.log(`fetching source entities. ${floor} - ${ceiling}`)
    const [results] = await con.query<TechSpecRow[]>(techSpecQuery(floor, ceiling))
    
    console.log('mapping')
    const mappedEntities = Array.from(results).map((r) => {
        return techSpecMapper(r, assetMap)
    }).filter((r) => !!r.asset_id)

    console.log('creating new entities')
    await techSpecCreator(prisma, mappedEntities)
    
    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length

}

export async function createTechSpecEntities(prisma: PrismaClient, con: Connection) {

    const assetMap = await getAssetMap(prisma)

    const start = 0
    const step = 50000
    for(let i=start; i<=500000; i=i+step) {
        let floor = i + 1
        let ceiling = i + step
        await createTechSpecificationEntitiesBatch(prisma, con, floor, ceiling, assetMap)
    }
}
