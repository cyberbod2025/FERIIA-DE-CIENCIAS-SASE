# Research - 002 Auditoria y Hardening Integral

## Fuentes revisadas

- `.github/workflows/build-check.yml`
- `.github/workflows/security-audit.yml`
- `.github/workflows/claude.yml`
- `vercel.json`
- `src/main.tsx`, `src/styles/global.css`, `src/index.css`
- `src/pages/LoginView.tsx`
- `src/pages/TeacherLoginView.tsx`
- `src/pages/MapView.tsx`
- `src/pages/StandDetailView.tsx`
- `src/pages/TriviaView.tsx`
- `src/pages/TeacherPanelView.tsx`
- `src/pages/RankingView.tsx`
- `supabase/migrations/01_init_schema.sql`
- `supabase/migrations/03_multidisciplinary_update.sql`
- `supabase/migrations/05_rpc_progreso.sql`
- `supabase/migrations/06_panel_maestros.sql`
- `supabase/migrations/07_puntos_por_grupo.sql`
- `supabase/migrations/08_feria_performance_hardening.sql`

## Hallazgos verificados

### GitHub

- `build-check.yml` silencia fallos de lint con `|| echo`.
- `security-audit.yml` corre `npm audit` con `continue-on-error: true`.
- No se pudieron auditar branch protection ni required checks porque `gh` no esta autenticado localmente.

### Supabase

- Los RPC `registrar_progreso_v2` y `finalizar_trivia_v2` son `SECURITY DEFINER` y aceptan IDs controlados por el cliente.
- El frontend depende de `student_id` guardado en `localStorage`.
- `preguntometro` define `moderacion_estado`, pero el frontend intenta insertar `estado`.
- `08_feria_performance_hardening.sql` usa `p_student_id` en lugar de `p_estudiante_id`.
- El SQL versionado no muestra policies de escritura para `estudiantes`, aunque el frontend hace `insert` y `update` directos.

### Vercel

- `vercel.json` usa `npm install && npm run build` mientras CI usa `npm ci`.

### Frontend visual

- `src/main.tsx` importa `src/styles/global.css`, no `src/index.css`.
- Muchos tokens usados por paginas activas viven en `src/index.css` y no en la hoja realmente cargada.
- Ademas se usan variables no definidas como `--midnight-light`.
- Login y TeacherLogin usan muchas clases tipo Tailwind, pero no hay Tailwind configurado en el repo.
- Existen clases semanticas en vistas activas sin definicion CSS encontrada.

## Riesgos priorizados

1. Autorizacion y mutacion insegura en Supabase.
2. Drift entre frontend y schema SQL versionado.
3. CI permisiva ante errores reales.
4. Inconsistencia visual estructural por CSS cargado parcialmente.

## Dependencias externas no auditadas

- Branch protection, secrets y environments de GitHub.
- Variables reales y project settings de Vercel.
