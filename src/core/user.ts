import { PrismaClient } from '../../generated/prisma/client.js'
import { USERS } from '../utils/userlist.js'

//--------------------------------------------------------------------
// (8) USER
export async function createUserEntities(prisma: PrismaClient) {
  const result = await prisma.user.createMany({
    data: [...USERS.values()],
    skipDuplicates: true
  })
  console.log(`done. ${result.count} users created`)
}

export async function getNewUserMapNameToId(prisma: PrismaClient) {
  const users = await prisma.user.findMany()

  return users.reduce((map, user) => {
    map[user.name] = user.id
    return map
  }, {} as Record<string, number>)
}

export async function getUserMap(prisma: PrismaClient): Promise<Record<number, number>> {
  const newUserNameToIdMap = await getNewUserMapNameToId(prisma)
  const userMapOldIdNewIdMap: Record<number, number> = {}
  for (const [oldId, user] of USERS) {
    userMapOldIdNewIdMap[oldId] = newUserNameToIdMap[user.name]
  }
  return userMapOldIdNewIdMap
}