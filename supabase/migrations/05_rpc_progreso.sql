-- Funciones RPC para manejo atómico de progreso y visitantes

-- 1. Función para registrar check-in y actualizar contadores en un solo paso
CREATE OR REPLACE FUNCTION registrar_progreso_v2(
  p_estudiante_id UUID,
  p_estacion_id UUID,
  p_puntos_ganados INTEGER
) RETURNS VOID AS $$
BEGIN
  -- Insertar o actualizar el progreso
  INSERT INTO progreso_recorrido (estudiante_id, estacion_id, puntos_ganados)
  VALUES (p_estudiante_id, p_estacion_id, p_puntos_ganados)
  ON CONFLICT (estudiante_id, estacion_id) 
  DO UPDATE SET puntos_ganados = EXCLUDED.puntos_ganados;

  -- Incrementar visitantes activos en la estación
  UPDATE estaciones 
  SET visitantes_activos = visitantes_activos + 1
  WHERE id = p_estacion_id;

  -- Incrementar escaneos realizados por el estudiante
  UPDATE estudiantes
  SET escaneos_realizados = escaneos_realizados + 1
  WHERE id = p_estudiante_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Función simple para incrementar visitantes
CREATE OR REPLACE FUNCTION increment_visitantes(stand_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE estaciones 
  SET visitantes_activos = visitantes_activos + 1
  WHERE id = stand_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Función simple para decrementar visitantes
CREATE OR REPLACE FUNCTION decrement_visitantes(stand_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE estaciones 
  SET visitantes_activos = GREATEST(0, visitantes_activos - 1)
  WHERE id = stand_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
