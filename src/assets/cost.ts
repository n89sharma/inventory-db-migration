import { PrismaClient } from '../../generated/prisma/client.js'
import { RowDataPacket, Connection } from 'mysql2/promise'
import { getAssetMap } from './asset.js'

const costQuery = (floor: number, ceiling: number) => `
    SELECT
        TRIM(barcode) AS barcode,
        
        -- COST
        base_cost AS purchase_cost,
        transport_cost AS transport_cost,
        processing_cost AS processing_cost,
        other_cost AS other_cost,
        value_added_cost AS parts_cost,
        sale_cost AS sale_price
    FROM inventory
    WHERE inventory_id BETWEEN ${floor} AND ${ceiling}
`

interface CostRow extends RowDataPacket {
    barcode: string,
    purchase_cost: string,
    transport_cost: string,
    processing_cost: string,
    other_cost: string,
    parts_cost: string,
    sale_price: string
} 

function costMapper(
    r: CostRow, 
    assetMap: Record<string, number>) {

    const purchaseCost = parseFloat(r.purchase_cost).toFixed(2)
    const transportCost = parseFloat(r.transport_cost).toFixed(2)
    const processingCost = parseFloat(r.processing_cost).toFixed(2)
    const otherCost = parseFloat(r.other_cost).toFixed(2)
    const partsCost = parseFloat(r.parts_cost).toFixed(2)
    const totalCost = (parseFloat(r.purchase_cost)+ 
                        parseFloat(r.transport_cost)+
                        parseFloat(r.processing_cost)+
                        parseFloat(r.other_cost)+
                        parseFloat(r.parts_cost)).toFixed(2)
    const salePrice = parseFloat(r.sale_price).toFixed(2)
    return {
        asset_id: assetMap[r.barcode],
        purchase_cost: purchaseCost,
        transport_cost: transportCost,
        processing_cost: processingCost,
        other_cost: otherCost,
        parts_cost: partsCost,
        total_cost: totalCost,
        sale_price: salePrice
    }
}

const costCreator = (prisma: PrismaClient, e: any) => prisma.cost.createMany({ data: e})

async function createCostEntitiesBatch(
    prisma: PrismaClient, 
    con: Connection, 
    floor: number, 
    ceiling: number) {

    console.log(`fetching source entities. ${floor} - ${ceiling}`)
    const [results] = await con.query<CostRow[]>(costQuery(floor, ceiling))
    
    console.log('mapping')
    const assetMap = await getAssetMap(prisma)

    const mappedEntities = Array.from(results).map((r) => {
        return costMapper(r, assetMap)
    }).filter((r) => !!r.asset_id)

    console.log('creating new entities')
    await costCreator(prisma, mappedEntities)
    
    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length

} 

export async function createCostEntities(prisma: PrismaClient, con: Connection) {

    const start = 0
    const step = 20000
    for(let i=start; i<500000; i=i+step) {
        let floor = i + 1
        let ceiling = i + step
        await createCostEntitiesBatch(prisma, con, floor, ceiling)
    }
}