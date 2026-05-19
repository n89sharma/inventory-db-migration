  CREATE SEQUENCE IF NOT EXISTS seq_asset START 1;
  CREATE SEQUENCE IF NOT EXISTS seq_arrival   START 1;
  CREATE SEQUENCE IF NOT EXISTS seq_departure START 1;
  CREATE SEQUENCE IF NOT EXISTS seq_transfer  START 1;
  CREATE SEQUENCE IF NOT EXISTS seq_hold      START 1;
  CREATE SEQUENCE IF NOT EXISTS seq_invoice   START 1;

  CREATE EXTENSION IF NOT EXISTS pg_trgm;
  ALTER TABLE "Asset"
    ADD COLUMN barcode_normalized TEXT GENERATED ALWAYS AS
      (lower(regexp_replace(barcode, '[^a-zA-Z0-9]', '', 'g'))) STORED,
    ADD COLUMN serial_normalized TEXT GENERATED ALWAYS AS
      (lower(regexp_replace(serial_number, '[^a-zA-Z0-9]', '', 'g'))) STORED;
  CREATE INDEX idx_asset_barcode_norm_trgm ON "Asset" USING GIN (barcode_normalized gin_trgm_ops);
  CREATE INDEX idx_asset_serial_norm_trgm  ON "Asset" USING GIN (serial_normalized  gin_trgm_ops);