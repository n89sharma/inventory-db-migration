/*
  Warnings:

  - Added the required column `is_exchange` to the `PartTransfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PartTransfer" ADD COLUMN     "is_exchange" BOOLEAN NOT NULL;
