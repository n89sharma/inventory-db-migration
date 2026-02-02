/*
  Warnings:

  - The primary key for the `Location` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_warehouse_id_asset_location_fkey";

-- AlterTable
ALTER TABLE "Arrival" ALTER COLUMN "arrival_number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Asset" ALTER COLUMN "barcode" SET DATA TYPE TEXT,
ALTER COLUMN "serial_number" SET DATA TYPE TEXT,
ALTER COLUMN "asset_location" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Brand" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Departure" ALTER COLUMN "departure_number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Error" ALTER COLUMN "code" SET DATA TYPE TEXT,
ALTER COLUMN "category" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Hold" ALTER COLUMN "hold_number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "invoice_number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Location" DROP CONSTRAINT "Location_pkey",
ALTER COLUMN "location" SET DATA TYPE TEXT,
ADD CONSTRAINT "Location_pkey" PRIMARY KEY ("warehouse_id", "location");

-- AlterTable
ALTER TABLE "Model" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "account_number" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "contact_name" SET DATA TYPE TEXT,
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ALTER COLUMN "phone_ext" SET DATA TYPE TEXT,
ALTER COLUMN "primary_email" SET DATA TYPE TEXT,
ALTER COLUMN "secondary_email" SET DATA TYPE TEXT,
ALTER COLUMN "address" SET DATA TYPE TEXT,
ALTER COLUMN "city" SET DATA TYPE TEXT,
ALTER COLUMN "province" SET DATA TYPE TEXT,
ALTER COLUMN "country" SET DATA TYPE TEXT,
ALTER COLUMN "website" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Part" ALTER COLUMN "description" SET DATA TYPE TEXT,
ALTER COLUMN "part_number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "TechnicalSpecification" ALTER COLUMN "internal_finisher" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Transfer" ALTER COLUMN "transfer_number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "googleId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Warehouse" ALTER COLUMN "city_code" SET DATA TYPE TEXT,
ALTER COLUMN "street" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_warehouse_id_asset_location_fkey" FOREIGN KEY ("warehouse_id", "asset_location") REFERENCES "Location"("warehouse_id", "location") ON DELETE RESTRICT ON UPDATE CASCADE;
