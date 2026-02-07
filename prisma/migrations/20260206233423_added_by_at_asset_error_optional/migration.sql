-- DropForeignKey
ALTER TABLE "AssetError" DROP CONSTRAINT "AssetError_added_by_fkey";

-- AlterTable
ALTER TABLE "AssetError" ALTER COLUMN "added_by" DROP NOT NULL,
ALTER COLUMN "added_at" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AssetError" ADD CONSTRAINT "AssetError_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
