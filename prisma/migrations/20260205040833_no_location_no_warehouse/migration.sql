-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_warehouse_id_asset_location_fkey";

-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_warehouse_id_fkey";

-- AlterTable
ALTER TABLE "Asset" ALTER COLUMN "warehouse_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_warehouse_id_asset_location_fkey" FOREIGN KEY ("warehouse_id", "asset_location") REFERENCES "Location"("warehouse_id", "location") ON DELETE SET NULL ON UPDATE CASCADE;
