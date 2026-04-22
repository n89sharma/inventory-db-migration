import { Connection, RowDataPacket } from 'mysql2/promise'
import { PrismaClient } from '../../generated/prisma/client.js'
import { PartTransferUncheckedCreateInput } from '../../generated/prisma/models.js'
import { getAssetMap } from '../assets/asset.js'
import { getUserMap } from '../core/user.js'

const assetPartsQuery = `
    SELECT 
        TRIM(r.barcode) AS recipient,
        TRIM(d.barcode) AS donor,
        v.added_on AS updated_at,
        v.added_by AS updated_by,
        TRIM(v.remark) AS notes
    FROM value_added v
    LEFT JOIN inventory r ON r.inventory_id=v.inventory_id
    LEFT JOIN inventory d ON d.inventory_id=v.source_key_item
    WHERE SOURCE='Old Machine'
`
// JOIN USER DELETED

interface AssetPartRow extends RowDataPacket {
  recipient: string,
  donor: string,
  updated_at: string,
  updated_by: number,
  notes: string
}

function assetPartMapper(
  r: AssetPartRow,
  assetMap: Record<string, number>,
  userMap: Record<number, number>): PartTransferUncheckedCreateInput {

  const partNamesForExchange = getPartNamesForExchange(r.notes)
  if (!!partNamesForExchange) {
    return {
      recipient_asset_id: assetMap[r.recipient],
      donor_asset_id: assetMap[r.donor],
      fixed_at: new Date(r.updated_at),
      fixed_by: userMap[r.updated_by],
      part: partNamesForExchange,
      is_exchange: true,
      notes: r.notes
    }
  }

  return {
    recipient_asset_id: assetMap[r.recipient],
    donor_asset_id: assetMap[r.donor],
    fixed_at: new Date(r.updated_at),
    fixed_by: userMap[r.updated_by],
    part: getPartNamesForOneWayTransfer(r.notes) ?? 'UNKNOWN',
    is_exchange: false,
    notes: r.notes
  }
}

export function getPartNamesForExchange(notes: string): string | null {
  const goodBadRegex = /Exchanged (.+)\(GOOD\)/
  const match = notes.match(goodBadRegex)
  return match ? match[1] : null
}

export function getPartNamesForOneWayTransfer(notes: string): string | null {
  const removedItemRegex = /Removed item \[(.+)\] from/
  const match = notes.match(removedItemRegex)
  return match ? match[1] : null
}

const assetPartCreator = (prisma: PrismaClient, e: any) => prisma.partTransfer.createMany({ data: e })

export async function createAssetPartEntities(prisma: PrismaClient, con: Connection) {

  console.log(`fetching source entities.`)
  const [results] = await con.query<AssetPartRow[]>(assetPartsQuery)

  console.log('mapping')
  const assetMap = await getAssetMap(prisma)
  const userMap = await getUserMap(prisma)

  const mappedEntities = Array.from(results).map((r) => {
    return assetPartMapper(r, assetMap, userMap)
  }).filter(r => !!r.recipient_asset_id && !!r.donor_asset_id)

  console.log('creating new entities')
  await assetPartCreator(prisma, mappedEntities)

  console.log(`done. ${mappedEntities.length} created`)
  return mappedEntities.length
}