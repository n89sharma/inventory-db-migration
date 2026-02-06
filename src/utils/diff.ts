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
        WHERE barcode IN (?)`

    let [missingData] = await con.query<MissingBarcodes[]>(missingAssetQuery, [diffArray])

    console.log(`total diff: ${diff.size}`)
    console.log(missingData)
}