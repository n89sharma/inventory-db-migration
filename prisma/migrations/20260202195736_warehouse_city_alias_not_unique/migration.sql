-- DropIndex
DROP INDEX "Warehouse_city_code_key";

-- CreateIndex
CREATE INDEX "Warehouse_city_code_idx" ON "Warehouse"("city_code");
