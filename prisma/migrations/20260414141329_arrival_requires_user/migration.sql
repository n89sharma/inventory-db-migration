/*
  Warnings:

  - Made the column `created_by_id` on table `Arrival` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Arrival" DROP CONSTRAINT "Arrival_created_by_id_fkey";

-- AlterTable
ALTER TABLE "Arrival" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Arrival" ADD CONSTRAINT "Arrival_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
