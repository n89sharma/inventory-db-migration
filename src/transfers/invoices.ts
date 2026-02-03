import { InvoiceType, PrismaClient } from '../../generated/prisma/client.js'
import { RowDataPacket, Connection } from 'mysql2/promise'
import { getOrganizationMap } from '../core/organization.js'
import { getUserMap } from '../core/user.js'

const invoiceQuery = `
    SELECT 
    UPPER(TRIM(a.external_invoice_number)) AS invoice_number,
    TRIM(v.account_number) AS organization_id,
    UPPER(TRIM(u.user_name)) AS updated_by,
    a.is_cleared AS is_cleared,
    TRIM(a.added_on) AS created_at,
    'PURCHASE' AS invoice_type
    FROM arrival a
    JOIN customer v ON v.customer_id = a.vendor_id
    JOIN user u ON u.user_id = a.added_by
    WHERE 
    UPPER(TRIM(a.external_invoice_number)) NOT IN 
        ('N/A', '', 'T:N/A', 'NA', 'NO INVOICE', 'RECONCILIATION', 
        'RETURN', 'RETURN FROM VENDOR', 'NOT SHIVAS', 'RECONCILE', 
        'N.A.', 'N.A', 'RETURN FROM CUSTOMER', 'FREE MACHINE', 
        'FOUND IN WAREHOUSE', 'WAITING FOR INVOICE', 'CONSIGNMENT',
        'DFW-C', 'YYZ-C', 'YYZ - C', 'MISCELLANEOUS', 'RETURN TO VENDOR'
        'RECONCILATION', 'FOR STORAGE ONLY', 'EXTRA', 
        
        'SCRAP', 'DELETE', 'PARTS MACHINE', 'PARTS', 'FOR PARTS', 'RETURN TO VENDOR',
        'RENTAL', 'PARTS MACHINES', 'REFURBISHMENT', 'RETURNED', 'RENTAL',
        '666','777','999')
    AND a.vendor_id NOT in (98,1343,1344,3185,3427,4008,4368,4510,4653)
    AND a.added_on != '0000-00-00 00:00:00'

    UNION ALL 

    SELECT 
        UPPER(TRIM(d.external_invoice_number)) AS invoice_number,
        TRIM(c.account_number) AS organization_id,
        UPPER(TRIM(u.user_name)) AS updated_by,
        0 AS is_cleared,
        TRIM(d.added_on) AS created_at,
        'SALE' AS invoice_type
    FROM departure d
    JOIN customer c ON c.customer_id = d.customer_id
    JOIN user u ON u.user_id = d.added_by
    WHERE 
        UPPER(TRIM(d.external_invoice_number)) NOT IN 
            ('N/A', '', 'T:N/A', 'NA', 'NO INVOICE', 'RECONCILIATION', 
            'RETURN', 'RETURN FROM VENDOR', 'NOT SHIVAS', 'RECONCILE', 
            'N.A.', 'N.A', 'RETURN FROM CUSTOMER', 'FREE MACHINE', 
            'FOUND IN WAREHOUSE', 'WAITING FOR INVOICE', 'CONSIGNMENT',
            'DFW-C', 'YYZ-C', 'YYZ - C', 'MISCELLANEOUS', 'RETURN TO VENDOR'
            'RECONCILATION', 'FOR STORAGE ONLY', 'EXTRA', 
            
            'SCRAP', 'DELETE', 'PARTS MACHINE', 'PARTS', 'FOR PARTS', 'RETURN TO VENDOR',
            'RENTAL', 'PARTS MACHINES', 'REFURBISHMENT', 'RETURNED', 'RENTAL',
            '666','777','999')
        AND d.customer_id NOT in (98,1343,1344,3185,3427,4008,4368,4510,4653)
        AND d.added_on != '0000-00-00 00:00:00'
`

interface InvoiceRow extends RowDataPacket {
    invoice_number: string,
    organization_id: string,
    updated_by: string,
    is_cleared: number,
    created_at: string,
    invoice_type: string
}

function invoiceMapper (
    r: InvoiceRow, 
    orgMap: Record<string, number>,
    userMap: Record<string, number>
) {
    return {
        invoice_number: r.invoice_number,
        organization_id: orgMap[r.organization_id],
        updated_by_id: userMap[r.updated_by],
        is_cleared: !!r.is_cleared,
        created_at: new Date(r.created_at),
        invoice_type: invoiceTypeMap[r.invoice_type]
    }
}

const invoiceTypeMap: Record<string, InvoiceType> = {
    'SALE': InvoiceType.SALE,
    'PURCHASE': InvoiceType.PURCHASE
}

const invoiceCreator = (prisma: PrismaClient, e: any) => prisma.invoice.createMany({ data: e})

export async function createInvoiceEntities(prisma: PrismaClient, con: Connection) {

    console.log('fetching source entities')
    const [results] = await con.query<InvoiceRow[]>(invoiceQuery)
    
    console.log('mapping')
    const orgMap = await getOrganizationMap(prisma)
    const userMap = await getUserMap(prisma)

    const mappedEntities = Array.from(results).map((r) => {
        return invoiceMapper(r, orgMap, userMap)
    }) 

    console.log('creating new entities')
    await invoiceCreator(prisma, mappedEntities)
    
    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length
}

