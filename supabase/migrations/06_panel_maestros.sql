-- Panel de maestros/direccion con acceso seguro y vistas de analitica

-- 1. Asegurar columna grupo en estudiantes (usada por el panel)
ALTER TABLE public.estudiantes ADD COLUMN IF NOT EXISTS grupo TEXT;

-- 2. Tabla de usuarios con roles de staff (maestro/direccion)
CREATE TABLE IF NOT EXISTS public.usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  nombre TEXT,
  rol TEXT NOT NULL CHECK (rol IN ('maestro', 'direccion')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Solo el usuario puede leer su propio perfil
CREATE POLICY IF NOT EXISTS "Usuarios pueden leer su perfil" ON public.usuarios
FOR SELECT USING (auth.uid() = id);

-- 3. Funcion helper para validar staff
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE id = auth.uid() AND rol IN ('maestro', 'direccion')
  );
$$;

-- 4. Politica para lectura de progreso solo para staff
CREATE POLICY IF NOT EXISTS "Staff puede leer progreso" ON public.progreso_recorrido
FOR SELECT USING (public.is_staff());

-- 5. Vistas para el panel
CREATE OR REPLACE VIEW public.panel_grupos AS
SELECT
  e.grupo,
  COUNT(pr.*) AS total_checkins,
  COALESCE(SUM(CASE WHEN pr.trivia_respondida_correctamente THEN 1 ELSE 0 END), 0) AS correctas,
  ROUND(
    100.0 * COALESCE(SUM(CASE WHEN pr.trivia_respondida_correctamente THEN 1 ELSE 0 END), 0)
    / NULLIF(COUNT(pr.*), 0),
    1
  ) AS precision
FROM public.progreso_recorrido pr
JOIN public.estudiantes e ON e.id = pr.estudiante_id
GROUP BY e.grupo;

CREATE OR REPLACE VIEW public.panel_inactividad AS
SELECT
  e.id AS estudiante_id,
  e.nickname,
  e.grupo,
  COALESCE(MAX(pr.completado_at), e.ultimo_acceso) AS ultima_actividad,
  EXTRACT(EPOCH FROM (NOW() - COALESCE(MAX(pr.completado_at), e.ultimo_acceso))) / 60.0 AS minutos_inactivo
FROM public.estudiantes e
LEFT JOIN public.progreso_recorrido pr ON pr.estudiante_id = e.id
GROUP BY e.id, e.nickname, e.grupo, e.ultimo_acceso;
