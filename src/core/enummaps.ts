import { AssetType, TechnicalStatus } from '../../generated/prisma/enums.js'

//--------------------------------------------------------------------
// ASSET TYPES
export const assetTypeMap: Record<string, AssetType> = {
    'Copier': AssetType.COPIER,
    'Finisher': AssetType.FINISHER,
    'Accessories': AssetType.ACCESSORY,
    'Scanner': AssetType.SCANNER,
    'Plotter': AssetType.PLOTTER,
    'Printer': AssetType.PRINTER,
    'Warehouse Supplies': AssetType.WAREHOUSE_SUPPLIES,
    'Fax': AssetType.FAX
}

//--------------------------------------------------------------------
// TECHNICAL STATUS
export const technicalStatusMap: Record<string, TechnicalStatus> ={
    'Not Tested': TechnicalStatus.NOT_TESTED,
    'Error': TechnicalStatus.ERROR,
    'Prepared': TechnicalStatus.PREPARED,
    'Pending': TechnicalStatus.PENDING,
    'Ok': TechnicalStatus.OK
}