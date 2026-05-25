-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "country_of_origin" TEXT;

-- AlterTable
ALTER TABLE "TechnicalSpecification" ADD COLUMN     "toner_life_c" INTEGER,
ADD COLUMN     "toner_life_k" INTEGER,
ADD COLUMN     "toner_life_m" INTEGER,
ADD COLUMN     "toner_life_y" INTEGER;
