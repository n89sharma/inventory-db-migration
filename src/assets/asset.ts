import { AvailabilityStatus, PrismaClient, TrackingStatus } from '../../generated/prisma/client.js'
import { RowDataPacket, Connection } from 'mysql2/promise'
import { getOrganizationMap } from '../core/organization.js'
import { getWarehouseMap } from '../core/warehouse.js'
import { getUserMap } from '../core/user.js'
import { getBrandMap } from '../core/brand.js'
import { getModelMap } from '../core/model.js'
import { getInvoiceMap } from '../transfers/invoices.js'
import { getArrivalMap } from '../transfers/arrivals.js'
import { getDepartureMap } from '../transfers/departures.js'
import { getHoldMap } from '../transfers/holds.js'
import { assetTypeMap, availabilityStatusMap, technicalStatusMap, trackingStatusMap } from '../core/enummaps.js'

const assetQuery =`
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
        TRIM(d.external_invoice_number) AS sales_invoice_number,
        TRIM(a.transaction_number) AS arrival_number,
        TRIM(d.departure_number) AS departure_number,
        TRIM(h.ah_number) AS hold_number,

        i.added_on AS created_at
    FROM inventory i
    JOIN brand b USING(brand_id)
    JOIN model m USING(model_id)
    JOIN warehouse w USING(warehouse_id)
    JOIN asset_type t ON t.asset_type_id = i.asset_type_id
    JOIN status s USING(status_id)
    LEFT JOIN inventory_location p USING(position_id)
    LEFT JOIN warehouse pw ON pw.warehouse_id = p.warehouse_id
    LEFT JOIN review ts USING(review_id)
    LEFT JOIN arrival a USING(arrival_id)
    LEFT JOIN departure d using(departure_id)
    LEFT JOIN allot_hold_master h ON h.allot_hold_id = i.hold_id
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
    sales_invoice_number: string,
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
        model_id: modelMap[`${r.brand}:${r.model}`],
        warehouse_id: warehouseMap[`${r.code}:${r.street}`],
        asset_location: r.location,
        asset_type: assetTypeMap[r.asset_type],
        tracking_status: trackingStatusMap[r.status],
        availability_status: availabilityStatusMap[r.status],
        technical_status: technicalStatusMap[r.technical_status]
    }
}

const assetCreator = (prisma: PrismaClient, e: any) => prisma.asset.createMany({data: e})

export async function createAssetEntities(prisma: PrismaClient, con: Connection) {
    const brandMap = getBrandMap(prisma)
    const modelMap = getModelMap(prisma)
    const warehouseMap = getWarehouseMap(prisma)
    const invoiceMap = getInvoiceMap(prisma)
    const arrivalMap = getArrivalMap(prisma)
    const departureMap = getDepartureMap(prisma)
    const holdMap = getHoldMap(prisma)

}
