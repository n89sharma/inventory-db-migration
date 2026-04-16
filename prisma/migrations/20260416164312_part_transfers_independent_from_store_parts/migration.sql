/*
  Warnings:

  - You are about to drop the `AssetPart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Part` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssetPart" DROP CONSTRAINT "AssetPart_donor_asset_id_fkey";

-- DropForeignKey
ALTER TABLE "AssetPart" DROP CONSTRAINT "AssetPart_recipient_asset_id_fkey";

-- DropForeignKey
ALTER TABLE "AssetPart" DROP CONSTRAINT "AssetPart_store_part_id_fkey";

-- DropForeignKey
ALTER TABLE "AssetPart" DROP CONSTRAINT "AssetPart_updated_by_fkey";

-- DropTable
DROP TABLE "AssetPart";

-- DropTable
DROP TABLE "Part";

-- CreateTable
CREATE TABLE "StorePart" (
    "id" SERIAL NOT NULL,
    "part_number" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "dealer_price" DECIMAL(12,2) NOT NULL,
    "sale_price" DECIMAL(12,2) NOT NULL,
    "cost" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "StorePart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartTransfers" (
    "id" SERIAL NOT NULL,
    "recipient_asset_id" INTEGER NOT NULL,
    "donor_asset_id" INTEGER NOT NULL,
    "fixed_at" TIMESTAMP(3) NOT NULL,
    "fixed_by" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "PartTransfers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StorePart_part_number_key" ON "StorePart"("part_number");

-- CreateIndex
CREATE INDEX "PartTransfers_recipient_asset_id_idx" ON "PartTransfers"("recipient_asset_id");

-- CreateIndex
CREATE INDEX "PartTransfers_donor_asset_id_idx" ON "PartTransfers"("donor_asset_id");

-- AddForeignKey
ALTER TABLE "PartTransfers" ADD CONSTRAINT "PartTransfers_recipient_asset_id_fkey" FOREIGN KEY ("recipient_asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartTransfers" ADD CONSTRAINT "PartTransfers_donor_asset_id_fkey" FOREIGN KEY ("donor_asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartTransfers" ADD CONSTRAINT "PartTransfers_fixed_by_fkey" FOREIGN KEY ("fixed_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
