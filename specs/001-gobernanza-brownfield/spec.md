# Spec 001 - Gobernanza SDD Brownfield

Estado: Aprobada

## Contexto

Este repo ya opera como una app brownfield con frontend Vite/React y una capa de datos en Supabase. Existian reglas dispersas en config, workflows y documentos heredados, pero no una base SDD local y verificable.

## Problema

Hoy faltaba una autoridad documental unica para responder:

- que documento manda cuando hay conflicto
- que reglas del repo ya estan verificadas
- cuando un cambio futuro debe abrir expediente antes de implementarse

## Objetivos

- Crear una constitucion local con precedencia explicita.
- Crear un canon brownfield local atado a fuentes ejecutables del repo.
- Abrir `specs/001-gobernanza-brownfield/` como patron de trabajo.
- Deprecar por canon las docs heredadas que contradicen el estado real.

## No objetivos

- No implementar features nuevas.
- No mover arquitectura ni refactorizar la app.
- No copiar reglas de negocio o narrativa del producto al gobierno SDD.

## Requisitos funcionales

- Debe existir `memory/constitution.md`.
- Debe existir `memory/feria-de-ciencias-2026-canon.md`.
- Debe existir este expediente con `spec.md`, `research.md`, `plan.md`, `tasks.md`, `quickstart.md`.
- `AGENTS.md` debe enlazar la nueva base SDD.

## Criterios de exito

- Existe una precedencia documental explicita.
- Las reglas del repo quedan trazadas a archivos verificables.
- Futuros cambios materiales tienen un punto claro de entrada antes de tocar codigo.
