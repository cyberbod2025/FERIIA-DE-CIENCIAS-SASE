# Research - 001 Gobernanza SDD Brownfield

## Fuentes revisadas

- `AGENTS.md`
- `README.md`
- `package.json`, `package-lock.json`
- `vite.config.ts`, `eslint.config.js`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `.github/workflows/build-check.yml`, `.github/workflows/security-audit.yml`, `.github/workflows/claude.yml`
- `vercel.json`, `netlify.toml`
- `RULES.md`, `.project-identity.md`, `.agents/workflows/*.md`
- `src/main.tsx`, `src/App.tsx`, `src/lib/supabase.ts`
- `src/pages/LoginView.tsx`, `MapView.tsx`, `StandDetailView.tsx`, `TriviaView.tsx`, `TeacherLoginView.tsx`, `TeacherPanelView.tsx`, `RankingView.tsx`

## Hallazgos verificados

- El repo activo es una sola app Vite + React + TypeScript en la raiz.
- El puerto correcto es `3100`, estricto.
- No existen tests automatizados versionados ni formatter dedicado.
- CI valida `npm ci`, luego `npm run build`, luego `npm run lint` sobre Node 20.
- La capa de datos real es Supabase desde cliente; no hay backend Node en este repo.
- El flujo alumno depende de claves concretas en `localStorage` y `sessionStorage`.
- Los flujos de check-in y trivia dependen de RPCs `registrar_progreso_v2` y `finalizar_trivia_v2`, con fallback manual.
- El panel maestro depende de auth Supabase y de tablas/vistas adicionales.

## Conflictos documentales detectados

- `README.md` no describe el producto ni la operacion real.
- `.agents/workflows/dev-sase.md` indica puerto `3000`.
- `netlify.toml` apunta a `web/`, pero la app real vive en la raiz.

## Huecos y riesgos abiertos

- La ausencia de tests deja fuera de cobertura automatizada los flujos criticos de alumno, trivia y panel.
- La app depende de contratos SQL y RPCs, pero no hay artefactos tipados compartidos entre frontend y base.
- Existe un script de generacion con rutas absolutas que puede inducir errores operativos si se ejecuta sin contexto.

## Decision de adopcion

- Adopcion brownfield e incremental.
- Se crea gobierno canonico encima del estado actual, sin reescribir la app.
