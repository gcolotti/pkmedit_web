# pkmedit-web

Web frontend for the pkmedit Pokémon save editor. React 19 + Vite + TanStack
Query + Zustand + Tailwind. Talks to a separate backend (see
[`pkmedit_backend`](../pkmedit_backend)) over HTTP.

## Requirements

- Node 20+
- The pkmedit backend running and reachable (default `http://localhost:8080`)

## Setup

```bash
npm install
cp .env.example .env   # adjust VITE_API_BASE if your backend is elsewhere
npm run dev
```

Dev server listens on `http://localhost:5173`.

## Configuration

The API base URL is resolved in this order, first match wins:

1. `?api=<url>` query param (persisted to localStorage)
2. `pkmedit_api_base` in localStorage
3. `VITE_API_BASE` env var (compiled in at build time)
4. `http://localhost:8080`

For GitHub Pages, the app is built by `.github/workflows/deploy-pages.yml`.
The Vite base path is inferred from `GITHUB_REPOSITORY` during Actions builds,
so `gcolotti/pkmedit_web` is published under `/pkmedit_web/`. If you need a
custom base path, set `VITE_BASE_PATH` before running `npm run build`.

## Scripts

| Command                     | What it does                                                  |
| --------------------------- | ------------------------------------------------------------- |
| `npm run dev`               | Vite dev server with HMR                                      |
| `npm run build`             | Type-check (project references) + production build to `dist/` |
| `npm run preview`           | Serve the production build locally                            |
| `npm run type-check`        | `tsc -b` across `tsconfig.app.json` + `tsconfig.node.json`    |
| `npm run lint`              | ESLint with `--max-warnings 0`                                |
| `npm run format`            | Prettier write                                                |
| `npm run audit:item-assets` | Sanity-check item sprite coverage in `public/assets/items/`   |

## Layout

```
src/
├── App.tsx, AppRoutes.tsx, main.tsx
├── components/        — feature UI grouped by domain (pokemon, items, raids, ...)
└── core/
    ├── hooks/         — app-wide hooks (workspace, controller)
    ├── i18n/          — translator + per-domain locale tables
    ├── query/         — TanStack Query client + query-key factory
    ├── services/      — HTTP layer, storage adapters, draft helpers
    ├── state/         — Zustand stores (shell, ui, draft)
    ├── types/         — shared TS types
    └── utils/         — pure helpers (stat calc, legality, formatters, ...)
```

Imports use the `@/*` alias for `src/*`.
