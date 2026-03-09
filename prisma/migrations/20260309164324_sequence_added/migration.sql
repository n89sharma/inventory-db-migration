-- CreateTable
CREATE TABLE "Sequence" (
    "entity_type" TEXT NOT NULL,
    "warehouse_code" TEXT NOT NULL,
    "sequence_date" DATE NOT NULL,
    "last_number" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Sequence_pkey" PRIMARY KEY ("entity_type","warehouse_code","sequence_date")
);
