import { RowDataPacket , Connection } from 'mysql2/promise'
import { PrismaClient } from '../../generated/prisma/client.js'

export async function createManyEntities<TSource extends RowDataPacket, TTarget> (
    prisma: PrismaClient,
    con: Connection,
    query: string,
    mapper: (r: TSource) => (TTarget),
    creator: (prisma: PrismaClient, data: TTarget[]) => Promise<any>
) : Promise<number> {

    console.log('fetching source entities')
    const [results] = await con.query<TSource[]>(query)
    console.log('mapping')
    const mappedEntities = Array.from(results).map(mapper) 
    console.log('creating new entities')
    await creator(prisma, mappedEntities)
    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length
}