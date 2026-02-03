import { PrismaClient, Role } from '../../generated/prisma/client.js'
import { RowDataPacket, Connection } from 'mysql2/promise'
import { createManyEntities } from './createntities.js'

//--------------------------------------------------------------------
// (8) USER

const userQuery = `
    SELECT
        CASE 
            WHEN UPPER(TRIM(user_name)) = '' THEN 'ASUKHIJAC'
            ELSE UPPER(TRIM(user_name))
        END AS username,
        MAX(TRIM(NAME)) AS name,
        MAX(TRIM(email)) AS email
    FROM user
    GROUP BY 1
`

interface UserRow extends RowDataPacket {
    username: string,
    name: string,
    email: string
}

const userMapper = (r: UserRow) => ({
    username: r.username,
    name: r.name,
    email: r.email,
    role: Role.MEMBER
})

const userCreator = (prisma: PrismaClient, e: any) => prisma.user.createMany({data: e})

export async function createUserEntities(prisma: PrismaClient, con: Connection) {
    return await createManyEntities(prisma, con, userQuery, userMapper, userCreator)
}

export async function getUserMap(prisma: PrismaClient) {
  const users = await prisma.user.findMany()
  
  return users.reduce((map, user) => {
    map[user.username.toUpperCase()] = user.id
    return map
  }, {} as Record<string, number>)
}