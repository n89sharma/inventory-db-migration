/*
  Warnings:

  - A unique constraint covering the columns `[city_code,street]` on the table `Warehouse` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_city_code_street_key" ON "Warehouse"("city_code", "street");
