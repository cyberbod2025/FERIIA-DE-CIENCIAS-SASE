-- Puntos por grupo: acumulado de equipo y vistas para ranking

-- 1. Tabla de puntos por grupo
CREATE TABLE IF NOT EXISTS public.grupos_puntos (
  grupo TEXT PRIMARY KEY,
  total_puntos INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Backfill inicial a partir de estudiantes existentes
INSERT INTO public.grupos_puntos (grupo, total_puntos)
SELECT e.grupo, COALESCE(SUM(e.total_puntos), 0)
FROM public.estudiantes e
WHERE e.grupo IS NOT NULL
GROUP BY e.grupo
ON CONFLICT (grupo) DO UPDATE
SET total_puntos = EXCLUDED.total_puntos,
    updated_at = NOW();

-- 3. Vista de ranking por grupos
CREATE OR REPLACE VIEW public.ranking_grupos AS
SELECT grupo, total_puntos
FROM public.grupos_puntos
ORDER BY total_puntos DESC;

-- 4. Actualizar vista de panel de grupos para incluir puntos acumulados
CREATE OR REPLACE VIEW public.panel_grupos AS
SELECT
  e.grupo,
  COUNT(pr.*) AS total_checkins,
  COALESCE(SUM(CASE WHEN pr.trivia_respondida_correctamente THEN 1 ELSE 0 END), 0) AS correctas,
  ROUND(
    100.0 * COALESCE(SUM(CASE WHEN pr.trivia_respondida_correctamente THEN 1 ELSE 0 END), 0)
    / NULLIF(COUNT(pr.*), 0),
    1
  ) AS precision,
  COALESCE(gp.total_puntos, 0) AS puntos_grupo
FROM public.progreso_recorrido pr
JOIN public.estudiantes e ON e.id = pr.estudiante_id
LEFT JOIN public.grupos_puntos gp ON gp.grupo = e.grupo
GROUP BY e.grupo, gp.total_puntos;

-- 5. Actualizar RPC: finalizar_trivia_v2 suma puntos al grupo
CREATE OR REPLACE FUNCTION public.finalizar_trivia_v2(
    p_estudiante_id uuid,
    p_estacion_id uuid,
    p_puntos_adicionales integer
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_grupo TEXT;
BEGIN
    -- 1. Actualizar el registro de progreso
    UPDATE public.progreso_recorrido 
    SET trivia_respondida_correctamente = (p_puntos_adicionales > 0),
        puntos_ganados = p_puntos_adicionales,
        completado_at = now()
    WHERE estudiante_id = p_estudiante_id AND estacion_id = p_estacion_id;

    -- 2. Actualizar puntos totales del estudiante
    UPDATE public.estudiantes 
    SET total_puntos = total_puntos + p_puntos_adicionales
    WHERE id = p_estudiante_id
    RETURNING grupo INTO v_grupo;

    -- 3. Actualizar puntos del grupo
    IF v_grupo IS NOT NULL THEN
      INSERT INTO public.grupos_puntos (grupo, total_puntos)
      VALUES (v_grupo, p_puntos_adicionales)
      ON CONFLICT (grupo) DO UPDATE
      SET total_puntos = public.grupos_puntos.total_puntos + EXCLUDED.total_puntos,
          updated_at = NOW();
    END IF;

    -- 4. Decrementar visitantes activos (Salida de la estación)
    UPDATE public.estaciones 
    SET visitantes_activos = CASE WHEN visitantes_activos > 0 THEN visitantes_activos - 1 ELSE 0 END
    WHERE id = p_estacion_id;

    RETURN json_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$;
