-- DropIndex
DROP INDEX "Organization_name_contact_name_primary_email_idx";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "mobile" TEXT;

-- CreateIndex
CREATE INDEX "Organization_name_idx" ON "Organization"("name");
