-- DropForeignKey
ALTER TABLE "Arrival" DROP CONSTRAINT "Arrival_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "Arrival" DROP CONSTRAINT "Arrival_destination_id_fkey";

-- AlterTable
ALTER TABLE "Arrival" ALTER COLUMN "destination_id" DROP NOT NULL,
ALTER COLUMN "created_by_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Arrival" ADD CONSTRAINT "Arrival_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrival" ADD CONSTRAINT "Arrival_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
