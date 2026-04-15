# Quickstart - 002 Auditoria y Hardening Integral

## Lectura minima

1. `memory/constitution.md`
2. `memory/feria-de-ciencias-2026-canon.md`
3. `specs/002-auditoria-hardening/*`
4. archivos fuente auditados en `.github/`, `src/`, `supabase/`, `vercel.json`

## Verificacion minima

1. `npm ci`
2. `npm run build`
3. `npm run lint`

## Recorrido visual recomendado

1. `/`
2. `/panel/login`
3. `/tutorial`
4. `/mapa`
5. `/stand/:id`
6. `/trivia/:id`
7. `/ranking`
8. `/panel`

## Regla operativa

- No mezclar correcciones visuales con hardening de auth/RPC en el mismo cambio si dificulta validar riesgos.
