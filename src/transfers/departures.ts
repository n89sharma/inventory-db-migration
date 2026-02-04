import { PrismaClient } from '../../generated/prisma/client.js'
import { RowDataPacket, Connection } from 'mysql2/promise'
import { getOrganizationMap } from '../core/organization.js'
import { getWarehouseMap } from '../core/warehouse.js'
import { getUserMap } from '../core/user.js'

const departureQuery = `
    SELECT
        TRIM(d.departure_number) AS departure_number,
        TRIM(c.account_number) AS customer,
        TRIM(w.city_alias) AS code,
        TRIM(w.name) AS street,
        TRIM(t.account_number) AS transporter,
        TRIM(d.notes) AS notes,
        UPPER(TRIM(u.user_name)) AS username,
        UPPER(TRIM(s.user_name)) AS salesperson,
        TRIM(d.added_on) AS created_at
    FROM departure d
    JOIN customer c ON d.customer_id = c.customer_id
    JOIN customer t ON d.transporter_id = t.customer_id
    JOIN warehouse w ON d.warehouse_id = w.warehouse_id
    LEFT JOIN user u ON u.user_id = d.added_by
    LEFT JOIN user s ON s.user_id = d.representative_id
    WHERE 
        d.customer_id NOT in (98,1343,1344,3185,3427,4008,4368,4510,4653)
        AND d.added_on != '0000-00-00 00:00:00'
`

interface DepartureRow extends RowDataPacket {
    departure_number: string,
    customer: string,
    code: string,
    street: string,
    transporter: string,
    notes: string,
    username: string,
    created_at: string
}

function departureMapper (
    r: DepartureRow, 
    orgMap: Record<string, number>,
    warehouseMap: Record<string, number>,
    userMap: Record<string, number>
) {
    return {
        departure_number: r.departure_number,
        origin_id: warehouseMap[`${r.code}:${r.street}`],
        destination_id: orgMap[r.customer],
        transporter_id: orgMap[r.transporter],
        created_by_id: userMap[r.username],
        notes: r.notes,
        created_at: new Date(r.created_at)
    }
}

const departureCreator = (prisma: PrismaClient, e: any) => prisma.departure.createMany({data: e})

export async function createDepartureEntities(prisma: PrismaClient, con: Connection) {

    console.log('fetching source entities')
    const [results] = await con.query<DepartureRow[]>(departureQuery)
    
    console.log('mapping')
    const orgMap = await getOrganizationMap(prisma)
    const warehouseMap = await getWarehouseMap(prisma)
    const userMap = await getUserMap(prisma)

    const mappedEntities = Array.from(results).map((r) => {
        return departureMapper(r, orgMap, warehouseMap, userMap)
    }) 

    console.log('creating new entities')
    await departureCreator(prisma, mappedEntities)
    
    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length
}

export async function getDepartureMap(prisma: PrismaClient) {
  const entities = await prisma.departure.findMany()
  
  return entities.reduce((map, e) => {
    map[e.departure_number] = e.id
    return map
  }, {} as Record<string, number>)
}