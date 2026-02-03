/*
  Warnings:

  - You are about to drop the column `from` on the `Hold` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Hold` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Hold" DROP COLUMN "from",
DROP COLUMN "to",
ADD COLUMN     "from_dt" TIMESTAMP(3),
ADD COLUMN     "to_dt" TIMESTAMP(3);
