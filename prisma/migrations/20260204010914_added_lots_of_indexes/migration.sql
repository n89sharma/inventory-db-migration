/*
  Warnings:

  - A unique constraint covering the columns `[brand_id,name]` on the table `Model` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Model_name_brand_id_key";

-- DropIndex
DROP INDEX "Warehouse_city_code_idx";

-- CreateIndex
CREATE INDEX "Arrival_destination_id_created_at_idx" ON "Arrival"("destination_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "Arrival_created_at_idx" ON "Arrival"("created_at" DESC);

-- CreateIndex
CREATE INDEX "Arrival_origin_id_idx" ON "Arrival"("origin_id");

-- CreateIndex
CREATE INDEX "Arrival_destination_id_idx" ON "Arrival"("destination_id");

-- CreateIndex
CREATE INDEX "Arrival_transporter_id_idx" ON "Arrival"("transporter_id");

-- CreateIndex
CREATE INDEX "Asset_warehouse_id_idx" ON "Asset"("warehouse_id");

-- CreateIndex
CREATE INDEX "Asset_model_id_idx" ON "Asset"("model_id");

-- CreateIndex
CREATE INDEX "Asset_created_at_idx" ON "Asset"("created_at" DESC);

-- CreateIndex
CREATE INDEX "AssetHistory_asset_id_changed_on_idx" ON "AssetHistory"("asset_id", "changed_on" DESC);

-- CreateIndex
CREATE INDEX "Comment_asset_id_created_at_idx" ON "Comment"("asset_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "Comment_created_by_id_idx" ON "Comment"("created_by_id");

-- CreateIndex
CREATE INDEX "Departure_origin_id_created_at_idx" ON "Departure"("origin_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "Departure_created_at_idx" ON "Departure"("created_at" DESC);

-- CreateIndex
CREATE INDEX "Departure_origin_id_idx" ON "Departure"("origin_id");

-- CreateIndex
CREATE INDEX "Departure_destination_id_idx" ON "Departure"("destination_id");

-- CreateIndex
CREATE INDEX "Departure_transporter_id_idx" ON "Departure"("transporter_id");

-- CreateIndex
CREATE INDEX "Error_code_idx" ON "Error"("code");

-- CreateIndex
CREATE INDEX "File_asset_id_uploaded_at_idx" ON "File"("asset_id", "uploaded_at" DESC);

-- CreateIndex
CREATE INDEX "File_uploaded_by_id_idx" ON "File"("uploaded_by_id");

-- CreateIndex
CREATE INDEX "File_name_idx" ON "File"("name");

-- CreateIndex
CREATE INDEX "Hold_created_at_idx" ON "Hold"("created_at" DESC);

-- CreateIndex
CREATE INDEX "Hold_created_for_id_customer_id_idx" ON "Hold"("created_for_id", "customer_id");

-- CreateIndex
CREATE INDEX "Hold_created_by_id_idx" ON "Hold"("created_by_id");

-- CreateIndex
CREATE INDEX "Hold_customer_id_idx" ON "Hold"("customer_id");

-- CreateIndex
CREATE INDEX "Hold_from_dt_idx" ON "Hold"("from_dt");

-- CreateIndex
CREATE INDEX "Hold_to_dt_idx" ON "Hold"("to_dt");

-- CreateIndex
CREATE INDEX "Invoice_created_at_idx" ON "Invoice"("created_at" DESC);

-- CreateIndex
CREATE INDEX "Invoice_invoice_type_invoice_number_idx" ON "Invoice"("invoice_type", "invoice_number");

-- CreateIndex
CREATE INDEX "Invoice_invoice_number_idx" ON "Invoice"("invoice_number");

-- CreateIndex
CREATE INDEX "Invoice_organization_id_idx" ON "Invoice"("organization_id");

-- CreateIndex
CREATE INDEX "Model_name_idx" ON "Model"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Model_brand_id_name_key" ON "Model"("brand_id", "name");

-- CreateIndex
CREATE INDEX "Transfer_created_at_idx" ON "Transfer"("created_at" DESC);

-- CreateIndex
CREATE INDEX "Transfer_origin_id_destination_id_idx" ON "Transfer"("origin_id", "destination_id");

-- CreateIndex
CREATE INDEX "Transfer_destination_id_idx" ON "Transfer"("destination_id");

-- CreateIndex
CREATE INDEX "Transfer_transporter_id_idx" ON "Transfer"("transporter_id");
