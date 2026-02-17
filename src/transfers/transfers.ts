import { PrismaClient } from '../../generated/prisma/client.js'
import { RowDataPacket, Connection } from 'mysql2/promise'
import { getOrganizationMap } from '../core/organization.js'
import { getWarehouseMap } from '../core/warehouse.js'
import { getUserMap } from '../core/user.js'

const transferQuery = `
    SELECT
        TRIM(t.transfer_number) AS transfer_number,
        TRIM(wo.city_alias) AS origin_code,
        TRIM(wo.name) AS origin_street,
        TRIM(wd.city_alias) AS destination_code,
        TRIM(wd.name) AS destination_street,
        TRIM(c.account_number) AS transporter,
        TRIM(t.remarks) AS notes,
        UPPER(TRIM(u.user_name)) AS created_by,
        TRIM(t.added_on) AS created_at,
        t.transfer_date
    FROM transfer t 
    JOIN warehouse wo ON t.origin_id = wo.warehouse_id
    JOIN warehouse wd ON t.destination_id = wd.warehouse_id
    JOIN customer c ON t.transporter_id = c.customer_id
    JOIN user u ON u.user_id = t.added_by
    WHERE t.added_on != '0000-00-00 00:00:00'
`

interface TransferRow extends RowDataPacket {
    transfer_number: string,
    origin_code: string,
    origin_street: string,
    destination_code: string,
    destination_street: string,
    transporter: string,
    notes: string,
    created_by: string,
    created_at: string
}

function transferMapper (
    r: TransferRow, 
    orgMap: Record<string, number>,
    warehouseMap: Record<string, number>,
    userMap: Record<string, number>
) {
    return {
        transfer_number: r.transfer_number,
        origin_id: warehouseMap[`${r.origin_code}:${r.origin_street}`],
        destination_id: warehouseMap[`${r.destination_code}:${r.destination_street}`],
        transporter_id: orgMap[r.transporter],
        created_by_id: userMap[r.created_by],
        notes: r.notes,
        created_at: new Date(r.created_at)
    }
}

const transferCreator = (prisma: PrismaClient, e: any) => prisma.transfer.createMany({data: e})

export async function createTransferEntities(prisma: PrismaClient, con: Connection) {

    console.log('fetching source entities')
    const [results] = await con.query<TransferRow[]>(transferQuery)
    
    console.log('mapping')
    const orgMap = await getOrganizationMap(prisma)
    const warehouseMap = await getWarehouseMap(prisma)
    const userMap = await getUserMap(prisma)

    const mappedEntities = Array.from(results).map((r) => {
        return transferMapper(r, orgMap, warehouseMap, userMap)
    }) 

    console.log('creating new entities')
    await transferCreator(prisma, mappedEntities)
    
    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length
}

export async function getTransferMap(prisma: PrismaClient) {
    const entities = await prisma.transfer.findMany()
  
    return entities.reduce((map, e) => {
        map[e.transfer_number] = e.id
        return map
    }, {} as Record<string, number>)
}