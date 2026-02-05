import { PrismaClient, TechnicalStatus } from '../../generated/prisma/client.js'
import { RowDataPacket, Connection } from 'mysql2/promise'
import { getWarehouseMap } from '../core/warehouse.js'
import { getModelMap } from '../core/model.js'
import { getInvoiceMap } from '../transfers/invoices.js'
import { getArrivalMap } from '../transfers/arrivals.js'
import { getDepartureMap } from '../transfers/departures.js'
import { getHoldMap } from '../transfers/holds.js'
import { assetTypeMap, availabilityStatusMap, technicalStatusMap, trackingStatusMap } from '../core/enummaps.js'
import { getBrandMap } from '../core/brand.js'

const assetQuery = (floor: number, ceiling: number) => `
    SELECT
        TRIM(barcode) AS barcode,
        TRIM(serial_number) AS serial_number,
        TRIM(b.name) AS brand,
        TRIM(m.name) AS model,
        TRIM(w.city_alias) AS code,
        TRIM(w.name) AS street,
        
        TRIM(pw.city_alias) AS location_code,
        TRIM(pw.name) AS location_street,
        TRIM(p.name) AS location,

        -- TYPE AND STATUS ENUMS
        TRIM(t.name) AS asset_type,
        TRIM(s.name) AS status,
        TRIM(ts.name) AS technical_status,

        -- RELATIONS
        TRIM(a.external_invoice_number) AS purchase_invoice_number,
        TRIM(v.account_number) AS arrival_vendor_account_number,
        TRIM(d.external_invoice_number) AS sales_invoice_number,
        TRIM(c.account_number) AS departure_customer_account_number,
        TRIM(a.transaction_number) AS arrival_number,
        TRIM(d.departure_number) AS departure_number,
        TRIM(h.ah_number) AS hold_number,

        i.added_on AS created_at
    FROM inventory i
    JOIN model m USING(model_id)
    JOIN brand b ON b.brand_id=m.brand_id
    JOIN warehouse w USING(warehouse_id)
    JOIN asset_type t ON t.asset_type_id = i.asset_type_id
    JOIN status s USING(status_id)
    LEFT JOIN inventory_location p USING(position_id)
    LEFT JOIN warehouse pw ON pw.warehouse_id = p.warehouse_id
    LEFT JOIN review ts USING(review_id)
    LEFT JOIN arrival a USING(arrival_id)
    LEFT JOIN customer v ON a.vendor_id = v.customer_id
    LEFT JOIN departure d using(departure_id)
    LEFT JOIN customer c ON d.customer_id = c.customer_id
    LEFT JOIN allot_hold_master h ON h.allot_hold_id = i.hold_id
    WHERE i.inventory_id BETWEEN ${floor} AND ${ceiling}
`

interface AssetRow extends RowDataPacket {
    barcode: string,
    serial_number: string,
    brand: string,
    model: string,
    code: string,
    street: string,

    location_code: string,
    location_street: string,
    location: string,

    asset_type: string,
    status: string,
    technical_status: string,

    purchase_invoice_number: string,
    arrival_vendor_account_number: string,
    sales_invoice_number: string,
    departure_customer_account_number: string,
    arrival_number: string,
    departure_number: string,
    hold_number: string,

    created_at: string
}

function assetMapper(
    r: AssetRow, 
    brandMap: Record<string, number>,
    modelMap: Record<string, number>,
    warehouseMap: Record<string, number>,
    invoiceMap: Record<string, number>,
    arrivalMap: Record<string, number>,
    departureMap: Record<string, number>,
    holdMap: Record<string, number>
) {

    return {
        barcode: r.barcode,
        serial_number: r.serial_number,
        model_id: modelMap[`${brandMap[r.brand]}:${r.model}`],
        warehouse_id: warehouseMap[`${r.location_code}:${r.location_street}`],
        asset_location: r.location,
        asset_type: assetTypeMap[r.asset_type],
        tracking_status: trackingStatusMap[r.status],
        availability_status: availabilityStatusMap[r.status],
        technical_status: technicalStatusMap[r.technical_status] ? technicalStatusMap[r.technical_status] : TechnicalStatus.NOT_TESTED,
        purchase_invoice_id: invoiceMap[`${r.arrival_vendor_account_number}:${r.purchase_invoice_number}`],
        sales_invoice_id: null,
        arrival_id:  arrivalMap[r.arrival_number],
        departure_id: departureMap[r.departure_number],
        hold_id: holdMap[r.hold_number],
        created_at: new Date(r.created_at),
        is_held: !!holdMap[r.hold_number]

    }
}

const assetCreator = (prisma: PrismaClient, e: any) => prisma.asset.createMany({data: e})

async function createAssetEntitiesBatch(
    prisma: PrismaClient, 
    con: Connection, 
    floor: number, 
    ceiling: number) {

    console.log(`fetching source entities. ${floor} - ${ceiling}`)
    const [results] = await con.query<AssetRow[]>(assetQuery(floor, ceiling))
    
    console.log('mapping')
    const brandMap = await getBrandMap(prisma)
    const modelMap = await getModelMap(prisma)
    const warehouseMap = await getWarehouseMap(prisma)
    const invoiceMap = await getInvoiceMap(prisma)
    const arrivalMap = await getArrivalMap(prisma)
    const departureMap = await getDepartureMap(prisma)
    const holdMap = await getHoldMap(prisma)

    const mappedEntities = Array.from(results).map((r) => {
        return assetMapper(
            r,
            brandMap,
            modelMap, 
            warehouseMap,
            invoiceMap,
            arrivalMap,
            departureMap,
            holdMap
        )
    }) 

    console.log('creating new entities')
    await assetCreator(prisma, mappedEntities)
    
    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length
}

export async function createAssetEntities(prisma: PrismaClient, con: Connection){

    const start = 0
    const step = 20000
    for(let i=start; i<=500000; i=i+step) {
        let floor = i + 1
        let ceiling = i + step
        await createAssetEntitiesBatch(prisma, con, floor, ceiling)
    }
}

export async function getAssetMap(prisma: PrismaClient) {
    const entities = await prisma.asset.findMany()
  
    return entities.reduce((map, e) => {
    map[e.barcode] = e.id
    return map
    }, {} as Record<string, number>)
}


