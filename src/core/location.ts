import { PrismaClient } from '../../generated/prisma/client.js'
import { RowDataPacket } from 'mysql2/promise'
import { Connection } from 'mysql2/promise'
import { getWarehouseMap } from './warehouse.js'

//--------------------------------------------------------------------
// (4) LOCATION

const locationQuery =`
    SELECT 
        TRIM(w.city_alias) AS city_code,
        TRIM(w.name) AS street,
        TRIM(l.name) AS location
    FROM inventory_location l
    JOIN warehouse w USING(warehouse_id)
    GROUP BY 1,2,3
`

interface LocationRow extends RowDataPacket {
    city_code: string,
    street: string,
    location: string
}

const locationMapper = (r: LocationRow, warehouseMap: Record<string, number>) => ({
    warehouse_id: warehouseMap[`${r.city_code}:${r.street}`],
    location: r.location
})

const locationCreator = (prisma: PrismaClient, e:any) => prisma.location.createMany({data: e})

export async function createLocationEntities(prisma: PrismaClient, con: Connection) {

    console.log('fetching source entities')
    const [results] = await con.query<LocationRow[]>(locationQuery)
    
    console.log('mapping')
    const warehouseMap = await getWarehouseMap(prisma)
    const mappedEntities = Array.from(results).map((r) => {
        return locationMapper(r, warehouseMap)
    }) 
    
    console.log('creating new entities')
    await locationCreator(prisma, mappedEntities)
    
    console.log(`done. ${mappedEntities.length} created`)
    return mappedEntities.length
}