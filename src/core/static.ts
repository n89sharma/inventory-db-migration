import { PrismaClient } from '../../generated/prisma/client.js'


export async function createStaticTables(prisma: PrismaClient) {

  await prisma.accessory.createMany({
    data: [
      { accessory: 'NIC' },
      { accessory: 'PS' },
      { accessory: 'PCL' },
      { accessory: 'UFR' },
      { accessory: 'FAX' },
      { accessory: 'USEND' },
      { accessory: 'DF' },
      { accessory: 'CASS' },
      { accessory: 'FIN' },
      { accessory: 'BF' },
      { accessory: 'HDD' },
      { accessory: 'SCAN' }
    ]
  })

  await prisma.assetType.createMany({
    data: [
      { asset_type: 'COPIER' },
      { asset_type: 'FINISHER' },
      { asset_type: 'ACCESSORY' },
      { asset_type: 'SCANNER' },
      { asset_type: 'PLOTTER' },
      { asset_type: 'PRINTER' },
      { asset_type: 'WAREHOUSE_SUPPLIES' },
      { asset_type: 'FAX' }
    ]
  })

  await prisma.trackingStatus.createMany({
    data: [
      { status: 'UNKNOWN' },
      { status: 'MISSING' },
      { status: 'PURCHASED' },
      { status: 'INBOUND' },
      { status: 'RECEIVING' },
      { status: 'REPAIRING' },
      { status: 'IN_STOCK' },
      { status: 'PACKING' },
      { status: 'OUTBOUND' },
      { status: 'DELIVERED' }
    ]
  })

  await prisma.availabilityStatus.createMany({
    data: [
      { status: 'UNKNOWN' },
      { status: 'AVAILABLE' },
      { status: 'HELD' },
      { status: 'SOLD' },
      { status: 'PARTS' },
      { status: 'SCRAP' },
      { status: 'RETURNED' },
      { status: 'LEASED' }
    ]
  })

  await prisma.technicalStatus.createMany({
    data: [
      { status: 'NOT_TESTED' },
      { status: 'OK' },
      { status: 'ERROR' },
      { status: 'PREPARED' },
      { status: 'PENDING' }
    ]
  })

  await prisma.role.createMany({
    data: [
      { role: 'ADMIN' },
      { role: 'MEMBER' },
      { role: 'INVENTORY' },
      { role: 'TECH' },
      { role: 'FINANCE' },
      { role: 'SALES' }
    ]
  })

  await prisma.fileType.createMany({
    data: [
      { type: 'PDF' },
      { type: 'IMAGE' }
    ]
  })

  await prisma.action.createMany({
    data: [
      { action: 'CREATE' },
      { action: 'UPDATE' },
      { action: 'DELETE' }
    ]
  })

  await prisma.invoiceType.createMany({
    data: [
      { type: 'PURCHASE' },
      { type: 'SALE' },
    ]
  })

  await prisma.entity.createMany({
    data: [
      { entity: 'ASSET' },
      { entity: 'ERROR' },
      { entity: 'PART' },
      { entity: 'TRANSFER' },
      { entity: 'ARRIVAL' },
      { entity: 'DEPARTURE' },
      { entity: 'HOLD' },
      { entity: 'INVOICE' },
      { entity: 'WAREHOUSE' },
      { entity: 'BRAND' },
      { entity: 'FILE' },
      { entity: 'COMMENT' },
      { entity: 'USER' },
      { entity: 'ORGANIZATION' }
    ]
  })
}