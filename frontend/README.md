# EduDesk — Frontend

Next.js 16 App Router frontend for EduDesk, a mobile-first teacher administrative platform for Grades 0–6.

---

## Tech Stack

| Concern          | Choice                      |
|------------------|-----------------------------|
| Framework        | Next.js 16 (App Router)     |
| Language         | TypeScript                  |
| Styling          | Tailwind CSS v4 + shadcn/ui |
| State management | Zustand                     |
| HTTP client      | Axios                       |
| Package manager  | pnpm                        |

---

## Quick Start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Frontend runs on `http://localhost:5000`. Backend must be running on port 3000 — see `../backend/README.md`.

---

## Project Structure

```
src/
├── app/                    # Next.js pages (App Router)
│   ├── (auth)/             # Login, forgot-password — no sidebar
│   ├── (super-admin)/      # Super Admin pages — role-protected
│   ├── (manager)/          # Manager pages — role-protected
│   ├── (staff)/            # Staff pages — role-protected
│   └── not-authorized/     # Shown on role mismatch
│
├── components/
│   ├── ui/                 # shadcn/ui wrappers (Button, Input, Modal…)
│   ├── layout/             # AppSidebar, DashboardHeader, RoleLayout
│   └── shared/             # Loading, EmptyState, Pagination, SearchInput…
│
├── features/               # Feature slices — co-located types, service, store, components
│   ├── auth/
│   ├── canteens/
│   ├── products/
│   └── …
│
├── hooks/                  # Shared hooks (useDebounce, usePagination, useAuth, useRole)
├── lib/                    # Infrastructure (Axios instance, cookies, storage, permissions)
├── config/                 # App constants (roles, routes, sidebar nav)
├── utils/                  # Pure functions (cn, formatCurrency, formatDate)
└── types/                  # Shared TypeScript types (ApiResponse, PaginatedResponse)
```

---

## Layer Communication

```
Page  (app/...)
  │  reads state, calls actions
  ▼
Feature Store  (features/.../store/*.store.ts)    [Zustand]
  │  calls service on action
  ▼
Feature Service  (features/.../services/*.service.ts)
  │  HTTP request
  ▼
lib/api.ts                                        [Axios instance + interceptors]
  │  rewritten by next.config.ts → src/proxy.ts
  ▼
NestJS Backend  →  http://localhost:3000/api/v1
```

**Rules:**
- Pages interact with stores only — never services directly.
- Stores own domain state (`data`, `isLoading`, `error`) and call services on actions.
- Services are stateless async functions — pure HTTP wrappers around `lib/api`.
- `lib/api.ts` is the single Axios instance. All services import it. JWT attachment and 401 redirect live here.

---

## Route → Role Mapping

| URL prefix                   | Role          | Protected by        |
|------------------------------|---------------|---------------------|
| `/login`, `/forgot-password` | Public        | —                   |
| `/super-admin/*`             | `super_admin` | `src/middleware.ts` |
| `/manager/*`                 | `manager`     | `src/middleware.ts` |
| `/staff/*`                   | `staff`       | `src/middleware.ts` |

`middleware.ts` reads the `access_token` cookie, decodes the role claim, and redirects to `/not-authorized` if the role doesn't match.

---

## How to Add a New Feature

1. `src/features/<name>/types/<name>.type.ts` — define domain types.
2. `src/features/<name>/services/<name>.service.ts` — HTTP calls via `lib/api`.
3. `src/features/<name>/store/<name>.store.ts` — Zustand store (state + actions).
4. `src/features/<name>/components/` — UI components that read from the store.
5. Wire the page in `src/app/(role)/<role>/<name>/page.tsx`.

---

## Environment Variables

| Variable               | Side        | Description                                                        |
|------------------------|-------------|--------------------------------------------------------------------|
| `BACKEND_URL`          | Server-only | NestJS base URL for proxy rewrites (default: `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_NAME` | Client      | App display name shown in sidebar                                  |
