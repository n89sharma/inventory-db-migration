import { PrismaClient } from '../../generated/prisma/client.js'
import { AssetType } from '../../generated/prisma/enums.js'
import { RowDataPacket, Connection } from 'mysql2/promise'
import { getBrandMap } from './brand.js'
import { assetTypeMap } from './enummaps.js'

const modelQuery = `
    SELECT
        TRIM(m.name) AS model_name,
        TRIM(b.name) AS brand_name,
        TRIM(t.name) AS asset_type,
        MAX(m.weight) AS weight,
        MAX(m.size) AS size
    FROM model m
    JOIN brand b USING (brand_id)
    JOIN asset_type t USING (asset_type_id)
    GROUP BY 1,2
`

interface ModelRow extends RowDataPacket {
    brand_name: string,
    model_name: string,
    asset_type: AssetType,
    weight: string,
    size: string
}

const modelMapper = (
    r: ModelRow, 
    assetTypeMap: Record<string, AssetType>,
    brandMap: Record<string, number>) => ({

    brand_id: brandMap[r.brand_name],
    name: r.model_name,
    asset_type: assetTypeMap[r.asset_type],
    weight: parseFloat(r.weight) || 0,
    size: parseFloat(r.size) || 0
})

const modelCreator = (prisma: PrismaClient, e: any) => prisma.model.createMany({data: e})

export async function createModelEntities(prisma: PrismaClient, con: Connection) {

    console.log('fetching source entities')
    const [results] = await con.query<ModelRow[]>(modelQuery)
    
    console.log('mapping')
    const brandMap = await getBrandMap(prisma)
    const mappedEntities = Array.from(results).map((r) => {
        return modelMapper(r, assetTypeMap, brandMap)
    }) 
    
    console.log('creating new entities')
    await modelCreator(prisma, mappedEntities)
    
    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length
}

export async function getModelMap(prisma: PrismaClient) {
  const entities = await prisma.model.findMany()
  
  return entities.reduce((map, e) => {
    map[`${e.brand_id}:${e.name}`] = e.id
    return map
  }, {} as Record<string, number>)
}