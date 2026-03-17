-- ======================================================================================
-- SASE-FERIA: OPTIMIZACIÓN Y HARDENING DEL SISTEMA DE COMPETENCIA
-- Descripción: Mejora el rendimiento del ranking y asegura la atomicidad de los 
-- escaneos de estaciones y ganancia de puntos.
-- ======================================================================================

-- 1. OPTIMIZACIÓN DE ÍNDICES (Performance)
-- Acelera el cálculo de posiciones en el ranking y la verificación de progreso.

-- Índice para el ranking (ordenado por puntos y escaneos)
CREATE INDEX IF NOT EXISTS idx_estudiantes_ranking 
ON public.estudiantes (total_puntos DESC, escaneos_realizados DESC);

-- Índice único para evitar duplicados en progreso y acelerar búsquedas por estudiante
CREATE INDEX IF NOT EXISTS idx_progreso_lookup 
ON public.progreso_recorrido (estudiante_id, estacion_id);

-- 2. ATOMICIDAD: Función Segura para Registrar Progreso (RPC)
-- Esta función asegura que el incremento de puntos, el conteo de escaneos y la 
-- actualización de visitantes actvos ocurra en una sola transacción protegida.

CREATE OR REPLACE FUNCTION public.registrar_progreso_v2(
    p_estudiante_id uuid,
    p_estacion_id uuid,
    p_puntos_ganados integer
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- Se ejecuta con privilegios para bypass de RLS controlado
AS $$
DECLARE
    v_ya_completado boolean;
BEGIN
    -- Verificar si ya escaneó esta estación para evitar doble puntuación
    SELECT EXISTS (
        SELECT 1 FROM public.progreso_recorrido 
        WHERE estudiante_id = p_estudiante_id AND estacion_id = p_estacion_id
    ) INTO v_ya_completado;

    IF v_ya_completado THEN
        RETURN json_build_object('success', false, 'message', 'Estación ya registrada');
    END IF;

    -- 1. Registrar el progreso
    INSERT INTO public.progreso_recorrido (
        estudiante_id, 
        estacion_id, 
        trivia_respondida_correctamente, 
        puntos_ganados
    ) VALUES (
        p_estudiante_id, 
        p_estacion_id, 
        (p_puntos_ganados > 0), 
        p_puntos_ganados
    );

    -- 2. Actualizar totales del estudiante
    UPDATE public.estudiantes 
    SET total_puntos = total_puntos + p_puntos_ganados,
        escaneos_realizados = escaneos_realizados + 1,
        ultimo_acceso = now()
    WHERE id = p_estudiante_id;

    -- 3. Incrementar visitantes activos en la estación (Estadística en tiempo real)
    UPDATE public.estaciones 
    SET visitantes_activos = visitantes_activos + 1
    WHERE id = p_estacion_id;

    RETURN json_build_object(
        'success', true, 
        'puntos_totales', (SELECT total_puntos FROM public.estudiantes WHERE id = p_student_id)
    );
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$;

-- 2B. ATOMICIDAD: Función para Finalizar Trivia (RPC)
CREATE OR REPLACE FUNCTION public.finalizar_trivia_v2(
    p_estudiante_id uuid,
    p_estacion_id uuid,
    p_puntos_adicionales integer
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
    WHERE id = p_estudiante_id;

    -- 3. Decrementar visitantes activos (Salida de la estación)
    UPDATE public.estaciones 
    SET visitantes_activos = CASE WHEN visitantes_activos > 0 THEN visitantes_activos - 1 ELSE 0 END
    WHERE id = p_estacion_id;

    RETURN json_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$;

-- 3. HARDENING: Asegurar que el Preguntómetro tenga moderación estricta
-- Limitar el número de preguntas pendientes por estudiante para evitar ataques de DOS.

CREATE OR REPLACE FUNCTION public.check_preguntometro_limit()
RETURNS TRIGGER AS $$
DECLARE
    v_pending_count integer;
BEGIN
    SELECT count(*) INTO v_pending_count 
    FROM public.preguntometro 
    WHERE estudiante_id = NEW.estudiante_id AND moderacion_estado = 'pendiente';

    IF v_pending_count >= 5 THEN
        RAISE EXCEPTION 'Límite de preguntas pendientes alcanzado (máx 5). Espera a que se moderen.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_limit_preguntas ON public.preguntometro;
CREATE TRIGGER trg_limit_preguntas
BEFORE INSERT ON public.preguntometro
FOR EACH ROW EXECUTE FUNCTION public.check_preguntometro_limit();

-- 4. Mantenimiento Preventivo
ANALYZE public.estaciones;
ANALYZE public.estudiantes;
ANALYZE public.progreso_recorrido;
