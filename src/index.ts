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
import { createArrivalEntities } from './transfers/arrivals.js'
import { createDepartureEntities } from './transfers/departures.js'
import { createTransferEntities } from './transfers/transfers.js'
import { createHoldEntities } from './transfers/holds.js'
import { createInvoiceEntities } from './transfers/invoices.js'

const con = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    port: parseInt(process.env.DB_PORT!)
})

async function main() {

    //==================================================================
    //Phase 1: Create reference data
    console.log('\nbrands----------')
    //await createBrandEntities(prisma, con)          //1 - 86

    console.log('\nmodels----------')
    //await createModelEntities(prisma, con)          //2 - 7,509
    
    console.log('\nwarehouse----------')
    //await createWarehouseEntities(prisma, con)      //3 - 12
    
    console.log('\nlocation----------')
    //await createLocationEntities(prisma, con)       //4 - 4,068
    
    console.log('\npart----------')
    //await createPartEntities(prisma, con)           //5 - 1225
    
    console.log('\norg----------')
    //await createOrganizationEntities(prisma, con)   //6 - 2,832
    
    console.log('\nerror----------')
    //await createErrorEntities(prisma, con)          //7 - 705
    
    console.log('\nuser----------')
    //await createUserEntities(prisma, con)           //8 - 299

    //==================================================================
    // Phase 2: Create transactions
    console.log('\narrival----------')
    //await createArrivalEntities(prisma, con)    //9 - 34,906/ 34,901

    console.log('\ndeparture----------')
    //await createDepartureEntities(prisma, con)  //10 - 34,990/ 35,089

    console.log('\ntransfers----------')
    //await createTransferEntities(prisma, con)   //11 - 2,108/ 2,162

    console.log('\nhold----------')
    //await createHoldEntities(prisma, con)       //12 - 37,161/ 37,171

    console.log('\ninvoice----------')
    //await createInvoiceEntities(prisma, con)    //13 - 37,357/ 40,551
    
    //==================================================================
    // Phase 3: Create assets (depends on everything above)
    // Asset                                            //14 - /450,133
    // Tech Specs
    // Cost
    // Comment

    //==================================================================
    // Phase 4: Create relationships
    // AssetAccessory
    // AssetError
    // AssetHistory
    // AssetPart
    // AssetTransfer

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