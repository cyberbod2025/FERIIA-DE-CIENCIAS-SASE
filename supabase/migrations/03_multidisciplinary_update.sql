-- Actualización de esquema para Soporte Multidisciplinario y Preguntómetro

-- 1. Actualizar tabla estaciones
ALTER TABLE estaciones ADD COLUMN IF NOT EXISTS materia TEXT;
ALTER TABLE estaciones ADD COLUMN IF NOT EXISTS grupo TEXT;
ALTER TABLE estaciones ADD COLUMN IF NOT EXISTS fotos TEXT[];
ALTER TABLE estaciones ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'disponible';
ALTER TABLE estaciones ADD COLUMN IF NOT EXISTS visitantes_activos INTEGER DEFAULT 0;

-- 2. Tabla para el Preguntómetro (Preguntas anónimas al expositor)
CREATE TABLE IF NOT EXISTS preguntometro (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estudiante_id UUID REFERENCES estudiantes(id) ON DELETE CASCADE,
  estacion_id UUID REFERENCES estaciones(id) ON DELETE CASCADE,
  pregunta TEXT NOT NULL,
  respuesta TEXT,
  es_anonima BOOLEAN DEFAULT TRUE,
  moderacion_estado TEXT DEFAULT 'pendiente', -- 'pendiente', 'aprobada', 'rechazada'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de palabras prohibidas (Moderación simple)
CREATE TABLE IF NOT EXISTS moderacion_config (
  id SERIAL PRIMARY KEY,
  palabra TEXT UNIQUE NOT NULL
);

-- 4. Habilitar RLS para la nueva tabla
ALTER TABLE preguntometro ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Estudiantes pueden enviar preguntas" ON preguntometro FOR INSERT WITH CHECK (true);
CREATE POLICY "Público puede ver preguntas aprobadas" ON preguntometro FOR SELECT USING (moderacion_estado = 'aprobada');
