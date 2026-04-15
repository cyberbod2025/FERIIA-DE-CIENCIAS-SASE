-- Correcciones brownfield para RPCs criticos, sesion de alumno y drift frontend/SQL.

ALTER TABLE public.estudiantes
ADD COLUMN IF NOT EXISTS student_session_token text;

ALTER TABLE public.estudiantes
ADD COLUMN IF NOT EXISTS student_session_issued_at timestamp with time zone;

CREATE OR REPLACE FUNCTION public.issue_student_session(
    p_nickname text,
    p_grupo text,
    p_grado integer
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_student_id uuid;
    v_session_token text;
BEGIN
    IF trim(COALESCE(p_nickname, '')) = '' OR trim(COALESCE(p_grupo, '')) = '' OR p_grado IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'Datos incompletos');
    END IF;

    v_session_token := uuid_generate_v4()::text;

    SELECT id
    INTO v_student_id
    FROM public.estudiantes
    WHERE nickname = trim(p_nickname)
      AND grupo = trim(p_grupo)
    LIMIT 1;

    IF v_student_id IS NULL THEN
        INSERT INTO public.estudiantes (
            nickname,
            grado,
            grupo,
            total_puntos,
            escaneos_realizados,
            ultimo_acceso,
            student_session_token,
            student_session_issued_at
        ) VALUES (
            trim(p_nickname),
            p_grado,
            trim(p_grupo),
            0,
            0,
            now(),
            v_session_token,
            now()
        )
        RETURNING id INTO v_student_id;
    ELSE
        UPDATE public.estudiantes
        SET ultimo_acceso = now(),
            student_session_token = v_session_token,
            student_session_issued_at = now()
        WHERE id = v_student_id;
    END IF;

    RETURN json_build_object(
        'success', true,
        'student_id', v_student_id,
        'session_token', v_session_token,
        'nickname', trim(p_nickname),
        'grupo', trim(p_grupo)
    );
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$;

CREATE OR REPLACE FUNCTION public.obtener_progreso_estudiante_v1(
    p_estudiante_id uuid,
    p_session_token text
)
RETURNS TABLE (
    estacion_id uuid,
    trivia_respondida_correctamente boolean,
    puntos_ganados integer,
    completado_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF p_estudiante_id IS NULL OR trim(COALESCE(p_session_token, '')) = '' THEN
        RETURN;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.estudiantes
        WHERE id = p_estudiante_id
          AND student_session_token = p_session_token
    ) THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT
        pr.estacion_id,
        pr.trivia_respondida_correctamente,
        pr.puntos_ganados,
        pr.completado_at
    FROM public.progreso_recorrido pr
    WHERE pr.estudiante_id = p_estudiante_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.obtener_panel_grupos_v1()
