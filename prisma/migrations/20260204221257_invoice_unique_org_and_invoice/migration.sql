/*
  Warnings:

  - A unique constraint covering the columns `[organization_id,invoice_number]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Invoice_organization_id_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_organization_id_invoice_number_key" ON "Invoice"("organization_id", "invoice_number");
