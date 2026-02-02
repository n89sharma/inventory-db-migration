/*
  Warnings:

  - You are about to alter the column `arrival_number` on the `Arrival` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the column `brand_id` on the `Asset` table. All the data in the column will be lost.
  - You are about to alter the column `barcode` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `serial_number` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `asset_location` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `departure_number` on the `Departure` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the column `error_category_id` on the `Error` table. All the data in the column will be lost.
  - You are about to alter the column `code` on the `Error` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(10)`.
  - You are about to alter the column `hold_number` on the `Hold` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - The primary key for the `Location` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `location` on the `Location` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `account_number` on the `Organization` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `part_number` on the `Part` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `transfer_number` on the `Transfer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `city_code` on the `Warehouse` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(3)`.

*/
-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_warehouse_id_asset_location_fkey";

-- AlterTable
ALTER TABLE "Arrival" ALTER COLUMN "arrival_number" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "brand_id",
ALTER COLUMN "barcode" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "serial_number" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "asset_location" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Departure" ALTER COLUMN "departure_number" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Error" DROP COLUMN "error_category_id",
ALTER COLUMN "code" SET DATA TYPE CHAR(10);

-- AlterTable
ALTER TABLE "Hold" ALTER COLUMN "hold_number" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Location" DROP CONSTRAINT "Location_pkey",
ALTER COLUMN "location" SET DATA TYPE VARCHAR(50),
ADD CONSTRAINT "Location_pkey" PRIMARY KEY ("warehouse_id", "location");

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "account_number" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Part" ALTER COLUMN "part_number" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Transfer" ALTER COLUMN "transfer_number" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Warehouse" ALTER COLUMN "city_code" SET DATA TYPE CHAR(3);

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_warehouse_id_asset_location_fkey" FOREIGN KEY ("warehouse_id", "asset_location") REFERENCES "Location"("warehouse_id", "location") ON DELETE RESTRICT ON UPDATE CASCADE;
