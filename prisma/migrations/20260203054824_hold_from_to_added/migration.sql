/*
  Warnings:

  - Added the required column `is_held` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "is_held" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Hold" ADD COLUMN     "from" TIMESTAMP(3),
ADD COLUMN     "to" TIMESTAMP(3);
