/*
  Warnings:

  - You are about to drop the column `tracking_status_id` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the `TrackingStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_tracking_status_id_fkey";

-- DropIndex
DROP INDEX "Asset_tracking_status_id_idx";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "tracking_status_id";

-- DropTable
DROP TABLE "TrackingStatus";
