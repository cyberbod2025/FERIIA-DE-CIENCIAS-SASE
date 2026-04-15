# Constitucion SDD del Repositorio

Estado: Activa
Alcance: Todo cambio material en frontend, datos Supabase, CI/CD, seguridad, integraciones y artefactos de automatizacion.

## Proposito

Esta constitucion define la base SDD brownfield para `FERIA DE CIENCIAS 2026 ESD-310`. Su objetivo es reducir deriva entre codigo, migraciones SQL, workflows CI y documentacion operativa.

## Precedencia de fuentes

Cuando haya conflicto, usa este orden:

1. `memory/constitution.md`
2. El expediente activo en `specs/<NNN-slug>/`
3. `memory/feria-de-ciencias-2026-canon.md`
4. `AGENTS.md`
5. Configuracion ejecutable y codigo
6. Documentacion heredada

Si la prosa contradice al codigo o la configuracion ejecutable, manda lo ejecutable.

## Articulo I. Solo reglas verificadas

- Solo se canonizan reglas confirmadas en `package.json`, `vite.config.ts`, `eslint.config.js`, `tsconfig*.json`, `.github/workflows/*`, `src/*` o `supabase/migrations/*`.
- Todo hecho no verificable queda fuera del canon o se marca como riesgo abierto.

## Articulo II. Cambios materiales requieren expediente

- Todo cambio material debe abrir o actualizar un expediente en `specs/<NNN-slug>/`.
- En este repo se considera material cualquier cambio que toque auth, permisos, flujo alumno, flujo de trivia, tablas/vistas/RPCs de Supabase, CI, despliegue o artefactos de agente.

## Articulo III. Seguridad fail-closed

- Ningun secreto, token o credencial real puede persistir en el repo.
- `src/` no puede usar `supabase.auth.admin`.
- Si un cambio toca permisos, auth o acceso a datos, debe documentar como falla en modo cerrado y no solo por UI.

## Articulo IV. Sincronizacion entre capas

- Si un cambio toca `src/` y depende de tablas, vistas, RLS o RPCs en Supabase, el expediente debe registrar ambas capas.
- Ningun cambio de flujo se considera completo si solo vive en frontend o solo en SQL.

## Articulo V. Puertas minimas de verificacion

- La verificacion minima del repo es `npm run build` y `npm run lint`.
- Si el cambio toca zonas no cubiertas por esas puertas, la verificacion adicional debe quedar escrita en el expediente.
- No existe suite de tests automatizados versionada hoy; esa ausencia debe asumirse como hueco, no como aprobacion implicita.

## Articulo VI. Higiene operativa

- No se deben introducir artefactos locales pesados, perfiles de navegador ni respaldos accidentales.
- Los scripts con rutas absolutas o dependencias de entorno externo se tratan como operacion sensible.

## Articulo VII. Deriva documental

- `AGENTS.md` debe permanecer corto y operativo.
- El detalle verificable vive en `memory/feria-de-ciencias-2026-canon.md` y en el expediente activo.
- La documentacion heredada que contradiga config vigente queda deprecada por canon, aunque no se reescriba de inmediato.

## Enmiendas

- Toda enmienda a esta constitucion requiere justificacion explicita en un expediente bajo `specs/`.
