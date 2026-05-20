/*
  Warnings:

  - You are about to drop the column `technical_status_id` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the `TechnicalStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_technical_status_id_fkey";

-- DropIndex
DROP INDEX "Asset_technical_status_id_idx";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "technical_status_id",
ADD COLUMN     "readiness_id" INTEGER;

-- DropTable
DROP TABLE "TechnicalStatus";

-- CreateTable
CREATE TABLE "Readiness" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Readiness_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Readiness_status_key" ON "Readiness"("status");

-- CreateIndex
CREATE INDEX "Asset_readiness_id_idx" ON "Asset"("readiness_id");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_readiness_id_fkey" FOREIGN KEY ("readiness_id") REFERENCES "Readiness"("id") ON DELETE SET NULL ON UPDATE CASCADE;
