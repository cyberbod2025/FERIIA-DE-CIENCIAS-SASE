# AGENTS

## SDD Base
- Antes de cambios materiales, lee `memory/constitution.md`, `memory/feria-de-ciencias-2026-canon.md` y el expediente activo en `specs/`.
- Si docs y config se contradicen, manda config/codigo ejecutable.

## Identity
- Responde en espanol, salvo que el usuario pida otro idioma. `RULES.md` lo marca como obligatorio.
- Usa el nombre completo `FERIA DE CIENCIAS 2026 ESD-310`. `.project-identity.md` marca nombres antiguos como incorrectos.

## Repo Shape
- Este repo es una sola app Vite + React + TypeScript en la raiz, no un monorepo. La fuente de verdad es `package.json` del root.
- Entrypoints reales: `src/main.tsx` monta `src/App.tsx`; el router en `src/App.tsx` lazy-loada las vistas de `src/pages/*`.
- Rutas activas hoy: `/`, `/panel/login`, `/panel`, `/tutorial`, `/mapa`, `/stand/:id`, `/trivia/:id`, `/ranking`.
- Hay archivos en `src/pages/` que no estan conectados al router actual (`IntroView`, `BienvenidaView`, `StandView`). No asumas que toda vista existente esta en uso.
- La integracion cliente con Supabase vive en `src/lib/supabase.ts`.
- `supabase/migrations/*.sql` contiene cambios de BD y RPCs usados por la app; no hay backend Node en este repo.

## Commands
- Instalar dependencias: `npm ci`
- Desarrollo local: `npm run dev`
- URL local oficial: `http://localhost:3100/`
- El puerto `3100` es estricto (`vite.config.ts` usa `strictPort: true`). No asumas `3000`.
- Build/verificacion de tipos: `npm run build` (`tsc -b && vite build`)
- Lint: `npm run lint`
- No existe script de tests ni de typecheck separado. Para verificar cambios, usa `npm run build` y `npm run lint`.

## Verified Workflow Notes
- CI usa Node 20 y corre `npm ci`, luego `npm run build`, luego `npm run lint` en `.github/workflows/build-check.yml`.
- `README.md` es casi puro boilerplate de Vite; no lo tomes como documentacion del producto.
- `netlify.toml` apunta a `web/` y no coincide con la estructura actual del repo. Si hay conflicto, confia en `package.json`, `vite.config.ts`, `vercel.json` y CI.
- `vercel.json` si coincide con la app actual: build Vite en raiz, salida `dist` y rewrite global a `index.html`.
- `.agents/workflows/dev-sase.md` tambien esta desactualizado: menciona puerto 3000, pero el puerto real es 3100.

## Supabase And Security
- La app cliente usa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. `src/lib/supabase.ts` trae una URL por defecto, pero sin anon key solo muestra warning y la app queda incompleta.
- No hardcodees secretos ni tokens en el repo. `RULES.md` y `.github/workflows/security-audit.yml` lo validan.
- No uses `supabase.auth.admin` en `src/`; el workflow de seguridad falla si aparece en codigo cliente.
- Si necesitas aplicar migraciones, revisa primero `supabase/migrations/` y pide aprobacion explicita antes de correr `supabase db push`.

## App Behavior That Is Easy To Break
- El flujo de alumno depende de storage del navegador:
  - `localStorage`: `user_name`, `user_group`, `student_id`
  - `sessionStorage`: `trivia_access_<standId>`
- `StandDetailView` y `TriviaView` usan RPCs `registrar_progreso_v2` y `finalizar_trivia_v2`, con fallback manual si el RPC falla. Si cambias el flujo de check-in o trivia, revisa ambos lados.
- `TeacherPanelView` depende de auth de Supabase y de tablas/vistas `usuarios`, `panel_grupos` y `panel_inactividad`.

## Generated Assets
- `public/qrs/*` y `public/QRs_Feria_Ciencias.pdf` se generan con `scripts/generate_qrs.js`.
- Ese script tiene rutas absolutas hardcodeadas fuera del workspace actual. No lo ejecutes ni lo "arregles" incidentalmente durante otros cambios.

## Scope Guardrails
- Manten la arquitectura actual: `src/` para frontend y `supabase/` para base de datos, como pide `RULES.md`.
- Evita refactors amplios si no son necesarios para el cambio pedido; este repo ya mezcla UI, estado local y llamadas directas a Supabase por vista.
