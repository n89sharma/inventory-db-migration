/*
  Warnings:

  - You are about to drop the column `availability_status_id` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the `AvailabilityStatus` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status_id` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Made the column `readiness_id` on table `Asset` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_availability_status_id_fkey";

-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_readiness_id_fkey";

-- DropIndex
DROP INDEX "Asset_availability_status_id_idx";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "availability_status_id",
ADD COLUMN     "status_id" INTEGER NOT NULL,
ALTER COLUMN "readiness_id" SET NOT NULL;

-- DropTable
DROP TABLE "AvailabilityStatus";

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Status_status_key" ON "Status"("status");

-- CreateIndex
CREATE INDEX "Asset_status_id_idx" ON "Asset"("status_id");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_readiness_id_fkey" FOREIGN KEY ("readiness_id") REFERENCES "Readiness"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
