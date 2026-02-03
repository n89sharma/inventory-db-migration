import { PrismaClient } from '../../generated/prisma/client.js'
import { RowDataPacket, Connection } from 'mysql2/promise'
import { getOrganizationMap } from '../core/organization.js'
import { getWarehouseMap } from '../core/warehouse.js'
import { getUserMap } from '../core/user.js'

//--------------------------------------------------------------------
// (9) ARRIVAL

const arrivalQuery = `
    SELECT
        TRIM(a.transaction_number) AS arrival_number,
        TRIM(v.account_number) AS vendor,
        TRIM(w.city_alias) AS code,
        TRIM(w.name) AS street,
        TRIM(t.account_number) AS transporter,
        TRIM(a.notes) AS notes,
        TRIM(u.user_name) AS username,
        TRIM(a.added_on) AS created_at
    FROM arrival a
    JOIN customer v ON a.vendor_id = v.customer_id
    JOIN customer t ON a.transporter_id = t.customer_id
    LEFT JOIN warehouse w ON a.warehouse_id = w.warehouse_id
    LEFT JOIN user u ON u.user_id = a.added_by
    WHERE 
        vendor_id NOT in (98,1343,1344,3185,3427,4008,4368,4510,4653)
        AND a.added_on != '0000-00-00 00:00:00'
`

interface ArrivalRow extends RowDataPacket {
    arrival_number: string,
    vendor: string,
    code: string,
    street: string,
    transporter: string,
    notes: string,
    username: string,
    created_at: string
}

function arrivalMapper (
    r: ArrivalRow, 
    orgMap: Record<string, number>,
    warehouseMap: Record<string, number>,
    userMap: Record<string, number>
) {
    return {
        arrival_number: r.arrival_number,
        origin_id: orgMap[r.vendor],
        destination_id: warehouseMap[`${r.code}:${r.street}`],
        transporter_id: orgMap[r.transporter],
        created_by_id: userMap[r.username],
        notes: r.notes,
        created_at: new Date(r.created_at)
    }
}

const arrivalCreator = (prisma: PrismaClient, e: any) => prisma.arrival.createMany({data: e})

export async function createArrivalEntities(prisma: PrismaClient, con: Connection) {

    console.log('fetching source entities')
    const [results] = await con.query<ArrivalRow[]>(arrivalQuery)
    
    console.log('mapping')
    const orgMap = await getOrganizationMap(prisma)
    const warehouseMap = await getWarehouseMap(prisma)
    const userMap = await getUserMap(prisma)

    const mappedEntities = Array.from(results).map((r) => {
        return arrivalMapper(r, orgMap, warehouseMap, userMap)
    }) 

    console.log('creating new entities')
    await arrivalCreator(prisma, mappedEntities)
    
    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length
}