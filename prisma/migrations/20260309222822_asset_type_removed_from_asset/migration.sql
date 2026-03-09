/*
  Warnings:

  - You are about to drop the column `asset_type_id` on the `Asset` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_asset_type_id_fkey";

-- DropIndex
DROP INDEX "Asset_asset_type_id_idx";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "asset_type_id";
