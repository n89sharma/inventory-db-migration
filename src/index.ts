import { prisma } from './prisma.js'
import mysql, { RowDataPacket } from 'mysql2/promise';

const con = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    port: parseInt(process.env.DB_PORT!)
})

async function main() {
    // Phase 1: Create reference data
    await createBrands()            // 1
    await createModels()            // 2
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

//--------------------------------------------------------------------
// MODELS
async function createBrands() {
    const sql = `
        SELECT
            name AS brand_name
        FROM brand
        `

    const [results, fields] = await con.query(sql)

    var brands = Array.from(results).map((e) => {
        return {
            name: e.brand_name
        }
    })
    const addedBrands = await prisma.brand.createMany({
        data: brands
    })
    console.log(addedBrands)
}

//--------------------------------------------------------------------
// MODELS
async function createModels() {
    const sql = `
        SELECT
            b.name AS brand_name,
            m.name AS model_name, 
            CASE
                WHEN t.name='Accessories' THEN 'ACCESSORY'
                ELSE UPPER(t.name)
            END AS asset_type,
            m.weight,
            m.size
        FROM model m
        JOIN brand b USING(brand_id)
        JOIN asset_type t USING(asset_type_id)
        `

    const [results, fields] = await con.query(sql)

    var models = Array.from(results).map((e) => {
        return {
            brand: {
                connect: { name: e.brand_name },
            },
            name: e.model_name,
            asset_type: e.asset_type,
            weight: parseFloat(e.weight),
            size: parseFloat(e.size)
        }
    })

    for (const model of models) {
        var createdModel = await prisma.model.create({
            data: model
        })
        console.log(createdModel)
    }
}

