# X-MAS — separating from the beauty store

This folder and the copied beauty-store folder were cloned from the same base, so
they originally shared **one Medusa backend** (same DB, Redis, Meili, ports, keys).
This project has now been rewired to be a fully independent store.

## What is different in X-MAS (local)

| Concern | Beauty store (original) | X-MAS (this folder) |
|---|---|---|
| Postgres | `vexo_store` on **:5433** | **`xmas_store` on :5434** |
| Redis logical DB | `redis://…:6379` (0) | **`…:6379/1`** |
| MeiliSearch | `products` on **:7700** | **`xmas_products` on :7701**, own master key |
| Medusa port | 9000 | **9001** |
| Web port | 3000 | **3002** |
| Express API port | 4000 | **4001** |
| Publishable key / region | vexo_store's | **new — created when you seed `xmas_store`** |

Files changed: `medusa-backend/apps/backend/.env`, `medusa-config.ts` (index UID),
`web/.env.local`, `web/lib/medusa.ts` (index UID), `web/package.json`,
`api/.env`, root `package.json`.

> ⚠️ Never run `seed-naran.ts` against `vexo_store` — it deletes the beauty
> catalog. This project points at `xmas_store`, so it's safe here.

## First-time setup (local)

Postgres (:5434) + Redis (:6379) must be running, then from the project root:

```bash
bash scripts/setup-xmas.sh
```

It creates `xmas_store`, migrates, seeds the sneaker catalog, and prints the new
**publishable key** and **region id**. Paste them into:
- `web/.env.local` → `NEXT_PUBLIC_MEDUSA_PK`, `NEXT_PUBLIC_MEDUSA_REGION`
- `api/.env` → `MEDUSA_PK`

## Run (both stores can now run at once)

```bash
# Medusa admin/API on :9001
cd medusa-backend && npm run backend:dev
# Express :4001 + Next web :3002
npm run dev
```
Open http://localhost:3002 · admin at http://localhost:9001/app

## Production (deploy)

Create a **separate Railway project** for X-MAS (see [DEPLOY-RAILWAY.md](DEPLOY-RAILWAY.md)).
Railway provisions its own Postgres + Redis for that project, so production is
isolated automatically — just set the same env vars there:
- `DATABASE_URL`, `REDIS_URL` → provided by the new Railway project
- `MEILI_INDEX=xmas_products`
- `NEXT_PUBLIC_MEDUSA_URL`, `NEXT_PUBLIC_MEDUSA_PK`, `NEXT_PUBLIC_MEDUSA_REGION` → the new deployment's values
- `STORE_CORS` / `ADMIN_CORS` / `AUTH_CORS` → the X-MAS domain (e.g. `https://xmas.mn`)
- fresh `JWT_SECRET` / `COOKIE_SECRET`
- Botxon/QPay: use X-MAS's own merchant credentials and point its webhook at the X-MAS API.

## MeiliSearch (X-MAS's own instance)

The beauty store runs MeiliSearch on :7700. X-MAS has its own on **:7701** with its
own master key, so neither store can read or write the other's index:

```bash
meilisearch --http-addr 127.0.0.1:7701 --master-key "$(grep '^MEILISEARCH_API_KEY=' medusa-backend/apps/backend/.env | cut -d= -f2)"
```

Medusa boots fine without it — the search plugin just stays disabled.
