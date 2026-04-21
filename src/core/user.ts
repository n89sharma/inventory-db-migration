import { Connection, RowDataPacket } from 'mysql2/promise'
import { PrismaClient } from '../../generated/prisma/client.js'
import { UserUncheckedCreateInput } from '../../generated/prisma/models.js'
import { createManyEntities } from '../utils/utils.js'
import { getRoleIdMap } from './referenceData.js'

//--------------------------------------------------------------------
// (8) USER

const userQuery = `
    SELECT
        CASE 
            WHEN UPPER(TRIM(user_id)) = 10097 THEN 'ASUKHIJAC'
            WHEN UPPER(TRIM(user_name)) = '' THEN 'UNKNOWN'
            ELSE UPPER(TRIM(user_name))
        END AS username,
        MAX(TRIM(NAME)) AS name,
        MAX(TRIM(email)) AS email,
        MAX(status) AS is_active
    FROM user
    GROUP BY 1
`

interface UserRow extends RowDataPacket {
  username: string,
  name: string,
  email: string,
  is_active: number
}

const userMapper = (r: UserRow, memberId: number): UserUncheckedCreateInput => ({
  username: r.username,
  name: r.name,
  email: r.email,
  role_id: memberId,
  is_active: !!r.is_active
})

const userCreator = (prisma: PrismaClient, e: any) => prisma.user.createMany({ data: e })

export async function createUserEntities(prisma: PrismaClient, con: Connection) {
  const roleMap = await getRoleIdMap(prisma)
  return await createManyEntities(
    prisma,
    con,
    userQuery,
    (r: UserRow) => userMapper(r, roleMap['MEMBER']),
    userCreator
  )
}

export async function getUserMap(prisma: PrismaClient) {
  const users = await prisma.user.findMany()

  return users.reduce((map, user) => {
    map[user.username?.toUpperCase() ?? 'NOUSERNAME'] = user.id
    return map
  }, {} as Record<string, number>)
}