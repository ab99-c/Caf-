# Qahwati — Full-Stack MVP Architecture

## Product boundary
The homepage is the real customer MVP: discover cafes → open menu → add products → checkout → order tracking. Enterprise engineering is the implementation discipline, not a replacement for the product UI.

## Layers

```text
Customer Web / Expo Mobile
        ↓
Next.js routes / Versioned REST API
        ↓
Auth + RBAC + Zod validation
        ↓
Services (business rules)
        ↓
Repositories (data access boundary)
        ↓
Prisma ORM
        ↓
PostgreSQL
```

## Folder responsibilities

- `app/` — routes, layouts and API endpoints
- `components/` — reusable UI and feature presentation
- `features/` — domain-oriented frontend logic
- `server/services/` — business rules and use cases
- `server/repositories/` — database access boundaries
- `server/validators/` — request validation with Zod
- `lib/` — shared infrastructure such as database and auth
- `prisma/` — schema and seed data
- `mobile/` — Expo client consuming the same backend contracts
- `tests/` — automated quality gates
- `.github/workflows/` — CI/CD automation

## MVP now

The customer flow is intentionally simple and mobile-first. Demo data is used until production credentials/database are configured.

## Production path

1. Real authentication and session handling
2. Connect cafe/menu reads to PostgreSQL
3. Persist orders through `server/services/orderService.ts`
4. Enforce tenant ownership and RBAC on every staff/admin endpoint
5. Add payment provider behind a server-side adapter
6. Add automated tests, logging, metrics and backups
7. Deploy through Vercel with `main` as production branch
