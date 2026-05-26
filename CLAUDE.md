# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server
npm run build        # production build
npm run lint         # ESLint via Next.js
npm test             # run all tests (Vitest)
npx vitest <file>    # run single test file
npm run seed         # seed database via tsx prisma/seed.ts
```

## Tech Stack

- **Next.js 14.2** — App Router, RSC, middleware-based auth
- **TypeScript 5** — strict mode, path alias `@/*`
- **Supabase** — auth (SSR) + PostgreSQL
- **Prisma 6** — ORM with migrations
- **Tailwind CSS + shadcn/ui** — design system via CSS variables
- **Vitest** — unit tests only (no E2E)

## Architecture

### Directory Layout

```
app/
  (public)/          # public pages (kalender, tools, blog)
  (auth)/            # login, register, forgot-password
  admin/             # admin panel (role-protected)
  dashboard/         # user dashboard (auth-protected)
  api/v1/            # public REST API (holidays, calendar, long-weekends)
  api/admin/         # admin-only API (data import)
  api/tools/         # tool APIs (cuti-optimizer, workdays)
lib/
  calendar/          # core business logic (holidays, weton, longweekend)
  api/               # API middleware (auth, rateLimit, middleware)
  supabase/          # server.ts + client.ts Supabase factories
  prisma.ts          # singleton PrismaClient
  blog.ts            # MDX + gray-matter blog parsing
components/
  ui/                # shadcn/ui + Radix primitives
  calendar/          # calendar UI components
  dashboard/         # dashboard UI
  tools/             # tool UIs
prisma/
  schema.prisma      # data model
  migrations/        # migration history
  seed.ts            # seed script
  data/              # seed data files
content/blog/        # MDX blog posts
middleware.ts        # auth/role enforcement for all routes
```

### Auth & Route Protection

`middleware.ts` runs on every request. Route groups map to roles:
- `/admin/*` — requires admin role
- `/dashboard/*` — requires authenticated user
- Public routes pass through

Supabase SSR pattern: server client via `createServerClient` with cookie management; browser client via `createClient`. Middleware syncs session state across requests.

### API Layer Pattern

All `app/api/v1/` routes use a `withApiAuth` wrapper:

```typescript
export const GET = withApiAuth(async (request, ctx) => {
  // ctx = { apiKeyId, userId, rateLimit }
  return apiSuccess(data, { meta });
});
```

`withApiAuth` (in `lib/api/middleware.ts`) handles: Bearer token validation → rate-limit check → handler → log usage to `ApiUsageLog`. Standard response shape: `{ success, data?, error?: { code, message }, meta? }`.

### Data Flow

Client → middleware (session check) → route handler → `withApiAuth` (API key auth + rate limit) → `lib/calendar/` business logic → Prisma → PostgreSQL → response + usage log.

### Rendering Strategy

- **RSC by default** — data fetching on server
- `"use client"` only for interactive components (Navbar, forms, hooks)
- Blog pages use next-mdx-remote + gray-matter for MDX frontmatter

### Calendar Business Logic

Core domain lives in `lib/calendar/`:
- `holidays.ts` — public holiday computation
- `weton.ts` — Javanese calendar calculations (hari, pasaran, neptu)
- `longweekend.ts` — long weekend detection
- `constants.ts` — shared calendar constants

Tests for this logic live alongside: `lib/calendar/weton.test.ts`.
