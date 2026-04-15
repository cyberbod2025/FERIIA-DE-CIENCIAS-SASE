# Canon Brownfield del Repositorio

Estado: Canonico
Objetivo: concentrar reglas verificadas del repo para futuros cambios sin mezclar dominio del producto con metodologia.

## Fuentes verificadas

- `AGENTS.md`
- `package.json`, `package-lock.json`
- `vite.config.ts`, `eslint.config.js`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `.github/workflows/build-check.yml`, `.github/workflows/security-audit.yml`, `.github/workflows/claude.yml`
- `src/main.tsx`, `src/App.tsx`, `src/lib/supabase.ts`
- vistas activas en `src/pages/*`
- `supabase/migrations/*`
- `vercel.json`, `netlify.toml`

## 1. Limites reales del repo

- La app activa es una sola SPA Vite + React + TypeScript en la raiz del repo.
- No hay monorepo ni paquete `web/` activo; `netlify.toml` esta desalineado con la estructura real.
- `src/` contiene frontend. `supabase/` contiene migraciones SQL y datos auxiliares. No hay backend Node propio.

## 2. Arquitectura verificada

- `src/main.tsx` monta `src/App.tsx`.
- `src/App.tsx` define el router real con lazy loading.
- Rutas activas verificadas: `/`, `/panel/login`, `/panel`, `/tutorial`, `/mapa`, `/stand/:id`, `/trivia/:id`, `/ranking`.
- Existen vistas no conectadas al router actual: `src/pages/IntroView.tsx`, `src/pages/BienvenidaView.tsx`, `src/pages/StandView.tsx`.
- El cliente Supabase vive en `src/lib/supabase.ts` y depende de `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`; sin anon key la app solo muestra warning y queda incompleta.

## 3. Estado, datos y contratos fragiles

- El flujo alumno depende de:
  - `localStorage`: `user_name`, `user_group`, `student_id`
  - `sessionStorage`: `trivia_access_<standId>`
- `LoginView` registra o actualiza `estudiantes`.
- `MapView` lee `estaciones` y `progreso_recorrido`, y abre un canal realtime sobre `estaciones`.
- `StandDetailView` usa RPC `registrar_progreso_v2` con fallback manual a `progreso_recorrido`, y escribe en `preguntometro`.
- `TriviaView` usa RPC `finalizar_trivia_v2` con fallback manual a `progreso_recorrido`.
- `TeacherPanelView` depende de auth Supabase y de `usuarios`, `panel_grupos` y `panel_inactividad`.
- `RankingView` consulta `estudiantes`.

## 4. Build y verificacion

- Instalar dependencias: `npm ci`
- Desarrollo local: `npm run dev`
- URL local oficial: `http://localhost:3100/`
- `vite.config.ts` fija `port: 3100` y `strictPort: true`.
- Build y verificacion de tipos: `npm run build` ejecuta `tsc -b && vite build`.
- Lint: `npm run lint`
- No hay script de tests, formatter ni typecheck separado versionados en el repo.
- La cadena minima de verificacion local y CI es: `npm ci` -> `npm run build` -> `npm run lint`.

## 5. Seguridad y limites sensibles

- `.github/workflows/security-audit.yml` escanea secretos y falla si aparece `supabase.auth.admin` dentro de `src/`.
- `RULES.md` exige no subir secretos ni artefactos locales accidentales.
- `scripts/generate_qrs.js` usa rutas absolutas fuera del workspace y una URL hospedada hardcodeada; no debe tocarse incidentalmente durante otros cambios.
- `public/qrs/*` y `public/QRs_Feria_Ciencias.pdf` son artefactos generados.

## 6. Workflows y despliegue

- `.github/workflows/build-check.yml` corre con Node 20.
- `vercel.json` coincide con la app actual: build en raiz, salida `dist`, rewrite global a `index.html`.
- `netlify.toml` no coincide con la estructura actual y queda deprecado como fuente operativa.

## 7. Documentacion heredada deprecada por canon

- `README.md`: boilerplate de Vite, no documenta el producto real.
- `.agents/workflows/dev-sase.md`: puerto incorrecto `3000`.
- `netlify.toml`: asume una carpeta `web/` inexistente.
- Los documentos narrativos de producto pueden servir de contexto, pero no mandan sobre config, codigo ni canon.

## 8. Regla de cambio futuro

- Antes de cambiar auth, permisos, migraciones, RPCs, flujos de alumno/maestro, CI, despliegue o artefactos de automatizacion, abre un expediente nuevo en `specs/`.
