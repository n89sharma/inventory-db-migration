/*
  Warnings:

  - You are about to drop the column `country_of_origin` on the `Asset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "country_of_origin",
ADD COLUMN     "country_of_origin_id" INTEGER;

-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_country_of_origin_id_fkey" FOREIGN KEY ("country_of_origin_id") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;
