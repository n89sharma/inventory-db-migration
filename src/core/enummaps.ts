import { AssetType, AvailabilityStatus, TechnicalStatus, TrackingStatus } from '../../generated/prisma/enums.js'

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
export const technicalStatusMap: Record<string, TechnicalStatus> = {
    'Not Tested': TechnicalStatus.NOT_TESTED,
    'OK': TechnicalStatus.OK,
    'Error': TechnicalStatus.ERROR,
    'Prepared': TechnicalStatus.PREPARED,
    'Pending': TechnicalStatus.PENDING
}

export const trackingStatusMap: Record<string, TrackingStatus> = {
    'Unknown':      TrackingStatus.UNKNOWN,
    'In Transit':   TrackingStatus.INBOUND,
    'Stock':        TrackingStatus.IN_STOCK,
    'Hold':         TrackingStatus.UNKNOWN,
    'Sold':         TrackingStatus.DELIVERED,
    'Void':         TrackingStatus.UNKNOWN,
    'For parts':    TrackingStatus.DELIVERED,
    'Scrap':        TrackingStatus.DELIVERED,
    'Consignment':  TrackingStatus.UNKNOWN,
    'Transferred':  TrackingStatus.DELIVERED,
    'Returned':     TrackingStatus.DELIVERED,
    'Alot':         TrackingStatus.UNKNOWN,
    'Loan':         TrackingStatus.UNKNOWN,
    'Missing':      TrackingStatus.MISSING,
    'Return To Vendor':         TrackingStatus.DELIVERED,
    'Return To Remarketing':    TrackingStatus.DELIVERED,  
    'Lease':        TrackingStatus.DELIVERED
}

export const availabilityStatusMap: Record<string, AvailabilityStatus> = {
    'Unknown':      AvailabilityStatus.UNKNOWN,
    'In Transit':   AvailabilityStatus.AVAILABLE,
    'Stock':        AvailabilityStatus.AVAILABLE,
    'Hold':         AvailabilityStatus.HELD,
    'Sold':         AvailabilityStatus.SOLD,
    'Void':         AvailabilityStatus.UNKNOWN,
    'For parts':    AvailabilityStatus.PARTS,
    'Scrap':        AvailabilityStatus.SCRAP,
    'Consignment':  AvailabilityStatus.UNKNOWN,
    'Transferred':  AvailabilityStatus.UNKNOWN,
    'Returned':     AvailabilityStatus.RETURNED,
    'Alot':         AvailabilityStatus.HELD,
    'Loan':         AvailabilityStatus.UNKNOWN,
    'Missing':      AvailabilityStatus.UNKNOWN,
    'Return To Vendor':         AvailabilityStatus.RETURNED,
    'Return To Remarketing':    AvailabilityStatus.RETURNED,  
    'Lease':        AvailabilityStatus.LEASED
}