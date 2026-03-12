-- 1. Agregar columna docente_responsable
ALTER TABLE estaciones ADD COLUMN IF NOT EXISTS docente_responsable TEXT;

-- 2. Limpiar estaciones anteriores para carga real
TRUNCATE TABLE estaciones CASCADE;

-- 3. Insertar las 28 estaciones reales
-- MATEMÁTICAS (12)
INSERT INTO estaciones (nombre, materia, docente_responsable, grupo, grado, categoria, estado) VALUES
('Magia de los Números A', 'Matemáticas', 'Marisol', '1A', 1, 'Ciencias Exactas', 'disponible'),
('Magia de los Números B', 'Matemáticas', 'Marisol', '1B', 1, 'Ciencias Exactas', 'disponible'),
('Magia de los Números C', 'Matemáticas', 'Marisol', '1C', 1, 'Ciencias Exactas', 'disponible'),
('Desafío Hugo D', 'Matemáticas', 'Hugo', '1D', 1, 'Ciencias Exactas', 'disponible'),
('Desafío Hugo 2A', 'Matemáticas', 'Hugo', '2A', 2, 'Ciencias Exactas', 'disponible'),
('Desafío Hugo 2B', 'Matemáticas', 'Hugo', '2B', 2, 'Ciencias Exactas', 'disponible'),
('Desafío Hugo 2C', 'Matemáticas', 'Hugo', '2C', 2, 'Ciencias Exactas', 'disponible'),
('Desafío Hugo 2D', 'Matemáticas', 'Hugo', '2D', 2, 'Ciencias Exactas', 'disponible'),
('El Gran Acertijo 3A', 'Matemáticas', 'Juan', '3A', 3, 'Ciencias Exactas', 'disponible'),
('Cápsula de Hans 3B', 'Matemáticas', 'Hans', '3B', 3, 'Ciencias Exactas', 'disponible'),
('Cápsula de Hans 3C', 'Matemáticas', 'Hans', '3C', 3, 'Ciencias Exactas', 'disponible'),
('Cápsula de Hans 3D', 'Matemáticas', 'Hans', '3D', 3, 'Ciencias Exactas', 'disponible');

-- GEOGRAFÍA (4)
INSERT INTO estaciones (nombre, materia, docente_responsable, grupo, grado, categoria, estado) VALUES
('Exploración Global 1A', 'Geografía', 'Jairo', '1A', 1, 'Ciencias Sociales', 'disponible'),
('Exploración Global 1B', 'Geografía', 'Jairo', '1B', 1, 'Ciencias Sociales', 'disponible'),
('Exploración Global 1C', 'Geografía', 'Jairo', '1C', 1, 'Ciencias Sociales', 'disponible'),
('Exploración Global 1D', 'Geografía', 'Jairo', '1D', 1, 'Ciencias Sociales', 'disponible');

-- BIOLOGÍA (4)
INSERT INTO estaciones (nombre, materia, docente_responsable, grupo, grado, categoria, estado) VALUES
('Mundo Microscópico 1A', 'Biología', 'Brenda', '1A', 1, 'Ciencias Naturales', 'disponible'),
('Mundo Microscópico 1B', 'Biología', 'Brenda', '1B', 1, 'Ciencias Naturales', 'disponible'),
('Mundo Microscópico 1C', 'Biología', 'Brenda', '1C', 1, 'Ciencias Naturales', 'disponible'),
('Mundo Microscópico 1D', 'Biología', 'Brenda', '1D', 1, 'Ciencias Naturales', 'disponible');

-- FÍSICA (4)
INSERT INTO estaciones (nombre, materia, docente_responsable, grupo, grado, categoria, estado) VALUES
('Fuerzas en Acción A', 'Física', 'Docente Física 1', '2A', 2, 'Ciencias Naturales', 'disponible'),
('Fuerzas en Acción B', 'Física', 'Docente Física 2', '2B', 2, 'Ciencias Naturales', 'disponible'),
('Fuerzas en Acción C', 'Física', 'Docente Física 2', '2C', 2, 'Ciencias Naturales', 'disponible'),
('Fuerzas en Acción D', 'Física', 'Docente Física 2', '2D', 2, 'Ciencias Naturales', 'disponible');

-- QUÍMICA (4)
INSERT INTO estaciones (nombre, materia, docente_responsable, grupo, grado, categoria, estado) VALUES
('Reacciones Sorprendentes A', 'Química', 'Docente Química 1', '3A', 3, 'Ciencias Naturales', 'disponible'),
('Reacciones Sorprendentes B', 'Química', 'Docente Química 1', '3B', 3, 'Ciencias Naturales', 'disponible'),
('Reacciones Sorprendentes C', 'Química', 'Docente Química 2', '3C', 3, 'Ciencias Naturales', 'disponible'),
('Reacciones Sorprendentes D', 'Química', 'Docente Química 2', '3D', 3, 'Ciencias Naturales', 'disponible');

-- 4. Asegurar que cada estación tenga al menos una trivia
-- (Insertamos trivias genéricas para cada nueva estación creada arriba)
INSERT INTO trivias (estacion_id, pregunta, opciones, respuesta_correcta, explicacion_post_respuesta, puntos)
SELECT id, '¿Cuál fue el tema principal de esta estación?', 
  '{"A": "Tecnología", "B": "Lo explicado por el docente", "C": "Arte", "D": "Deporte"}'::jsonb, 
  'B', 
  '¡Correcto! La atención a la explicación es la base del conocimiento.', 
  10
FROM estaciones;
