/*
  Warnings:

  - You are about to drop the `PartTransfers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PartTransfers" DROP CONSTRAINT "PartTransfers_donor_asset_id_fkey";

-- DropForeignKey
ALTER TABLE "PartTransfers" DROP CONSTRAINT "PartTransfers_fixed_by_fkey";

-- DropForeignKey
ALTER TABLE "PartTransfers" DROP CONSTRAINT "PartTransfers_recipient_asset_id_fkey";

-- DropTable
DROP TABLE "PartTransfers";

-- CreateTable
CREATE TABLE "PartTransfer" (
    "id" SERIAL NOT NULL,
    "recipient_asset_id" INTEGER NOT NULL,
    "donor_asset_id" INTEGER NOT NULL,
    "fixed_at" TIMESTAMP(3) NOT NULL,
    "fixed_by" INTEGER NOT NULL,
    "part" TEXT NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "PartTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PartTransfer_recipient_asset_id_idx" ON "PartTransfer"("recipient_asset_id");

-- CreateIndex
CREATE INDEX "PartTransfer_donor_asset_id_idx" ON "PartTransfer"("donor_asset_id");

-- AddForeignKey
ALTER TABLE "PartTransfer" ADD CONSTRAINT "PartTransfer_recipient_asset_id_fkey" FOREIGN KEY ("recipient_asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartTransfer" ADD CONSTRAINT "PartTransfer_donor_asset_id_fkey" FOREIGN KEY ("donor_asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartTransfer" ADD CONSTRAINT "PartTransfer_fixed_by_fkey" FOREIGN KEY ("fixed_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
