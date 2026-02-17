/*
  Warnings:

  - The primary key for the `AssetPart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `asset_id` on the `AssetPart` table. All the data in the column will be lost.
  - You are about to drop the column `part_id` on the `AssetPart` table. All the data in the column will be lost.
  - You are about to drop the column `part_operation` on the `AssetPart` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[recipient_asset_id,donor_asset_id,store_part_id]` on the table `AssetPart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `notes` to the `AssetPart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient_asset_id` to the `AssetPart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AssetPart" DROP CONSTRAINT "AssetPart_asset_id_fkey";

-- DropForeignKey
ALTER TABLE "AssetPart" DROP CONSTRAINT "AssetPart_part_id_fkey";

-- AlterTable
ALTER TABLE "AssetPart" DROP CONSTRAINT "AssetPart_pkey",
DROP COLUMN "asset_id",
DROP COLUMN "part_id",
DROP COLUMN "part_operation",
ADD COLUMN     "donor_asset_id" INTEGER,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "notes" TEXT NOT NULL,
ADD COLUMN     "recipient_asset_id" INTEGER NOT NULL,
ADD COLUMN     "store_part_id" INTEGER,
ADD CONSTRAINT "AssetPart_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "PartOperation";

-- CreateIndex
CREATE UNIQUE INDEX "AssetPart_recipient_asset_id_donor_asset_id_store_part_id_key" ON "AssetPart"("recipient_asset_id", "donor_asset_id", "store_part_id");

-- AddForeignKey
ALTER TABLE "AssetPart" ADD CONSTRAINT "AssetPart_recipient_asset_id_fkey" FOREIGN KEY ("recipient_asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetPart" ADD CONSTRAINT "AssetPart_donor_asset_id_fkey" FOREIGN KEY ("donor_asset_id") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetPart" ADD CONSTRAINT "AssetPart_store_part_id_fkey" FOREIGN KEY ("store_part_id") REFERENCES "Part"("id") ON DELETE SET NULL ON UPDATE CASCADE;
