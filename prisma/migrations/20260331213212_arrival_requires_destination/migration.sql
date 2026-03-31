/*
  Warnings:

  - Made the column `destination_id` on table `Arrival` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Arrival" DROP CONSTRAINT "Arrival_destination_id_fkey";

-- AlterTable
ALTER TABLE "Arrival" ALTER COLUMN "destination_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Arrival" ADD CONSTRAINT "Arrival_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
