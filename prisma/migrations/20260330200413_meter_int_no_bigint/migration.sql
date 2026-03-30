/*
  Warnings:

  - You are about to alter the column `meter_black` on the `TechnicalSpecification` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `meter_colour` on the `TechnicalSpecification` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `meter_total` on the `TechnicalSpecification` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "TechnicalSpecification" ALTER COLUMN "meter_black" SET DATA TYPE INTEGER,
ALTER COLUMN "meter_colour" SET DATA TYPE INTEGER,
ALTER COLUMN "meter_total" SET DATA TYPE INTEGER;
