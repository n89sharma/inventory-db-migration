/*
  Warnings:

  - You are about to drop the column `is_held` on the `Asset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "is_held";

-- CreateIndex
CREATE INDEX "Asset_serial_number_idx" ON "Asset"("serial_number");

-- CreateIndex
CREATE INDEX "Asset_model_id_warehouse_id_idx" ON "Asset"("model_id", "warehouse_id");

-- CreateIndex
CREATE INDEX "Asset_model_id_warehouse_id_exit_status_tracking_status_idx" ON "Asset"("model_id", "warehouse_id", "exit_status", "tracking_status");

-- CreateIndex
CREATE INDEX "Asset_arrival_id_idx" ON "Asset"("arrival_id");

-- CreateIndex
CREATE INDEX "Asset_departure_id_idx" ON "Asset"("departure_id");

-- CreateIndex
CREATE INDEX "Asset_hold_id_idx" ON "Asset"("hold_id");

-- CreateIndex
CREATE INDEX "Asset_purchase_invoice_id_idx" ON "Asset"("purchase_invoice_id");

-- CreateIndex
CREATE INDEX "Asset_sales_invoice_id_idx" ON "Asset"("sales_invoice_id");
