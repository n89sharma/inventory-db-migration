-- CreateEnum
CREATE TYPE "Accessory" AS ENUM ('NIC', 'PS', 'PCL', 'UFR', 'FAX', 'USEND', 'DF', 'CASS', 'FIN', 'BF');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('COPIER', 'FINISHER', 'ACCESSORY', 'SCANNER', 'PLOTTER', 'PRINTER', 'WAREHOUSE_SUPPLIES', 'FAX');

-- CreateEnum
CREATE TYPE "TrackingStatus" AS ENUM ('UNKNOWN', 'MISSING', 'IN_TRANSIT', 'IN_STOCK', 'DEPARTED');

-- CreateEnum
CREATE TYPE "ExitStatus" AS ENUM ('UNKNOWN', 'OWNED', 'SOLD', 'PARTS', 'SCRAP', 'RETURNED', 'LEASED');

-- CreateEnum
CREATE TYPE "TechnicalStatus" AS ENUM ('NOT_TESTED', 'OK', 'ERROR', 'PREPARED', 'PENDING');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'FINANCE', 'SALES');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('PDF', 'IMAGE');

-- CreateEnum
CREATE TYPE "GeneralOperation" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "PartOperation" AS ENUM ('ADDED', 'REMOVED');

-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('PURCHASE', 'SALE', 'OTHER');

-- CreateEnum
CREATE TYPE "DataField" AS ENUM ('location', 'tracking_status', 'technical_status', 'exit_status', 'purchase_invoice', 'sales_invoice', 'arrival', 'departure', 'transfer', 'hold', 'cost', 'technical_specification', 'error', 'accessory', 'part');

-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "barcode" VARCHAR(15) NOT NULL,
    "serial_number" VARCHAR(50) NOT NULL,
    "brand_id" INTEGER NOT NULL,
    "model_id" INTEGER NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "asset_location" VARCHAR(25),
    "asset_type" "AssetType" NOT NULL,
    "tracking_status" "TrackingStatus" NOT NULL,
    "exit_status" "ExitStatus" NOT NULL,
    "technical_status" "TechnicalStatus" NOT NULL,
    "purchase_invoice_id" INTEGER,
    "sales_invoice_id" INTEGER,
    "arrival_id" INTEGER,
    "departure_id" INTEGER,
    "hold_id" INTEGER,
    "is_held" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalSpecification" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "cassettes" INTEGER,
    "internal_finisher" VARCHAR(15),
    "meter_black" INTEGER,
    "meter_colour" INTEGER,
    "meter_total" INTEGER,
    "drum_life_c" INTEGER,
    "drum_life_m" INTEGER,
    "drum_life_y" INTEGER,
    "drum_life_k" INTEGER,

    CONSTRAINT "TechnicalSpecification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cost" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "purchase_cost" MONEY,
    "transport_cost" MONEY,
    "processing_cost" MONEY,
    "other_cost" MONEY,
    "parts_cost" MONEY,
    "total_cost" MONEY,
    "sale_price" MONEY,

    CONSTRAINT "Cost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetAccessory" (
    "asset_id" INTEGER NOT NULL,
    "accessory" "Accessory" NOT NULL,

    CONSTRAINT "AssetAccessory_pkey" PRIMARY KEY ("asset_id","accessory")
);

-- CreateTable
CREATE TABLE "ErrorCategory" (
    "id" SERIAL NOT NULL,
    "brand_id" INTEGER NOT NULL,
    "category" VARCHAR(100) NOT NULL,

    CONSTRAINT "ErrorCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Error" (
    "id" SERIAL NOT NULL,
    "error_category_id" INTEGER NOT NULL,
    "code" VARCHAR(15) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Error_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetError" (
    "asset_id" INTEGER NOT NULL,
    "error_id" INTEGER NOT NULL,
    "is_fixed" BOOLEAN NOT NULL,
    "added_by" INTEGER NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL,
    "fixed_by" INTEGER,
    "fixed_at" TIMESTAMP(3),

    CONSTRAINT "AssetError_pkey" PRIMARY KEY ("asset_id","error_id")
);

-- CreateTable
CREATE TABLE "Part" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "part_number" VARCHAR(25) NOT NULL,
    "dealer_price" MONEY NOT NULL,
    "sale_price" MONEY NOT NULL,
    "cost" MONEY NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetPart" (
    "asset_id" INTEGER NOT NULL,
    "part_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER NOT NULL,
    "part_operation" "PartOperation" NOT NULL,

    CONSTRAINT "AssetPart_pkey" PRIMARY KEY ("asset_id","part_id")
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id" SERIAL NOT NULL,
    "transfer_number" VARCHAR(15) NOT NULL,
    "origin_id" INTEGER NOT NULL,
    "destination_id" INTEGER NOT NULL,
    "transporter_id" INTEGER NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetTransfer" (
    "asset_id" INTEGER NOT NULL,
    "transfer_id" INTEGER NOT NULL,

    CONSTRAINT "AssetTransfer_pkey" PRIMARY KEY ("asset_id","transfer_id")
);

