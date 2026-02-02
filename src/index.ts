import { prisma } from './prisma.js'
import mysql, { RowDataPacket } from 'mysql2/promise';
import { AssetType } from '../generated/prisma/enums.js';

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

const orgCreator = (e: any) => prisma.organization.createMany({data: e})



//--------------------------------------------------------------------
// (6) PART

const partQuery = `
    SELECT
        p.part_number AS part_number,
        MAX(p.part_description) AS description,
        MAX(p.dealer_price) AS dealer_price,
        MAX(p.sale_price) AS sale_price,
        MAX(p.cost_price) AS cost
    FROM bulk_item p
    GROUP BY 1
`

interface PartRow extends RowDataPacket {
    description: string,
    part_number: string,
    dealer_price: string,
    sale_price: string,
    cost: string
}

const partMapper = (r: PartRow) => ({
    description: r.description,
    part_number: r.part_number,
    dealer_price: parseFloat(r.sale_price).toFixed(2),
    sale_price: parseFloat(r.sale_price).toFixed(2),
    cost: parseFloat(r.cost).toFixed(2)
})

const partCreator = (e: any) => prisma.part.createMany({data: e})

//--------------------------------------------------------------------
// (5) ERROR

const errorQuery = `
    SELECT 
        TRIM(b.name) AS brand_name,
        TRIM(e.short_name) AS code,
        MAX(TRIM(e.name)) AS description,
        MAX(TRIM(c.category_name)) AS category
    FROM error e
    LEFT JOIN error_category c USING(error_category_id)
    JOIN brand b ON b.brand_id = c.Brand_id
    GROUP BY 1,2;
`

interface ErrorRow extends RowDataPacket {
    brand_name: string,
    code: string,
    description: string,
    category: string
}

const errorMapper = (r: ErrorRow) => ({
    brand: { connect: { name: r.brand_name}},
    code: r.code,
    description: r.description,
    category: r.category
})

const errorCreator = (e: any) => prisma.error.create({data: e})

//--------------------------------------------------------------------
// (4) LOCATION

const locationQuery =`
    SELECT 
        TRIM(w.city_alias) AS city_code,
        TRIM(l.name) AS location
    FROM inventory_location l
    JOIN warehouse w USING(warehouse_id)
    GROUP BY 1,2
`

interface LocationRow extends RowDataPacket {
    city_code: string,
    location: string
}

const locationMapper = (r: LocationRow) => ({
    warehouse: { connect: { city_code: r.city_code } },
    location: r.location
})

const locationCreator = (e: any) => prisma.location.create({data: e})

//--------------------------------------------------------------------
// (3) WAREHOUSE

const warehouseQuery = `
    SELECT
        city_alias AS city_code,
        name AS street
    FROM warehouse
`

interface WarehouseRow extends RowDataPacket {
    city_code: string,
    street: string
}

const warehouseMapper = (r: WarehouseRow) => ({
    city_code: r.city_code,
    street: r.street
})

const warehouseCreator = (e: any) => prisma.warehouse.createMany({data: e})


//--------------------------------------------------------------------
// (2) MODELS
const modelQuery = `
    SELECT
        TRIM(m.name) AS model_name,
        TRIM(b.name) AS brand_name,
        TRIM(t.name) AS asset_type,
        MAX(m.weight) AS weight,
        MAX(m.size) AS size
    FROM model m
    JOIN brand b USING (brand_id)
    JOIN asset_type t USING (asset_type_id)
    GROUP BY 1,2
`

interface ModelRow extends RowDataPacket {
    brand_name: string,
    model_name: string,
    asset_type: AssetType,
    weight: string,
    size: string
}

const modelMapper = (r: ModelRow) => ({
    brand: { connect: { name: r.brand_name } },
    name: r.model_name,
    asset_type: assetTypeMap[r.asset_type],
    weight: parseFloat(r.weight),
    size: parseFloat(r.size)
})

const modelCreator = (e: any) => prisma.model.create({data: e})

//--------------------------------------------------------------------
// (1) BRANDS
const brandQuery = `
    SELECT
        TRIM(name) AS brand_name
    FROM brand
    GROUP BY 1
`

interface BrandRow extends RowDataPacket{
    brand_name: string
}

const brandMapper = (r: BrandRow) => ({ name: r.brand_name})

const brandCreator = (e: any) => prisma.brand.createMany({data: e})

//--------------------------------------------------------------------
// ASSET TYPES
const assetTypeMap: Record<string, AssetType> = {
    'Copier': AssetType.COPIER,
    'Finisher': AssetType.FINISHER,
    'Accessories': AssetType.ACCESSORY,
    'Scanner': AssetType.SCANNER,
    'Plotter': AssetType.PLOTTER,
    'Printer': AssetType.PRINTER,
    'Warehouse Supplies': AssetType.WAREHOUSE_SUPPLIES,
    'Fax': AssetType.FAX
}

//--------------------------------------------------------------------
// CREATORS

const con = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    port: parseInt(process.env.DB_PORT!)
})

async function createEntities<TSource extends RowDataPacket, TTarget> (
    query: string,
    mapper: (r: TSource) => (TTarget),
    creator: (data: TTarget) => Promise<any>
) : Promise<number> {

    console.log('Fetching source entities')
    const [results] = await con.query<TSource[]>(query)
    console.log('mapping')
    const mappedEntities = Array.from(results).map(mapper) 
    console.log('creating new entities')
    for (const entitity of mappedEntities) {
        await creator(entitity)
    }
    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length
}

async function createManyEntities<TSource extends RowDataPacket, TTarget> (
    query: string,
    mapper: (r: TSource) => (TTarget),
    creator: (data: TTarget[]) => Promise<any>
) : Promise<number> {

    console.log('Fetching source entities')
    const [results] = await con.query<TSource[]>(query)
    console.log('mapping')
    const mappedEntities = Array.from(results).map(mapper) 
    console.log('creating new entities')
    await creator(mappedEntities)
    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length
}

//--------------------------------------------------------------------
// MAIN

async function main() {
    // Phase 1: Create reference data
    //await createManyEntities(brandQuery, brandMapper, brandCreator) //1
    //await createEntities(modelQuery, modelMapper, modelCreator)     //2
    
    //console.log('warehouse')
    //await createManyEntities(warehouseQuery, warehouseMapper, warehouseCreator) //3
    //console.log('location')
    //await createEntities(locationQuery, locationMapper, locationCreator)        //4
    console.log('error')
    await createEntities(errorQuery, errorMapper, errorCreator)                 //5
    console.log('part')
    await createManyEntities(partQuery, partMapper, partCreator)                //6
    console.log('org')
    await createManyEntities(orgQuery, orgMapper, orgCreator)                   //7

    // // Phase 2: Create transactions
    // await createArrivals()
    // await createDepartures()
    // await createTransfers()
    // await createHolds()
    // await createInvoices()

    // // Phase 3: Create assets (depends on everything above)
    // await createAssets()

    // // Phase 4: Create relationships
    // await updateAccessoriesForAssets()
    // await updateErrorsForAssets()
    // await updateCommentsForAssets()

    return 0
}

main()
    .then(async () => {
        await prisma.$disconnect()
        await con.end()
        process.exit(0)
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })