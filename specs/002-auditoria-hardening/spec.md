# Spec 002 - Auditoria y Hardening Integral

Estado: Propuesta

## Contexto

La auditoria inicial del repo detecto riesgos y drift en cuatro frentes: GitHub/CI, Supabase, Vercel y consistencia visual del frontend.

## Problema

Hoy el repo tiene:

- gates de CI que pueden ocultar fallos
- RPCs y contratos Supabase con validaciones insuficientes o drift frente al frontend
- configuracion de despliegue no totalmente alineada con CI
- sistema visual inconsistente por hojas CSS partidas, tokens no cargados y clases sin soporte real

## Objetivos

- Endurecer la superficie GitHub/CI para que falle cuando debe fallar.
- Corregir riesgos de autorizacion y drift critico en Supabase.
- Alinear Vercel con la fuente de verdad del repo.
- Unificar la base visual para que las paginas activas compartan tokens y layout consistentes.

## No objetivos

- No redisenar la experiencia completa.
- No cambiar narrativa o branding del producto mas alla de consistencia tecnica.
- No introducir infraestructura nueva si basta con endurecer la existente.

## Alcance inicial

- `.github/workflows/*`
- `vercel.json`
- `src/styles/global.css`, `src/index.css`, `src/main.tsx`
- paginas activas en `src/pages/*`
- `src/lib/supabase.ts`
- `supabase/migrations/*`

## Criterios de exito

- CI deja de silenciar fallos de lint.
- La ruta de datos critica no confia en identificadores manipulables desde cliente sin validacion suficiente.
- El preguntometro y los RPCs quedan alineados con el schema versionado.
- Vercel usa el mismo enfoque de instalacion verificado por CI.
- Las paginas activas comparten la misma base de tokens/colores cargada realmente en runtime.
