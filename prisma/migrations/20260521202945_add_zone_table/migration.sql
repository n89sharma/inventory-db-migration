/*
  Warnings:

  - You are about to drop the column `location` on the `Location` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[warehouse_id,zone_id,bin]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `zone_id` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Location_warehouse_id_location_key";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "location",
ADD COLUMN     "bin" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "zone_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Zone" (
    "id" SERIAL NOT NULL,
    "zone" TEXT NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Zone_zone_key" ON "Zone"("zone");

-- CreateIndex
CREATE UNIQUE INDEX "Location_warehouse_id_zone_id_bin_key" ON "Location"("warehouse_id", "zone_id", "bin");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
