-- Migración inicial para el sistema "Circo de la Ciencia 310"

-- 1. Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Esquema de Estaciones (Experimentos)
CREATE TABLE IF NOT EXISTS estaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL,
  grado INTEGER NOT NULL CHECK (grado IN (1, 2, 3)),
  descripcion_pedagogica TEXT,
  proceso TEXT,
  meta TEXT,
  materiales TEXT[],
  momento_wow TEXT,
  impacto_visual INTEGER DEFAULT 5,
  pda_referencia TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Esquema de Trivia
CREATE TABLE IF NOT EXISTS trivias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estacion_id UUID REFERENCES estaciones(id) ON DELETE CASCADE,
  pregunta TEXT NOT NULL,
  opciones JSONB NOT NULL, -- Estructura: {"A": "...", "B": "...", "C": "...", "D": "..."}
  respuesta_correcta CHAR(1) NOT NULL,
  explicacion_post_respuesta TEXT,
  puntos INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Esquema de Estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nickname TEXT UNIQUE NOT NULL,
  grado INTEGER NOT NULL,
  password_hash TEXT, -- Para persistencia simple
  total_puntos INTEGER DEFAULT 0,
  escaneos_realizados INTEGER DEFAULT 0,
  ultimo_acceso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Registro de Progreso (Escaneos de QR y Respuestas)
CREATE TABLE IF NOT EXISTS progreso_recorrido (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estudiante_id UUID REFERENCES estudiantes(id) ON DELETE CASCADE,
  estacion_id UUID REFERENCES estaciones(id) ON DELETE CASCADE,
  trivia_respondida_correctamente BOOLEAN DEFAULT FALSE,
  puntos_ganados INTEGER DEFAULT 0,
  completado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(estudiante_id, estacion_id)
);

-- 6. Funciones para Ranking en tiempo real
CREATE OR REPLACE VIEW ranking_general AS
SELECT 
  nickname,
  grado,
  total_puntos,
  escaneos_realizados,
  RANK() OVER (ORDER BY total_puntos DESC, escaneos_realizados DESC) as posicion
FROM estudiantes
ORDER BY total_puntos DESC;

-- Habilitar Row Level Security (RLS)
ALTER TABLE estudiantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE estaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE trivias ENABLE ROW LEVEL SECURITY;
ALTER TABLE progreso_recorrido ENABLE ROW LEVEL SECURITY;

-- Políticas públicas para lectura (Feria abierta)
CREATE POLICY "Lectura pública de estaciones" ON estaciones FOR SELECT USING (true);
CREATE POLICY "Lectura pública de trivias" ON trivias FOR SELECT USING (true);
CREATE POLICY "Lectura pública de ranking" ON estudiantes FOR SELECT USING (true);
