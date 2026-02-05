import { PrismaClient } from '../../generated/prisma/client.js'
import { RowDataPacket } from 'mysql2/promise'
import { createManyEntities } from './utils.js'
import { Connection } from 'mysql2/promise'

//--------------------------------------------------------------------
// (7) ORGANIZATION

const orgQuery = `
    SELECT
        TRIM(account_number) AS account_number,
        TRIM(full_name) AS full_name,
        TRIM(contact_name) AS contact_name,
        TRIM(phone) AS phone,
        TRIM(phone_ext) AS phone_ext,
        TRIM(mobile) AS mobile,
        TRIM(email_primary) AS email_primary,
        TRIM(email_secondary) AS email_secondary,
        TRIM(address1) AS address1,
        TRIM(city) AS city,
        TRIM(province) AS province,
        TRIM(country) AS country,
        TRIM(website) AS website
    FROM customer
`

interface OrganizationRow extends RowDataPacket {
    account_number: string,
    full_name: string,
    contact_name: string,
    phone: string,
    phone_ext: string,
    email_primary: string,
    email_secondary: string,
    address1: string,
    city: string,
    province: string,
    country: string,
    website: string
}

const orgMapper = (r: OrganizationRow) => ({
    account_number: r.account_number,
    name: r.full_name,
    contact_name: r.contact_name,
    phone: r.phone,
    phone_ext: r.phone_ext,
    primary_email: r.email_primary,
    secondary_email: r.email_secondary,
    address: r.address1,
    city: r.city,
    province: r.province,
    country: r.country,
    website: r.website
})

const orgCreator = (prisma: PrismaClient, e: any) => prisma.organization.createMany({data: e})

export async function createOrganizationEntities(prisma: PrismaClient, con: Connection) {
    return await createManyEntities(prisma, con, orgQuery, orgMapper, orgCreator)
}

export async function getOrganizationMap(prisma: PrismaClient) {
  const orgs = await prisma.organization.findMany()
  
  return orgs.reduce((map, org) => {
    map[org.account_number] = org.id
    return map
  }, {} as Record<string, number>)
}