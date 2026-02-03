import { PrismaClient } from '../../generated/prisma/client.js'
import { RowDataPacket, Connection } from 'mysql2/promise'
import { getOrganizationMap } from '../core/organization.js'
import { getUserMap } from '../core/user.js'

const holdQuery = `
    SELECT
        TRIM(h.ah_number) AS hold_number,
        CASE 
            WHEN UPPER(TRIM(ua.user_id)) = 10097 THEN 'ASUKHIJAC'
            ELSE UPPER(TRIM(ua.user_name))
        END AS created_by,
        UPPER(TRIM(uf.user_name)) AS created_for,
        TRIM(c.account_number) AS customer,
        TRIM(h.notes) AS notes,
        TRIM(h.added_on) AS created_at,
        CASE
            WHEN TRIM(h.ah_date_from) = '0000-00-00 00:00:00' THEN NULL
            ELSE TRIM(h.ah_date_from)
        END AS from_dt,
        CASE
            WHEN TRIM(h.ah_date_to) = '0000-00-00 00:00:00' THEN NULL
            ELSE TRIM(h.ah_date_to)
        END AS to_dt
    FROM allot_hold_master h
    JOIN user ua ON ua.user_id = h.added_by	
    JOIN user uf ON uf.user_id = h.ah_for_user_id
    JOIN customer c ON c.customer_id = h.ah_for_customer_id
    WHERE h.added_on != '0000-00-00 00:00:00' AND h.allot_hold_id != 10659
    ORDER BY h.added_on DESC
`

interface HoldRow extends RowDataPacket {
    hold_number: string,
    created_by: string,
    created_for: string,
    customer: string,
    notes: string,
    created_at: string,
    from_dt: string,
    to_dt: string
}

function holdMapper (
    r: HoldRow, 
    orgMap: Record<string, number>,
    userMap: Record<string, number>
) {
    return {
        hold_number: r.hold_number,
        created_by_id: userMap[r.created_by],
        created_for_id: userMap[r.created_for],
        customer_id: orgMap[r.customer],
        notes: r.notes,
        created_at: new Date(r.created_at),
        from_dt: r.from_dt ? new Date(r.from_dt) : null,
        to_dt: r.to_dt ? new Date(r.to_dt) : null
    }
}

const holdCreator = (prisma: PrismaClient, e: any) => prisma.hold.createMany({data: e})

export async function createHoldEntities(prisma: PrismaClient, con: Connection) {

    console.log('fetching source entities')
    const [results] = await con.query<HoldRow[]>(holdQuery)
    
    console.log('mapping')
    const orgMap = await getOrganizationMap(prisma)
    const userMap = await getUserMap(prisma)

    const mappedEntities = Array.from(results).map((r) => {
        return holdMapper(r, orgMap, userMap)
    }) 

    console.log('creating new entities')
    await holdCreator(prisma, mappedEntities)
    
    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length
}