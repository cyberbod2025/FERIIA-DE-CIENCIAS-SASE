-- Migración 10: Endurecimiento de seguridad y límites de stand
-- Objetivo: Prevenir que más de 20 alumnos se registren en un stand simultáneamente.

DROP FUNCTION IF EXISTS public.registrar_progreso_v2(UUID, UUID, INT);

CREATE OR REPLACE FUNCTION public.registrar_progreso_v2(
    p_estudiante_id UUID,
    p_estacion_id UUID,
    p_puntos_ganados INT
)
RETURNS JSON AS $$
DECLARE
    v_visitantes_actuales INT;
    v_capacidad_max INT := 20;
    v_nombre_estacion TEXT;
BEGIN
    -- 1. Bloqueo preventivo y conteo de visitantes activos en la estación
    SELECT visitantes_activos, nombre 
    INTO v_visitantes_actuales, v_nombre_estacion
    FROM estaciones 
    WHERE id = p_estacion_id
    FOR UPDATE;

    -- 2. Verificar límite de 20 alumnos
    IF v_visitantes_actuales >= v_capacidad_max THEN
        RETURN json_build_object(
            'success', false,
            'message', 'La estación ' || v_nombre_estacion || ' está llena (Límite: 20 alumnos). Intente más tarde.'
        );
    END IF;

    -- 3. Registrar o actualizar progreso
    INSERT INTO progreso_recorrido (estudiante_id, estacion_id, completado, puntos_obtenidos)
    VALUES (p_estudiante_id, p_estacion_id, true, p_puntos_ganados)
    ON CONFLICT (estudiante_id, estacion_id) 
    DO UPDATE SET 
        completado = true,
        puntos_obtenidos = EXCLUDED.puntos_obtenidos,
        fecha_registro = now();

    -- 4. Incrementar contador de visitantes (esto se puede mejorar con un trigger o proceso de salida, 
    -- pero para la feria se asume que entran y luego el sistema los limpia o se usa para control de flujo inmediato)
    UPDATE estaciones 
    SET visitantes_activos = visitantes_activos + 1
    WHERE id = p_estacion_id;

    RETURN json_build_object(
        'success', true,
        'message', 'Check-in exitoso en ' || v_nombre_estacion
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Asegurar que la columna existe (por si las dudas)
ALTER TABLE estaciones ADD COLUMN IF NOT EXISTS visitantes_activos INT DEFAULT 0;
