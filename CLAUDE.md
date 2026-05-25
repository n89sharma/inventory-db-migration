# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

One-shot migration tool that pulls data from a legacy MySQL inventory database and writes it into a new PostgreSQL schema managed by Prisma. It is not a long-running service — `npm start` runs `main()` in `src/index.ts` end-to-end and exits.

## Commands

- `npm run build` — `prisma generate` then `tsc` (compile to `dist/`). Run this after any change to `prisma/schema.prisma` so the generated client in `generated/prisma/` is fresh.
- `npm run compile` — `tsc` only (skip Prisma client regeneration).
- `npm start` — run the compiled migration (`node dist/src/index.js`).
- `npm run bs` — build + start in one shot. This is the normal development loop.
- `npm run dbreset` — `prisma migrate reset -f`. Drops the target Postgres database and reapplies all migrations. Use before re-running the migration, since `src/index.ts` only does inserts and assumes an empty schema.
- `npx prisma migrate dev --name <name>` — create a new migration after editing `schema.prisma`.

There are no tests (`npm test` is a stub).

## Environment

`.env` (loaded by `dotenv` in `src/prisma.ts` and `prisma.config.ts`) must define:
- `DATABASE_URL` — Postgres connection string (target).
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB`, `DB_PORT` — legacy MySQL source (read in `src/index.ts`).

Node ≥ 22.16, npm ≥ 10.9. TypeScript is ESM + NodeNext — all relative imports use `.js` extensions even from `.ts` sources.

## Architecture

### Execution pipeline (`src/index.ts`)

Data is inserted in a fixed dependency order. Earlier phases produce id-lookup maps that later phases consume; reordering will break foreign-key resolution.

1. `createReferenceData` (`src/core/referenceData.ts`) — seeds enum-like tables (Status, Readiness, AssetType, Accessory, FileType, InvoiceType, Zone, Country) plus users. Also exports `get*IdMap` helpers that translate legacy MySQL string values to new Postgres ids (e.g. legacy `'For parts'` → `HARVESTED.id`). These mappings are the canonical place to handle legacy-vocabulary drift.
2. `firstHalf` — brands → models → warehouses → locations → parts → organizations → errors → arrivals → departures → transfers → holds → invoices.
3. `secondHalf` — assets → tech specs → costs → comments → asset-accessories → asset-errors → asset-transfers → asset-parts.

### Per-entity module shape

Each file under `src/core/`, `src/transfers/`, `src/assets/`, `src/relationships/` follows the same pattern:

- A MySQL `SELECT` against the legacy schema.
- A `RowDataPacket` interface for the row shape.
- A mapper from row → Prisma `*UncheckedCreateInput`. The mapper looks up foreign-key ids via maps fetched from already-inserted Postgres tables (e.g. `getBrandMap`, `getModelMap`, `getStatusIdMap`).
- An exported `create*Entities(prisma, con)` that calls `createManyEntities` (`src/utils/utils.ts`) — a thin generic wrapper around `con.query` + `prisma.*.createMany`.
- An exported `get*Map` for use by downstream modules.

When adding a new entity migration, follow this shape and slot the `create*` call into `src/index.ts` at the correct dependency position.

### Prisma client

Generated to `generated/prisma/` (see `schema.prisma` generator block) — **not** `node_modules`. Imports look like `from '../../generated/prisma/client.js'`. `src/prisma.ts` wires the Postgres adapter (`@prisma/adapter-pg`) used everywhere.

### Asset chunking

Asset queries (`src/assets/asset.ts`) take `floor`/`ceiling` parameters because the legacy `inventory` table is large; the migration walks it in id ranges rather than loading it all at once.
