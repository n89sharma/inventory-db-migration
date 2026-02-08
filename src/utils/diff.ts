import { RowDataPacket , Connection } from 'mysql2/promise'
import { PrismaClient } from '../../generated/prisma/client.js'


interface Barcode extends RowDataPacket {
    barcode: string
}

interface Username extends RowDataPacket {
    username: string
}

interface MissingBarcodes extends RowDataPacket {
    barcode: string,
    added_on:string
}

interface Arrival extends RowDataPacket {
    arrival_number: string
}

export async function getAssetDiff(prisma: PrismaClient, con: Connection) {

    const diff: Set<string> = await getDiff(
        prisma, 
        con, 
        `SELECT barcode FROM inventory`,
        `select barcode FROM "Asset"`,
        (b: Barcode) => b.barcode
    )
    await printOldBarcodes(con, diff)
}

export async function getCommentDiff(prisma: PrismaClient, con: Connection) {
    const oldQuery = `
        SELECT 
            i.barcode
        FROM inventory_remark_master c
        JOIN inventory i USING(inventory_id)
        JOIN user u ON u.user_id = c.added_by
    `
    const newQuery = `
        select 
            a.barcode 
        FROM "Comment" c 
        JOIN "Asset" a on c.asset_id=a.id 
    `
    const diff: Set<string> = await getDiff(
        prisma, 
        con, 
        oldQuery,
        newQuery,
        (b: Barcode) => b.barcode
    )
    await printOldBarcodes(con, diff)
}

export async function getUserDiff(prisma: PrismaClient, con: Connection) {
    const diff: Set<string> = await getDiff(
        prisma, 
        con, 
        `SELECT user_name FROM user`,
        `select username from "User"`,
        (u: Username) => u.username
    )
    console.log(Array.from(diff))
}

export async function getArrivalDiff(prisma: PrismaClient, con: Connection) {
    const diff: Set<string> = await getDiff(
        prisma,
        con,
        `SELECT TRIM(transaction_number) as arrival_number FROM arrival`,
        `select TRIM(arrival_number) as arrival_number FROM "Arrival"`,
        (a: Arrival) => a.arrival_number
    )
    const missingArrivalNumbers = Array.from(diff)
    const missingArrivalQuery = `
        SELECT
            TRIM(a.transaction_number) AS arrival_number,
            TRIM(a.added_on) AS created_at
        FROM arrival a
        WHERE 
            vendor_id NOT in (98,1343,1344,3185,3427,4008,4368,4510,4653)
            AND a.transaction_number IN (?)
            AND a.added_on != '0000-00-00 00:00:00'
    `
    const [missingArrivals] = await con.query<any[]>(
        missingArrivalQuery, 
        missingArrivalNumbers)
    console.log(missingArrivals)
}

async function getDiff<Q extends RowDataPacket>(
    prisma: PrismaClient,
    con: Connection,
    oldQuery: string,
    newQuery: string,
    valueMapper: (e: Q) => string
){

    const [oldData] = await con.query<Q[]>(oldQuery)
    const oldSet = new Set(oldData.map(valueMapper))

    const newData = await prisma.$queryRawUnsafe<Q[]>(newQuery)
    const newSet = new Set(newData.map(valueMapper))

    const diff = oldSet.difference(newSet)
    return diff
}

async function printOldBarcodes(
    con: Connection,
    diff: Set<string>) {

    const diffArray = Array.from(diff)
    const missingAssetQuery = `
        SELECT 
            barcode, 
            added_on 
        FROM inventory
        WHERE barcode IN (?)
        ORDER BY added_on DESC`

    let [missingData] = await con.query<MissingBarcodes[]>(missingAssetQuery, [diffArray])

    console.log(`total diff: ${diff.size}`)
    for(const e of missingData) {
        console.log(`${e.barcode}: ${e.added_on}`)
    }
}