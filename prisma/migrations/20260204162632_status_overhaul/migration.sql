/*
  Warnings:

  - The values [IN_TRANSIT,DEPARTED] on the enum `TrackingStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `exit_status` on the `Asset` table. All the data in the column will be lost.
  - Added the required column `availability_status` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('UNKNOWN', 'AVAILABLE', 'SOLD', 'PARTS', 'SCRAP', 'RETURNED', 'LEASED');

-- AlterEnum
BEGIN;
CREATE TYPE "TrackingStatus_new" AS ENUM ('UNKNOWN', 'MISSING', 'PURCHASED', 'INBOUND', 'RECEIVING', 'REPAIRING', 'IN_STOCK', 'PACKING', 'OUTBOUND', 'DELIVERED');
ALTER TABLE "Asset" ALTER COLUMN "tracking_status" TYPE "TrackingStatus_new" USING ("tracking_status"::text::"TrackingStatus_new");
ALTER TYPE "TrackingStatus" RENAME TO "TrackingStatus_old";
ALTER TYPE "TrackingStatus_new" RENAME TO "TrackingStatus";
DROP TYPE "public"."TrackingStatus_old";
COMMIT;

-- DropIndex
DROP INDEX "Asset_model_id_warehouse_id_exit_status_tracking_status_idx";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "exit_status",
ADD COLUMN     "availability_status" "AvailabilityStatus" NOT NULL;

-- DropEnum
DROP TYPE "ExitStatus";

-- CreateIndex
CREATE INDEX "Asset_model_id_warehouse_id_availability_status_tracking_st_idx" ON "Asset"("model_id", "warehouse_id", "availability_status", "tracking_status");