-- CreateTable
CREATE TABLE "Arrival" (
    "id" SERIAL NOT NULL,
    "arrival_number" VARCHAR(15) NOT NULL,
    "origin_id" INTEGER NOT NULL,
    "destination_id" INTEGER NOT NULL,
    "transporter_id" INTEGER NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Arrival_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departure" (
    "id" SERIAL NOT NULL,
    "departure_number" VARCHAR(15) NOT NULL,
    "origin_id" INTEGER NOT NULL,
    "destination_id" INTEGER NOT NULL,
    "transporter_id" INTEGER NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "sales_representative_id" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Departure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hold" (
    "id" SERIAL NOT NULL,
    "hold_number" VARCHAR(15) NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "created_for_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hold_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "invoice_number" VARCHAR(50) NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "is_cleared" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "invoice_type" "InvoiceType" NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" SERIAL NOT NULL,
    "city_code" VARCHAR(3) NOT NULL,
    "street" VARCHAR(50) NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "warehouse_id" INTEGER NOT NULL,
    "location" VARCHAR(25) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("warehouse_id","location")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(45) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "asset_type" "AssetType" NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "brand_id" INTEGER NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "uploaded_by_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "FileType" NOT NULL,
    "data" BYTEA NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "googleId" VARCHAR(255),
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "account_number" VARCHAR(15) NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "contact_name" VARCHAR(45),
    "phone" VARCHAR(15),
    "phone_ext" VARCHAR(10),
    "primary_email" VARCHAR(50),
    "secondary_email" VARCHAR(50),
    "address" VARCHAR(100),
    "city" VARCHAR(50),
    "province" VARCHAR(50),
    "country" VARCHAR(50),
    "website" VARCHAR(100),

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetHistory" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "operation" "GeneralOperation" NOT NULL,
    "data_field" "DataField" NOT NULL,
    "changed_on" TIMESTAMP(3) NOT NULL,
    "changes" JSONB NOT NULL,

    CONSTRAINT "AssetHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_barcode_key" ON "Asset"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalSpecification_asset_id_key" ON "TechnicalSpecification"("asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cost_asset_id_key" ON "Cost"("asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "ErrorCategory_category_key" ON "ErrorCategory"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Error_code_key" ON "Error"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Part_part_number_key" ON "Part"("part_number");

-- CreateIndex
CREATE UNIQUE INDEX "Transfer_transfer_number_key" ON "Transfer"("transfer_number");

-- CreateIndex
CREATE UNIQUE INDEX "Arrival_arrival_number_key" ON "Arrival"("arrival_number");

-- CreateIndex
CREATE UNIQUE INDEX "Departure_departure_number_key" ON "Departure"("departure_number");

-- CreateIndex
CREATE UNIQUE INDEX "Hold_hold_number_key" ON "Hold"("hold_number");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_city_code_key" ON "Warehouse"("city_code");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Model_name_brand_id_key" ON "Model"("name", "brand_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_account_number_key" ON "Organization"("account_number");

-- CreateIndex
CREATE INDEX "Organization_name_contact_name_primary_email_idx" ON "Organization"("name", "contact_name", "primary_email");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_warehouse_id_asset_location_fkey" FOREIGN KEY ("warehouse_id", "asset_location") REFERENCES "Location"("warehouse_id", "location") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_purchase_invoice_id_fkey" FOREIGN KEY ("purchase_invoice_id") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_sales_invoice_id_fkey" FOREIGN KEY ("sales_invoice_id") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_arrival_id_fkey" FOREIGN KEY ("arrival_id") REFERENCES "Arrival"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_departure_id_fkey" FOREIGN KEY ("departure_id") REFERENCES "Departure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_hold_id_fkey" FOREIGN KEY ("hold_id") REFERENCES "Hold"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalSpecification" ADD CONSTRAINT "TechnicalSpecification_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cost" ADD CONSTRAINT "Cost_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAccessory" ADD CONSTRAINT "AssetAccessory_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ErrorCategory" ADD CONSTRAINT "ErrorCategory_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Error" ADD CONSTRAINT "Error_error_category_id_fkey" FOREIGN KEY ("error_category_id") REFERENCES "ErrorCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetError" ADD CONSTRAINT "AssetError_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetError" ADD CONSTRAINT "AssetError_error_id_fkey" FOREIGN KEY ("error_id") REFERENCES "Error"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetError" ADD CONSTRAINT "AssetError_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetError" ADD CONSTRAINT "AssetError_fixed_by_fkey" FOREIGN KEY ("fixed_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetPart" ADD CONSTRAINT "AssetPart_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetPart" ADD CONSTRAINT "AssetPart_part_id_fkey" FOREIGN KEY ("part_id") REFERENCES "Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetPart" ADD CONSTRAINT "AssetPart_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_origin_id_fkey" FOREIGN KEY ("origin_id") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_transporter_id_fkey" FOREIGN KEY ("transporter_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetTransfer" ADD CONSTRAINT "AssetTransfer_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetTransfer" ADD CONSTRAINT "AssetTransfer_transfer_id_fkey" FOREIGN KEY ("transfer_id") REFERENCES "Transfer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrival" ADD CONSTRAINT "Arrival_origin_id_fkey" FOREIGN KEY ("origin_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrival" ADD CONSTRAINT "Arrival_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrival" ADD CONSTRAINT "Arrival_transporter_id_fkey" FOREIGN KEY ("transporter_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrival" ADD CONSTRAINT "Arrival_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_origin_id_fkey" FOREIGN KEY ("origin_id") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_transporter_id_fkey" FOREIGN KEY ("transporter_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_sales_representative_id_fkey" FOREIGN KEY ("sales_representative_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hold" ADD CONSTRAINT "Hold_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hold" ADD CONSTRAINT "Hold_created_for_id_fkey" FOREIGN KEY ("created_for_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hold" ADD CONSTRAINT "Hold_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetHistory" ADD CONSTRAINT "AssetHistory_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetHistory" ADD CONSTRAINT "AssetHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
