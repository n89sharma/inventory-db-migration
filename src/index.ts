import { prisma } from './prisma.js'
import mysql, { RowDataPacket } from 'mysql2/promise'
import { createModelEntities } from './core/model.js'
import { createBrandEntities } from './core/brand.js'
import { createWarehouseEntities } from './core/warehouse.js'
import { createLocationEntities } from './core/location.js'
import { createPartEntities } from './core/part.js'
import { createOrganizationEntities } from './core/organization.js'
import { createErrorEntities } from './core/error.js'
import { createUserEntities } from './core/user.js'
import { createArrivalEntities } from './transfers/arrival.js'

const con = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    port: parseInt(process.env.DB_PORT!)
})

async function main() {
    
    //Phase 1: Create reference data
    console.log('brands----------')
    await createBrandEntities(prisma, con)          //1 - 86

    console.log('models----------')
    await createModelEntities(prisma, con)          //2 - 7,509
    
    console.log('warehouse----------')
    await createWarehouseEntities(prisma, con)      //3 - 12
    
    console.log('location----------')
    await createLocationEntities(prisma, con)       //4 - 4,068
    
    console.log('part----------')
    await createPartEntities(prisma, con)           //5 - 1225
    
    console.log('org----------')
    await createOrganizationEntities(prisma, con)   //6 - 2,832
    
    console.log('error----------')
    await createErrorEntities(prisma, con)          //7 - 705
    
    console.log('user----------')
    await createUserEntities(prisma, con)           //8 - 299

    // // Phase 2: Create transactions
    console.log('arrival----------')
    await createArrivalEntities(prisma, con)        //9 - 34,899
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