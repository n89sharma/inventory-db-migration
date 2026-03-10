/*
  Warnings:

  - You are about to drop the column `asset_location` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `warehouse_id` on the `Asset` table. All the data in the column will be lost.
  - The primary key for the `Location` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[warehouse_id,location]` on the table `Location` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_warehouse_id_asset_location_fkey";

-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_warehouse_id_fkey";

-- DropIndex
DROP INDEX "Asset_asset_location_idx";

-- DropIndex
DROP INDEX "Asset_warehouse_id_idx";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "asset_location",
DROP COLUMN "warehouse_id",
ADD COLUMN     "location_id" INTEGER;

-- AlterTable
ALTER TABLE "Location" DROP CONSTRAINT "Location_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Location_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Asset_location_id_idx" ON "Asset"("location_id");

-- CreateIndex
CREATE UNIQUE INDEX "Location_warehouse_id_location_key" ON "Location"("warehouse_id", "location");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
