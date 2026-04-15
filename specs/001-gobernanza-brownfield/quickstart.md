# Quickstart - SDD Brownfield

## 1. Lectura minima antes de tocar codigo

Lee en este orden:

1. `AGENTS.md`
2. `memory/constitution.md`
3. `memory/feria-de-ciencias-2026-canon.md`
4. El expediente activo en `specs/<NNN-slug>/`

## 2. Cuando abrir un expediente nuevo

Abre un expediente nuevo en `specs/` si el cambio toca:

- auth o permisos
- datos Supabase, migraciones, vistas o RPCs
- flujos de alumno o panel maestro
- CI/CD, despliegue o seguridad
- artefactos de agente o scripts operativamente sensibles
- arquitectura, rutas activas o boundaries del repo

## 3. Estructura minima del expediente

- `spec.md`
- `research.md`
- `plan.md`
- `tasks.md`
- `quickstart.md`

## 4. Orden recomendado del flujo

1. Definir problema y alcance en `spec.md`.
2. Verificar fuentes reales del repo en `research.md`.
3. Traducir a plan tecnico en `plan.md`.
4. Desglosar en tareas en `tasks.md`.
5. Implementar y validar.
6. Actualizar canon o constitucion si cambia una regla vigente.

## 5. Verificacion minima actual

1. `npm ci`
2. `npm run build`
3. `npm run lint`

## 6. Regla de precedencia

1. `memory/constitution.md`
2. El expediente activo en `specs/`
3. `memory/feria-de-ciencias-2026-canon.md`
4. `AGENTS.md`
5. Codigo y configuracion ejecutable
6. Docs heredadas
