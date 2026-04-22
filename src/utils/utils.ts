import { RowDataPacket , Connection } from 'mysql2/promise'
import { Prisma, PrismaClient } from '../../generated/prisma/client.js'

export async function createManyEntities<TSource extends RowDataPacket, TTarget> (
    prisma: PrismaClient,
    con: Connection,
    query: string,
    mapper: (r: TSource) => (TTarget),
    creator: (prisma: PrismaClient, data: TTarget[]) => Prisma.PrismaPromise<Prisma.BatchPayload>
) : Promise<number> {

    console.log('fetching source entities')
    const [results] = await con.query<TSource[]>(query)
    console.log('mapping')
    const mappedEntities = Array.from(results).map(mapper) 
    console.log('creating new entities')
    const result = await creator(prisma, mappedEntities)
    console.log(`done. ${result.count} created`)
    return mappedEntities.length
}