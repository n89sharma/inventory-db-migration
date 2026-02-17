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
import { createAssetEntities } from './assets/asset.js'
import { createTechSpecEntities } from './assets/techspecs.js'
import { createCostEntities } from './assets/cost.js'
import { createCommentEntities } from './assets/comment.js'
import { getArrivalDiff, getAssetDiff, getCommentDiff, getUserDiff } from './utils/diff.js'
import { createAssetErrorEntities } from './relationships/errors.js'
import { createAssetAccessories } from './relationships/accessories.js'
import { createAssetTransferEntities } from './relationships/transfers.js'
import { createAssetPartEntities } from './relationships/parts.js'

const con = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    port: parseInt(process.env.DB_PORT!)
})

async function fullRun() {
    //==================================================================
    //Phase 1: Create reference data
    console.log('\nbrands----------')
    await createBrandEntities(prisma, con)          //1 - 86

    console.log('\nmodels----------')
    await createModelEntities(prisma, con)          //2 - 7,509
    
    console.log('\nwarehouse----------')
    await createWarehouseEntities(prisma, con)      //3 - 12
    
    console.log('\nlocation----------')
    await createLocationEntities(prisma, con)       //4 - 4,068
    
    console.log('\npart----------')
    await createPartEntities(prisma, con)           //5 - 1225
    
    console.log('\norg----------')
    await createOrganizationEntities(prisma, con)   //6 - 2,832
    
    console.log('\nerror----------')
    await createErrorEntities(prisma, con)          //7 - 705/739
    
    console.log('\nuser----------')
    //adip's copier earth account manually mapped to the empty username
    //hold has a better logic as it looks for id 10097
    //it was later found that there are other users with empty username
    //id 100,81. However, since user query expects a unique username, 
    //these account were getting squashed anyways. these users have 5
    //assets in 2014
    await createUserEntities(prisma, con)           //8 - 299

    //==================================================================
    // Phase 2: Create transactions
    console.log('\narrival----------')
    await createArrivalEntities(prisma, con)    //9 - 34,906/ 34,917/ 37,679

    console.log('\ndeparture----------')
    await createDepartureEntities(prisma, con)  //10 - 34,990/ 35,089

    console.log('\ntransfers----------')
    await createTransferEntities(prisma, con)   //11 - 2,108/ 2,162

    console.log('\nhold----------')
    await createHoldEntities(prisma, con)       //12 - 37,161/ 37,171

    console.log('\ninvoice----------')
    //sales invoices have not been added as certain entries conflict
    //with purchase invoice
    await createInvoiceEntities(prisma, con)    //13 - 37,357/ 40,551
    
    //==================================================================
    // Phase 3: Create assets (depends on everything above)                           
    console.log('\nasset----------')
    await createAssetEntities(prisma, con)      //14 - 450,219/450,227

    console.log('\ntech spec----------')
    await createTechSpecEntities(prisma, con)
    
    console.log('\ncost----------')
    await createCostEntities(prisma, con)

    console.log('\n comment----------')
    //88 assets were added within feb5-7, 3 are from 2024. rest exist
    await createCommentEntities(prisma, con)  //15 - 380,295/ 380,395

    //==================================================================
    // Phase 4: Create relationships
    console.log('\n asset accessories----------')
    await createAssetAccessories(prisma, con)
                              
    console.log('\n asset errors----------')    //16 27,849/ 27,883
    await createAssetErrorEntities(prisma, con)

    console.log('\n asset transfers----------')
    await createAssetTransferEntities(prisma, con)

    console.log('\n asset parts----------')
    await createAssetPartEntities(prisma, con)
}

async function main() {

    await fullRun()

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
        await con.end()
        process.exit(1)
    })