import { AvailabilityStatus } from '../../generated/prisma/browser.js'
import { Accessory, AssetType, Entity, FileType, Invoice, PrismaClient, Role, TechnicalStatus, TrackingStatus } from '../../generated/prisma/client.js'

export async function createReferenceData(prisma: PrismaClient) {

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

type PrismaEntity = Entity | Invoice | FileType | Role | TechnicalStatus | AvailabilityStatus | TrackingStatus | AssetType | Accessory

function getMap<T extends PrismaEntity>(entities: T[], getField: (e: T) => string) {
  return entities.reduce((map, e: T) => {
    map[getField(e)] = e.id
    return map
  }, {} as Record<string, number>)
}

export async function getAssetTypeIdMap(prisma: PrismaClient): Promise<Record<string, number>> {
  const assetTypes = await prisma.assetType.findMany()
  const assetTypeMap = getMap(assetTypes, (a) => a.asset_type)
  return {
    'Copier': assetTypeMap['COPIER'],
    'Finisher': assetTypeMap['FINISHER'],
    'Accessories': assetTypeMap['ACCESSORY'],
    'Scanner': assetTypeMap['SCANNER'],
    'Plotter': assetTypeMap['PLOTTER'],
    'Printer': assetTypeMap['PRINTER'],
    'Warehouse Supplies': assetTypeMap['WAREHOUSE_SUPPLIES'],
    'Fax': assetTypeMap['FAX']
  }
}

export async function getTechnicalStatusIdMap(prisma: PrismaClient): Promise<Record<string, number>> {
  const technicalStatuses = await prisma.technicalStatus.findMany()
  const technicalStatusMap = getMap(technicalStatuses, (t) => t.status)
  return {
    'Not Tested': technicalStatusMap['NOT_TESTED'],
    'OK': technicalStatusMap['OK'],
    'Error': technicalStatusMap['ERROR'],
    'Prepared': technicalStatusMap['PREPARED'],
    'Pending': technicalStatusMap['PENDING']
  }
}

export async function getTrackingStatusIdMap(prisma: PrismaClient): Promise<Record<string, number>> {
  const trackingStatuses = await prisma.trackingStatus.findMany()
  const trackingStatusMap = getMap(trackingStatuses, (t) => t.status)
  return {
    'Unknown': trackingStatusMap['UNKNOWN'],
    'In Transit': trackingStatusMap['INBOUND'],
    'Stock': trackingStatusMap['IN_STOCK'],
    'Hold': trackingStatusMap['UNKNOWN'],
    'Sold': trackingStatusMap['DELIVERED'],
    'Void': trackingStatusMap['UNKNOWN'],
    'For parts': trackingStatusMap['DELIVERED'],
    'Scrap': trackingStatusMap['DELIVERED'],
    'Consignment': trackingStatusMap['UNKNOWN'],
    'Transferred': trackingStatusMap['DELIVERED'],
    'Returned': trackingStatusMap['DELIVERED'],
    'Alot': trackingStatusMap['UNKNOWN'],
    'Loan': trackingStatusMap['UNKNOWN'],
    'Missing': trackingStatusMap['MISSING'],
    'Return To Vendor': trackingStatusMap['DELIVERED'],
    'Return To Remarketing': trackingStatusMap['DELIVERED'],
    'Lease': trackingStatusMap['DELIVERED']
  }
}

export async function getAvailabilityStatusIdMap(prisma: PrismaClient): Promise<Record<string, number>> {
  const availabilityStatuses = await prisma.availabilityStatus.findMany()
  const availabilityStatusMap = getMap(availabilityStatuses, (a) => a.status)
  return {
    'Unknown': availabilityStatusMap['UNKNOWN'],
    'In Transit': availabilityStatusMap['AVAILABLE'],
    'Stock': availabilityStatusMap['AVAILABLE'],
    'Hold': availabilityStatusMap['HELD'],
    'Sold': availabilityStatusMap['SOLD'],
    'Void': availabilityStatusMap['UNKNOWN'],
    'For parts': availabilityStatusMap['PARTS'],
    'Scrap': availabilityStatusMap['SCRAP'],
    'Consignment': availabilityStatusMap['UNKNOWN'],
    'Transferred': availabilityStatusMap['UNKNOWN'],
    'Returned': availabilityStatusMap['RETURNED'],
    'Alot': availabilityStatusMap['HELD'],
    'Loan': availabilityStatusMap['UNKNOWN'],
    'Missing': availabilityStatusMap['UNKNOWN'],
    'Return To Vendor': availabilityStatusMap['RETURNED'],
    'Return To Remarketing': availabilityStatusMap['RETURNED'],
    'Lease': availabilityStatusMap['LEASED']
  }
}

export async function getAccessoryIdMap(prisma: PrismaClient): Promise<Record<string, number>> {
  const accessories = await prisma.accessory.findMany()
  const accessoryMap = getMap(accessories, (a) => a.accessory)
  return {
    'NIC': accessoryMap['NIC'],
    'PS': accessoryMap['PS'],
    'PCL': accessoryMap['PCL'],
    'UFR': accessoryMap['UFR'],
    'FAX': accessoryMap['FAX'],
    'USEND': accessoryMap['USEND'],
    'DF': accessoryMap['DF'],
    'CASS': accessoryMap['CASS'],
    'FIN': accessoryMap['FIN'],
    'BF': accessoryMap['BF'],
    'HDD': accessoryMap['HDD'],
    'SCAN': accessoryMap['SCAN']
  }
}

export async function getRoleIdMap(prisma: PrismaClient): Promise<Record<string, number>> {
  const roles = await prisma.role.findMany()
  return getMap(roles, (r) => r.role)
}

export async function getInvoiceTypeIdMap(prisma: PrismaClient): Promise<Record<string, number>> {
  const invoiceTypes = await prisma.invoiceType.findMany()
  return getMap(invoiceTypes, (i) => i.type)
}