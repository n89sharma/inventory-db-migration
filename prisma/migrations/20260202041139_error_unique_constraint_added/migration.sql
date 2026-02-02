/*
  Warnings:

  - A unique constraint covering the columns `[brand_id,code]` on the table `Error` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Error_brand_id_code_key" ON "Error"("brand_id", "code");
