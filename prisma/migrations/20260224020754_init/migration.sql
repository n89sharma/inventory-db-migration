-- CreateTable
CREATE TABLE "Accessory" (
    "id" SERIAL NOT NULL,
    "accessory" TEXT NOT NULL,

    CONSTRAINT "Accessory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetType" (
    "id" SERIAL NOT NULL,
    "asset_type" TEXT NOT NULL,

    CONSTRAINT "AssetType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingStatus" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "TrackingStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilityStatus" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "AvailabilityStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalStatus" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "TechnicalStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "FileType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "InvoiceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entity" (
    "id" SERIAL NOT NULL,
    "entity" TEXT NOT NULL,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "barcode" VARCHAR(50) NOT NULL,
    "serial_number" VARCHAR(50) NOT NULL,
    "model_id" INTEGER NOT NULL,
    "warehouse_id" INTEGER,
    "asset_location" VARCHAR(50),
    "asset_type_id" INTEGER NOT NULL,
    "tracking_status_id" INTEGER NOT NULL,
    "availability_status_id" INTEGER NOT NULL,
    "technical_status_id" INTEGER NOT NULL,
    "purchase_invoice_id" INTEGER,
    "sales_invoice_id" INTEGER,
    "arrival_id" INTEGER,
    "departure_id" INTEGER,
    "hold_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL,
    "is_held" BOOLEAN NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalSpecification" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "cassettes" INTEGER,
    "internal_finisher" TEXT,
    "meter_black" BIGINT,
    "meter_colour" BIGINT,
    "meter_total" BIGINT,
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
    "purchase_cost" DECIMAL(12,2),
    "transport_cost" DECIMAL(12,2),
    "processing_cost" DECIMAL(12,2),
    "other_cost" DECIMAL(12,2),
    "parts_cost" DECIMAL(12,2),
    "total_cost" DECIMAL(12,2),
    "sale_price" DECIMAL(12,2),

    CONSTRAINT "Cost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetAccessory" (
    "asset_id" INTEGER NOT NULL,
    "accessory_id" INTEGER NOT NULL,

    CONSTRAINT "AssetAccessory_pkey" PRIMARY KEY ("asset_id","accessory_id")
);

-- CreateTable
CREATE TABLE "Error" (
    "id" SERIAL NOT NULL,
    "brand_id" INTEGER NOT NULL,
    "code" VARCHAR(15) NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,

    CONSTRAINT "Error_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetError" (
    "asset_id" INTEGER NOT NULL,
    "error_id" INTEGER NOT NULL,
    "is_fixed" BOOLEAN NOT NULL,
    "added_by" INTEGER,
    "added_at" TIMESTAMP(3),
    "fixed_by" INTEGER,
    "fixed_at" TIMESTAMP(3),

    CONSTRAINT "AssetError_pkey" PRIMARY KEY ("asset_id","error_id")
);

-- CreateTable
CREATE TABLE "Part" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "part_number" VARCHAR(50) NOT NULL,
    "dealer_price" DECIMAL(12,2) NOT NULL,
    "sale_price" DECIMAL(12,2) NOT NULL,
    "cost" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetPart" (
    "id" SERIAL NOT NULL,
    "recipient_asset_id" INTEGER NOT NULL,
    "donor_asset_id" INTEGER,
    "store_part_id" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "AssetPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id" SERIAL NOT NULL,
    "transfer_number" VARCHAR(50) NOT NULL,
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
    "arrival_number" VARCHAR(50) NOT NULL,
    "origin_id" INTEGER NOT NULL,
    "destination_id" INTEGER,
    "transporter_id" INTEGER NOT NULL,
    "created_by_id" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Arrival_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departure" (
    "id" SERIAL NOT NULL,
    "departure_number" VARCHAR(50) NOT NULL,
    "origin_id" INTEGER NOT NULL,
    "destination_id" INTEGER NOT NULL,
    "transporter_id" INTEGER NOT NULL,
    "created_by_id" INTEGER,
    "sales_representative_id" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Departure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hold" (
    "id" SERIAL NOT NULL,
    "hold_number" VARCHAR(50) NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "created_for_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "from_dt" TIMESTAMP(3),
    "to_dt" TIMESTAMP(3),

    CONSTRAINT "Hold_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "is_cleared" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "invoice_type_id" INTEGER NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" SERIAL NOT NULL,
    "city_code" CHAR(3) NOT NULL,
    "street" TEXT NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "warehouse_id" INTEGER NOT NULL,
    "location" VARCHAR(50) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("warehouse_id","location")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "brand_id" INTEGER NOT NULL,
    "asset_type_id" INTEGER NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "uploaded_by_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL,
    "file_type_id" INTEGER NOT NULL,

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
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "googleId" TEXT,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "account_number" VARCHAR(50) NOT NULL,
    "name" TEXT NOT NULL,
    "contact_name" TEXT,
    "phone" TEXT,
    "phone_ext" TEXT,
    "mobile" TEXT,
    "primary_email" TEXT,
    "secondary_email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "province" TEXT,
    "country" TEXT,
    "website" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetHistory" (
    "id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "action_id" INTEGER NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "changed_on" TIMESTAMP(3) NOT NULL,
    "changes" JSONB NOT NULL,

    CONSTRAINT "AssetHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Accessory_accessory_key" ON "Accessory"("accessory");

-- CreateIndex
CREATE UNIQUE INDEX "AssetType_asset_type_key" ON "AssetType"("asset_type");

-- CreateIndex
CREATE UNIQUE INDEX "TrackingStatus_status_key" ON "TrackingStatus"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AvailabilityStatus_status_key" ON "AvailabilityStatus"("status");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalStatus_status_key" ON "TechnicalStatus"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_key" ON "Role"("role");

-- CreateIndex
CREATE UNIQUE INDEX "FileType_type_key" ON "FileType"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Action_action_key" ON "Action"("action");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceType_type_key" ON "InvoiceType"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Entity_entity_key" ON "Entity"("entity");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_barcode_key" ON "Asset"("barcode");

-- CreateIndex
CREATE INDEX "Asset_serial_number_idx" ON "Asset"("serial_number");

-- CreateIndex
CREATE INDEX "Asset_model_id_idx" ON "Asset"("model_id");

-- CreateIndex
CREATE INDEX "Asset_warehouse_id_idx" ON "Asset"("warehouse_id");

-- CreateIndex
CREATE INDEX "Asset_asset_location_idx" ON "Asset"("asset_location");

-- CreateIndex
CREATE INDEX "Asset_asset_type_id_idx" ON "Asset"("asset_type_id");

-- CreateIndex
CREATE INDEX "Asset_tracking_status_id_idx" ON "Asset"("tracking_status_id");

-- CreateIndex
CREATE INDEX "Asset_availability_status_id_idx" ON "Asset"("availability_status_id");

-- CreateIndex
CREATE INDEX "Asset_technical_status_id_idx" ON "Asset"("technical_status_id");

-- CreateIndex
CREATE INDEX "Asset_arrival_id_idx" ON "Asset"("arrival_id");

-- CreateIndex
CREATE INDEX "Asset_departure_id_idx" ON "Asset"("departure_id");

-- CreateIndex
CREATE INDEX "Asset_hold_id_idx" ON "Asset"("hold_id");

-- CreateIndex
CREATE INDEX "Asset_purchase_invoice_id_idx" ON "Asset"("purchase_invoice_id");

-- CreateIndex
CREATE INDEX "Asset_sales_invoice_id_idx" ON "Asset"("sales_invoice_id");

-- CreateIndex
CREATE INDEX "Asset_created_at_idx" ON "Asset"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalSpecification_asset_id_key" ON "TechnicalSpecification"("asset_id");

-- CreateIndex
CREATE INDEX "TechnicalSpecification_meter_black_idx" ON "TechnicalSpecification"("meter_black");

-- CreateIndex
CREATE INDEX "TechnicalSpecification_meter_colour_idx" ON "TechnicalSpecification"("meter_colour");

-- CreateIndex
CREATE INDEX "TechnicalSpecification_meter_total_idx" ON "TechnicalSpecification"("meter_total");

-- CreateIndex
CREATE INDEX "TechnicalSpecification_internal_finisher_idx" ON "TechnicalSpecification"("internal_finisher");

-- CreateIndex
CREATE UNIQUE INDEX "Cost_asset_id_key" ON "Cost"("asset_id");

-- CreateIndex
CREATE INDEX "Cost_purchase_cost_idx" ON "Cost"("purchase_cost");

-- CreateIndex
CREATE INDEX "Cost_transport_cost_idx" ON "Cost"("transport_cost");

-- CreateIndex
CREATE INDEX "Cost_processing_cost_idx" ON "Cost"("processing_cost");

-- CreateIndex
CREATE INDEX "Cost_other_cost_idx" ON "Cost"("other_cost");

-- CreateIndex
CREATE INDEX "Cost_parts_cost_idx" ON "Cost"("parts_cost");

-- CreateIndex
CREATE INDEX "Cost_total_cost_idx" ON "Cost"("total_cost");

-- CreateIndex
CREATE INDEX "Cost_sale_price_idx" ON "Cost"("sale_price");

-- CreateIndex
CREATE INDEX "Error_code_idx" ON "Error"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Error_brand_id_code_key" ON "Error"("brand_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Part_part_number_key" ON "Part"("part_number");

-- CreateIndex
CREATE UNIQUE INDEX "AssetPart_recipient_asset_id_donor_asset_id_store_part_id_key" ON "AssetPart"("recipient_asset_id", "donor_asset_id", "store_part_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transfer_transfer_number_key" ON "Transfer"("transfer_number");

-- CreateIndex
CREATE INDEX "Transfer_created_at_idx" ON "Transfer"("created_at" DESC);

-- CreateIndex
CREATE INDEX "Transfer_origin_id_destination_id_idx" ON "Transfer"("origin_id", "destination_id");

-- CreateIndex
CREATE INDEX "Transfer_destination_id_idx" ON "Transfer"("destination_id");

-- CreateIndex
CREATE INDEX "Transfer_transporter_id_idx" ON "Transfer"("transporter_id");

-- CreateIndex
CREATE UNIQUE INDEX "Arrival_arrival_number_key" ON "Arrival"("arrival_number");

-- CreateIndex
CREATE INDEX "Arrival_destination_id_created_at_idx" ON "Arrival"("destination_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "Arrival_created_at_idx" ON "Arrival"("created_at" DESC);

-- CreateIndex
CREATE INDEX "Arrival_origin_id_idx" ON "Arrival"("origin_id");

-- CreateIndex
CREATE INDEX "Arrival_destination_id_idx" ON "Arrival"("destination_id");

-- CreateIndex
CREATE INDEX "Arrival_transporter_id_idx" ON "Arrival"("transporter_id");

-- CreateIndex
CREATE UNIQUE INDEX "Departure_departure_number_key" ON "Departure"("departure_number");

-- CreateIndex
CREATE INDEX "Departure_origin_id_created_at_idx" ON "Departure"("origin_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "Departure_created_at_idx" ON "Departure"("created_at" DESC);

-- CreateIndex
CREATE INDEX "Departure_origin_id_idx" ON "Departure"("origin_id");

-- CreateIndex
CREATE INDEX "Departure_destination_id_idx" ON "Departure"("destination_id");

-- CreateIndex
CREATE INDEX "Departure_transporter_id_idx" ON "Departure"("transporter_id");

-- CreateIndex
CREATE UNIQUE INDEX "Hold_hold_number_key" ON "Hold"("hold_number");

-- CreateIndex
CREATE INDEX "Hold_created_at_idx" ON "Hold"("created_at" DESC);

-- CreateIndex
CREATE INDEX "Hold_created_for_id_customer_id_idx" ON "Hold"("created_for_id", "customer_id");

-- CreateIndex
CREATE INDEX "Hold_created_by_id_idx" ON "Hold"("created_by_id");

-- CreateIndex
CREATE INDEX "Hold_customer_id_idx" ON "Hold"("customer_id");

-- CreateIndex
CREATE INDEX "Hold_from_dt_idx" ON "Hold"("from_dt");

-- CreateIndex
CREATE INDEX "Hold_to_dt_idx" ON "Hold"("to_dt");

-- CreateIndex
CREATE INDEX "Invoice_created_at_idx" ON "Invoice"("created_at" DESC);

-- CreateIndex
CREATE INDEX "Invoice_invoice_type_id_idx" ON "Invoice"("invoice_type_id");

-- CreateIndex
CREATE INDEX "Invoice_invoice_number_idx" ON "Invoice"("invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_organization_id_invoice_number_key" ON "Invoice"("organization_id", "invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_city_code_street_key" ON "Warehouse"("city_code", "street");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE INDEX "Model_name_idx" ON "Model"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Model_brand_id_name_key" ON "Model"("brand_id", "name");

-- CreateIndex
CREATE INDEX "File_asset_id_uploaded_at_idx" ON "File"("asset_id", "uploaded_at" DESC);

-- CreateIndex
CREATE INDEX "File_uploaded_by_id_idx" ON "File"("uploaded_by_id");

-- CreateIndex
CREATE INDEX "File_name_idx" ON "File"("name");

-- CreateIndex
CREATE INDEX "Comment_asset_id_created_at_idx" ON "Comment"("asset_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "Comment_created_by_id_idx" ON "Comment"("created_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_account_number_key" ON "Organization"("account_number");

-- CreateIndex
CREATE INDEX "Organization_name_idx" ON "Organization"("name");

-- CreateIndex
CREATE INDEX "AssetHistory_asset_id_changed_on_idx" ON "AssetHistory"("asset_id", "changed_on" DESC);

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_warehouse_id_asset_location_fkey" FOREIGN KEY ("warehouse_id", "asset_location") REFERENCES "Location"("warehouse_id", "location") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_asset_type_id_fkey" FOREIGN KEY ("asset_type_id") REFERENCES "AssetType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_tracking_status_id_fkey" FOREIGN KEY ("tracking_status_id") REFERENCES "TrackingStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_availability_status_id_fkey" FOREIGN KEY ("availability_status_id") REFERENCES "AvailabilityStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_technical_status_id_fkey" FOREIGN KEY ("technical_status_id") REFERENCES "TechnicalStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalSpecification" ADD CONSTRAINT "TechnicalSpecification_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cost" ADD CONSTRAINT "Cost_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAccessory" ADD CONSTRAINT "AssetAccessory_accessory_id_fkey" FOREIGN KEY ("accessory_id") REFERENCES "Accessory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAccessory" ADD CONSTRAINT "AssetAccessory_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Error" ADD CONSTRAINT "Error_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetError" ADD CONSTRAINT "AssetError_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetError" ADD CONSTRAINT "AssetError_error_id_fkey" FOREIGN KEY ("error_id") REFERENCES "Error"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetError" ADD CONSTRAINT "AssetError_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetError" ADD CONSTRAINT "AssetError_fixed_by_fkey" FOREIGN KEY ("fixed_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetPart" ADD CONSTRAINT "AssetPart_recipient_asset_id_fkey" FOREIGN KEY ("recipient_asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetPart" ADD CONSTRAINT "AssetPart_donor_asset_id_fkey" FOREIGN KEY ("donor_asset_id") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetPart" ADD CONSTRAINT "AssetPart_store_part_id_fkey" FOREIGN KEY ("store_part_id") REFERENCES "Part"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "Arrival" ADD CONSTRAINT "Arrival_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrival" ADD CONSTRAINT "Arrival_transporter_id_fkey" FOREIGN KEY ("transporter_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrival" ADD CONSTRAINT "Arrival_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_origin_id_fkey" FOREIGN KEY ("origin_id") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_transporter_id_fkey" FOREIGN KEY ("transporter_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_sales_representative_id_fkey" FOREIGN KEY ("sales_representative_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hold" ADD CONSTRAINT "Hold_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hold" ADD CONSTRAINT "Hold_created_for_id_fkey" FOREIGN KEY ("created_for_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hold" ADD CONSTRAINT "Hold_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_invoice_type_id_fkey" FOREIGN KEY ("invoice_type_id") REFERENCES "InvoiceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_asset_type_id_fkey" FOREIGN KEY ("asset_type_id") REFERENCES "AssetType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_file_type_id_fkey" FOREIGN KEY ("file_type_id") REFERENCES "FileType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetHistory" ADD CONSTRAINT "AssetHistory_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetHistory" ADD CONSTRAINT "AssetHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetHistory" ADD CONSTRAINT "AssetHistory_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetHistory" ADD CONSTRAINT "AssetHistory_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
