# Tasks - 002 Auditoria y Hardening Integral

## Phase 1 - GitHub y CI

- [x] Quitar `|| echo` del gate de lint en `.github/workflows/build-check.yml`.
- [x] Decidir y aplicar politica para `npm audit` en `.github/workflows/security-audit.yml`.
- [ ] Documentar huecos no auditados por falta de acceso remoto.

## Phase 2 - Supabase

- [x] Corregir typo `p_student_id` en `08_feria_performance_hardening.sql`.
- [x] Alinear `preguntometro` entre frontend y schema (`moderacion_estado` vs `estado`).
- [x] Diseñar y aplicar hardening de autorizacion para RPCs criticos.
- [ ] Revisar y versionar policies faltantes para operaciones que el frontend ya usa.

## Phase 3 - Vercel

- [x] Cambiar `vercel.json` a un flujo consistente con CI.
- [ ] Verificar env vars requeridas para despliegue funcional.

## Phase 4 - Consistencia visual

- [x] Definir una sola hoja/token base cargada en runtime.
- [x] Resolver variables CSS faltantes.
- [x] Eliminar o reemplazar clases Tailwind no soportadas.
- [ ] Auditar y normalizar paginas activas: Login, TeacherLogin, Tutorial, Mapa, StandDetail, Trivia, Ranking, Panel.

## Phase 5 - Verificacion

- [x] Ejecutar `npm run build`.
- [x] Ejecutar `npm run lint`.
- [ ] Registrar verificacion visual focalizada de paginas activas.