RETURNS TABLE (
    grupo text,
    total_checkins bigint,
    correctas bigint,
    precision numeric,
    puntos_grupo integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NOT public.is_staff() THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT
        pg.grupo,
        pg.total_checkins,
        pg.correctas,
        pg.precision,
        pg.puntos_grupo
    FROM public.panel_grupos pg;
END;
$$;

CREATE OR REPLACE FUNCTION public.obtener_panel_inactividad_v1()
RETURNS TABLE (
    estudiante_id uuid,
    nickname text,
    grupo text,
    ultima_actividad timestamp with time zone,
    minutos_inactivo double precision
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NOT public.is_staff() THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT
        pi.estudiante_id,
        pi.nickname,
        pi.grupo,
        pi.ultima_actividad,
        pi.minutos_inactivo
    FROM public.panel_inactividad pi;
END;
$$;

CREATE OR REPLACE FUNCTION public.registrar_progreso_v2(
    p_estudiante_id uuid,
    p_estacion_id uuid,
    p_puntos_ganados integer,
    p_session_token text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_ya_completado boolean;
BEGIN
    IF p_estudiante_id IS NULL OR p_estacion_id IS NULL OR trim(COALESCE(p_session_token, '')) = '' THEN
        RETURN json_build_object('success', false, 'message', 'Parametros incompletos');
    END IF;

    IF COALESCE(p_puntos_ganados, 0) < 0 THEN
        RETURN json_build_object('success', false, 'message', 'Puntos invalidos');
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.estudiantes
        WHERE id = p_estudiante_id
          AND student_session_token = p_session_token
    ) THEN
        RETURN json_build_object('success', false, 'message', 'Sesion invalida');
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.estaciones
        WHERE id = p_estacion_id AND estado = 'disponible'
    ) THEN
        RETURN json_build_object('success', false, 'message', 'Estacion no disponible');
    END IF;

    SELECT EXISTS (
        SELECT 1
        FROM public.progreso_recorrido
        WHERE estudiante_id = p_estudiante_id AND estacion_id = p_estacion_id
    ) INTO v_ya_completado;

    IF v_ya_completado THEN
        RETURN json_build_object('success', false, 'message', 'Estacion ya registrada');
    END IF;

    INSERT INTO public.progreso_recorrido (
        estudiante_id,
        estacion_id,
        trivia_respondida_correctamente,
        puntos_ganados
    ) VALUES (
        p_estudiante_id,
        p_estacion_id,
        (COALESCE(p_puntos_ganados, 0) > 0),
        COALESCE(p_puntos_ganados, 0)
    );

    UPDATE public.estudiantes
    SET total_puntos = total_puntos + COALESCE(p_puntos_ganados, 0),
        escaneos_realizados = escaneos_realizados + 1,
        ultimo_acceso = now()
    WHERE id = p_estudiante_id;

    UPDATE public.estaciones
    SET visitantes_activos = visitantes_activos + 1
    WHERE id = p_estacion_id;

    RETURN json_build_object(
        'success', true,
        'puntos_totales', (SELECT total_puntos FROM public.estudiantes WHERE id = p_estudiante_id)
    );
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$;

REVOKE ALL ON TABLE public.panel_grupos FROM anon, authenticated;
REVOKE ALL ON TABLE public.panel_inactividad FROM anon, authenticated;

REVOKE ALL ON FUNCTION public.issue_student_session(text, text, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.obtener_progreso_estudiante_v1(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.registrar_progreso_v2(uuid, uuid, integer, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.finalizar_trivia_v2(uuid, uuid, integer, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.obtener_panel_grupos_v1() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.obtener_panel_inactividad_v1() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.issue_student_session(text, text, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.obtener_progreso_estudiante_v1(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.registrar_progreso_v2(uuid, uuid, integer, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finalizar_trivia_v2(uuid, uuid, integer, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.obtener_panel_grupos_v1() TO authenticated;
GRANT EXECUTE ON FUNCTION public.obtener_panel_inactividad_v1() TO authenticated;

CREATE OR REPLACE FUNCTION public.finalizar_trivia_v2(
    p_estudiante_id uuid,
    p_estacion_id uuid,
    p_puntos_adicionales integer,
    p_session_token text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_grupo text;
BEGIN
    IF p_estudiante_id IS NULL OR p_estacion_id IS NULL OR trim(COALESCE(p_session_token, '')) = '' THEN
        RETURN json_build_object('success', false, 'message', 'Parametros incompletos');
    END IF;

    IF COALESCE(p_puntos_adicionales, 0) < 0 THEN
        RETURN json_build_object('success', false, 'message', 'Puntos invalidos');
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.estudiantes
        WHERE id = p_estudiante_id
          AND student_session_token = p_session_token
    ) THEN
        RETURN json_build_object('success', false, 'message', 'Sesion invalida');
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.progreso_recorrido
        WHERE estudiante_id = p_estudiante_id AND estacion_id = p_estacion_id
    ) THEN
        RETURN json_build_object('success', false, 'message', 'Check-in previo no encontrado');
    END IF;

    UPDATE public.progreso_recorrido
    SET trivia_respondida_correctamente = (COALESCE(p_puntos_adicionales, 0) > 0),
        puntos_ganados = COALESCE(p_puntos_adicionales, 0),
        completado_at = now()
    WHERE estudiante_id = p_estudiante_id AND estacion_id = p_estacion_id;

    UPDATE public.estudiantes
    SET total_puntos = total_puntos + COALESCE(p_puntos_adicionales, 0),
        ultimo_acceso = now()
    WHERE id = p_estudiante_id
    RETURNING grupo INTO v_grupo;

    IF v_grupo IS NOT NULL THEN
        INSERT INTO public.grupos_puntos (grupo, total_puntos)
        VALUES (v_grupo, COALESCE(p_puntos_adicionales, 0))
        ON CONFLICT (grupo) DO UPDATE
        SET total_puntos = public.grupos_puntos.total_puntos + EXCLUDED.total_puntos,
            updated_at = now();
    END IF;

    UPDATE public.estaciones
    SET visitantes_activos = CASE WHEN visitantes_activos > 0 THEN visitantes_activos - 1 ELSE 0 END
    WHERE id = p_estacion_id;

    RETURN json_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$;
