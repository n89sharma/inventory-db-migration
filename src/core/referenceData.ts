import { Country } from '../../generated/prisma/browser.js'
import { Accessory, AssetType, FileType, Invoice, PrismaClient, Readiness, Status, Zone } from '../../generated/prisma/client.js'
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

  await prisma.status.createMany({
    data: [
      { status: 'UNKNOWN' },
      { status: 'ON_ORDER' },
      { status: 'IN_STOCK' },
      { status: 'HELD' },
      { status: 'SOLD' },
      { status: 'HARVESTED' },
      { status: 'SCRAPPED' },
      { status: 'RETURNED' },
      { status: 'MISSING' },
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

  await prisma.zone.createMany({
    data: [
      { zone: 'TECH' },
      { zone: 'SHIPPING_AND_RECEIVING' },
      { zone: 'PARTS' },
      { zone: 'BIN' },
    ]
  })

  await prisma.country.createMany({
    data: [
      { name: 'THAILAND' },
      { name: 'CHINA' },
      { name: 'JAPAN' },
      { name: 'VIETNAM' },
      { name: 'MEXICO' },
      { name: 'USA' },
      { name: 'PHILIPPINES' },
      { name: 'MALAYSIA' },
      { name: 'TAIWAN' },
    ]
  })
}

type PrismaEntity = Invoice | FileType | Readiness | Status | AssetType | Accessory | Zone | Country

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

export async function getStatusIdMap(prisma: PrismaClient): Promise<Record<string, number>> {
  const statuses = await prisma.status.findMany()
  const statusMap = getMap(statuses, (a) => a.status)
  return {
    'Unknown': statusMap['UNKNOWN'],
    'In Transit': statusMap['IN_STOCK'],
    'Stock': statusMap['IN_STOCK'],
    'Hold': statusMap['HELD'],
    'Sold': statusMap['SOLD'],
    'Void': statusMap['UNKNOWN'],
    'For parts': statusMap['HARVESTED'],
    'Scrap': statusMap['SCRAPPED'],
    'Consignment': statusMap['UNKNOWN'],
    'Transferred': statusMap['IN_STOCK'],
    'Returned': statusMap['RETURNED'],
    'Alot': statusMap['HELD'],
    'Loan': statusMap['UNKNOWN'],
    'Missing': statusMap['MISSING'],
    'Return To Vendor': statusMap['RETURNED'],
    'Return To Remarketing': statusMap['RETURNED'],
    'Lease': statusMap['LEASED']
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

export async function getZoneIdMap(prisma: PrismaClient): Promise<Record<string, number>> {
  const zones = await prisma.zone.findMany()
  return getMap(zones, (z) => z.zone)
}

export async function getCountryIdMap(prisma: PrismaClient): Promise<Record<string, number>> {
  const countries = await prisma.country.findMany()
  return getMap(countries, (c) => c.name)
}