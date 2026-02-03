-- DropForeignKey
ALTER TABLE "Departure" DROP CONSTRAINT "Departure_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "Departure" DROP CONSTRAINT "Departure_sales_representative_id_fkey";

-- AlterTable
ALTER TABLE "Departure" ALTER COLUMN "created_by_id" DROP NOT NULL,
ALTER COLUMN "sales_representative_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_sales_representative_id_fkey" FOREIGN KEY ("sales_representative_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
