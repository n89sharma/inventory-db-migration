import { prisma } from './prisma.js'
import mysql, { RowDataPacket } from 'mysql2/promise';
import { AssetType } from '../generated/prisma/enums.js';

//--------------------------------------------------------------------
// MODELS
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
    weight: number,
    size: number
}

const modelMapper = (r: ModelRow) => ({
    brand: {
        connect: { name: r.brand_name },
    },
    name: r.model_name,
    asset_type: assetTypeMap[r.asset_type],
    weight: r.weight,
    size: r.size
})

const modelCreator = (e: any) => prisma.model.create({data: e})

//--------------------------------------------------------------------
// BRANDS
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

    const [results] = await con.query<TSource[]>(query)
    const mappedEntities = Array.from(results).map(mapper) 
    for (const entitity of mappedEntities) {
        await creator(entitity)
    }
    return mappedEntities.length
}

async function createManyEntities<TSource extends RowDataPacket, TTarget> (
    query: string,
    mapper: (r: TSource) => (TTarget),
    creator: (data: TTarget[]) => Promise<any>
) : Promise<number> {

    const [results] = await con.query<TSource[]>(query)
    const mappedEntities = Array.from(results).map(mapper) 
    await creator(mappedEntities)
    return mappedEntities.length
}

//--------------------------------------------------------------------
// MAIN

async function main() {
    // Phase 1: Create reference data
    await createManyEntities(brandQuery, brandMapper, brandCreator) //1
    await createEntities(modelQuery, modelMapper, modelCreator)     //2
    
    // await createLocations()         // 3
    // await createWarehouses()        // 4
    // await createOrganizations()     // 5
    // await createErrorCategories()   // 6
    // await createErrors()            // 7
    // await createParts()             // 8

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