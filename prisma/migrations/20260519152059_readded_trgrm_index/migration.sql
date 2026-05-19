-- CreateIndex
CREATE INDEX "Asset_barcode_normalized_idx" ON "Asset" USING GIN ("barcode_normalized" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Asset_serial_normalized_idx" ON "Asset" USING GIN ("serial_normalized" gin_trgm_ops);
