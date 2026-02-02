/*
  Warnings:

  - You are about to alter the column `purchase_cost` on the `Cost` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `transport_cost` on the `Cost` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `processing_cost` on the `Cost` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `other_cost` on the `Cost` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `parts_cost` on the `Cost` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `total_cost` on the `Cost` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `sale_price` on the `Cost` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `dealer_price` on the `Part` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `sale_price` on the `Part` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.
  - You are about to alter the column `cost` on the `Part` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.

*/
-- AlterTable
ALTER TABLE "Cost" ALTER COLUMN "purchase_cost" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "transport_cost" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "processing_cost" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "other_cost" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "parts_cost" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "total_cost" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "sale_price" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Part" ALTER COLUMN "dealer_price" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "sale_price" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "cost" SET DATA TYPE DECIMAL(12,2);
