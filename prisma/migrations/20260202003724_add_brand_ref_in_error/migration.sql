/*
  Warnings:

  - A unique constraint covering the columns `[category,brand_id]` on the table `ErrorCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `brand_id` to the `Error` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Error_code_key";

-- DropIndex
DROP INDEX "ErrorCategory_category_key";

-- AlterTable
ALTER TABLE "Error" ADD COLUMN     "brand_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ErrorCategory_category_brand_id_key" ON "ErrorCategory"("category", "brand_id");

-- AddForeignKey
ALTER TABLE "Error" ADD CONSTRAINT "Error_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
