/*
  Warnings:

  - You are about to drop the `ErrorCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Error` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Error" DROP CONSTRAINT "Error_error_category_id_fkey";

-- DropForeignKey
ALTER TABLE "ErrorCategory" DROP CONSTRAINT "ErrorCategory_brand_id_fkey";

-- AlterTable
ALTER TABLE "Error" ADD COLUMN     "category" VARCHAR(100) NOT NULL;

-- DropTable
DROP TABLE "ErrorCategory";
