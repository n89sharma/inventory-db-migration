import { AvailabilityStatus, Readiness } from '../../generated/prisma/browser.js'
import { Accessory, AssetType, FileType, Invoice, PrismaClient } from '../../generated/prisma/client.js'
import { createUserEntities } from './user.js'

export async function createReferenceData(prisma: PrismaClient) {

  await createUserEntities(prisma)

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

  await prisma.readiness.createMany({
    data: [
      { status: 'UNTESTED' },
      { status: 'HAS_ERRORS' },
      { status: 'PP_OK' },
      { status: 'CUSTOMER_READY' }
    ]
  })

  await prisma.fileType.createMany({
    data: [
      { type: 'PDF' },
      { type: 'IMAGE' }
    ]
  })

  await prisma.invoiceType.createMany({
    data: [
      { type: 'PURCHASE' },
      { type: 'SALE' },
    ]
  })
}

type PrismaEntity = Invoice | FileType | Readiness | AvailabilityStatus | AssetType | Accessory

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

export async function getReadinessIdMap(prisma: PrismaClient): Promise<Record<string, number>> {
  const readiness = await prisma.readiness.findMany()
  const readinessMap = getMap(readiness, (t) => t.status)
  return {
    'Not Tested': readinessMap['UNTESTED'],
    'OK': readinessMap['PP_OK'],
    'Error': readinessMap['HAS_ERRORS'],
    'Prepared': readinessMap['CUSTOMER_READY'],
    'Pending': readinessMap['UNTESTED']
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

export async function getInvoiceTypeIdMap(prisma: PrismaClient): Promise<Record<string, number>> {
  const invoiceTypes = await prisma.invoiceType.findMany()
  return getMap(invoiceTypes, (i) => i.type)
}