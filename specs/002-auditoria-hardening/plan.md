# Plan - 002 Auditoria y Hardening Integral

## Resumen

Corregir primero riesgos que afectan seguridad y confiabilidad, luego cerrar drift de despliegue y consistencia visual.

## Fase 1. GitHub y CI

- Quitar patrones que silencian fallos reales.
- Revisar si `npm audit` debe pasar a gate estricto o quedar separado como reporte.
- Documentar huecos fuera del repo: branch protection y required checks.

## Fase 2. Supabase

- Corregir typo en RPC versionado.
- Alinear `preguntometro` entre frontend y SQL.
- Definir estrategia de autorizacion para alumnos: no confiar solo en `student_id` de cliente.
- Versionar cualquier policy faltante que hoy el frontend necesite para operar.

## Fase 3. Vercel

- Alinear `vercel.json` con el modo de instalacion validado por CI.
- Verificar si faltan env vars requeridas en despliegue.

## Fase 4. Consistencia visual

- Unificar fuente real de tokens CSS.
- Eliminar dependencia en clases no soportadas o cargar el sistema que las soporte.
- Normalizar colores, fondos, bordes y controles en paginas activas.

## Orden recomendado de implementacion

1. Supabase critico
2. GitHub/CI
3. CSS base y tokens
4. limpieza visual de paginas
5. Vercel final
