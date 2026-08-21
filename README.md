# Job Listing — Teamio Prototype

Feature prototype for Teamio **job listing** (výpis náboru). UI components and design tokens come from the sibling [`teamio-prototype-starter`](../teamio-prototype-starter) catalog via a Vite source alias — do not copy components or invent local styles.

---

## English

### Prerequisites

- Node.js 22 (see `.nvmrc`)
- Sibling folder `../teamio-prototype-starter` must exist on disk
- Netlify clones the public catalog into `./teamio-prototype-starter` during build: https://github.com/jammie123/teamio-prototype-starter

### Install and run

```bash
nvm use
npm install
npm run dev        # http://localhost:5173
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite development server |
| `npm run build` | Typecheck + production build |
| `npm run typecheck` | TypeScript project references check |
| `npm run lint` | ESLint |

### How starter is linked

- Vite alias `@teamio/starter` → `../teamio-prototype-starter/src`
- Vite also aliases `react` / `react-dom` to this app’s `node_modules` (avoids duplicate React types)
- `src/main.tsx` imports `@teamio/starter/styles/global.css`
- Tailwind reuses the starter theme (`tm-` prefix) and scans both apps’ `src` for classes

```tsx
import { PageTemplate, Button } from '@teamio/starter/components'
```

### Project structure

```text
src/
  pages/       # route-level screens
  router/      # React Router
  data/        # JSON fixtures (add as needed)
```

New UI components and tokens belong in **teamio-prototype-starter**, not here.

---

## Čeština

### Předpoklady

- Node.js 22 (viz `.nvmrc`)
- Na disku musí existovat sourozenecká složka `../teamio-prototype-starter`
- Netlify při buildu klonuje veřejný katalog do `./teamio-prototype-starter`: https://github.com/jammie123/teamio-prototype-starter

### Instalace a spuštění

```bash
nvm use
npm install
npm run dev        # http://localhost:5173
```

### Napojení na starter

- Vite alias `@teamio/starter` → `../teamio-prototype-starter/src`
- `src/main.tsx` importuje `@teamio/starter/styles/global.css`
- Tailwind bere theme ze starteru (prefix `tm-`) a skenuje `src` obou aplikací

Nové UI komponenty a tokeny patří do **teamio-prototype-starter**, ne sem.
