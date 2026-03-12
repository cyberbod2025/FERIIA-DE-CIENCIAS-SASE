import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Users } from "lucide-react";
import { supabase } from "../lib/supabase";
import { SaseIdentityOrb } from "../components/SaseIdentityOrb";

const GRUPOS = [
  "1°A",
  "1°B",
  "1°C",
  "1°D",
  "2°A",
  "2°B",
  "2°C",
  "2°D",
  "3°A",
  "3°B",
  "3°C",
  "3°D",
];

const BANNED_WORDS = [
  "groseria1",
  "falso",
  "tonto",
  "puto",
  "pendejo",
  "verga",
  "culo",
];

export const LoginView: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [grupo, setGrupo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!nombre.trim() || !grupo) {
      setError("Por favor completa tu nombre y grupo.");
      return;
    }

    const partes = nombre.trim().split(/\s+/);
    if (partes.length < 2) {
      setError("Escribe tu nombre y apellido. Ej: Juan Pérez");
      return;
    }

    const isBanned = BANNED_WORDS.some((word) =>
      nombre.toLowerCase().includes(word),
    );

    if (isBanned || nombre.length < 5) {
      setError("Nombre no válido. Por favor usa tu nombre real.");
      return;
    }

    setLoading(true);

    try {
      // Extraer grado del grupo (1°A -> 1)
      const grado = parseInt(grupo.charAt(0));

      // Verificar si el estudiante ya existe
      const { data: existing } = await supabase
        .from("estudiantes")
        .select("id")
        .eq("nickname", nombre.trim())
        .eq("grupo", grupo)
        .single();

      let studentId: string;

      if (existing) {
        // Ya existe, actualizar ultimo_acceso
        studentId = existing.id;
        await supabase
          .from("estudiantes")
          .update({ ultimo_acceso: new Date().toISOString() })
          .eq("id", studentId);
      } else {
        // Crear nuevo estudiante
        const { data: newStudent, error: insertError } = await supabase
          .from("estudiantes")
          .insert({
            nickname: nombre.trim(),
            grado: grado,
            grupo: grupo,
            total_puntos: 0,
            escaneos_realizados: 0,
          })
          .select("id")
          .single();

        if (insertError) throw insertError;
        studentId = newStudent.id;
      }

      // Guardar en localStorage para sesión
      localStorage.setItem("user_name", nombre.trim());
      localStorage.setItem("user_group", grupo);
      localStorage.setItem("student_id", studentId);

      navigate("/tutorial");
    } catch (err) {
      console.error("Error en registro:", err);
      setError("Error al registrar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="🎪 Acceso al Circo">
      <div
        style={{
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          flex: 1,
          justifyContent: "flex-start",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px", // Añadido margen arriba
            marginBottom: "0px",
          }}
        >
          <SaseIdentityOrb state="imposing" size={220} showAccessories={true} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center" }}
        >
          <h1
            style={{
              color: "var(--gold)",
              fontSize: "28px",
              marginBottom: "4px",
              textShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
            }}
          >
            S.A.S.E.
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "14px",
              letterSpacing: "0.1em",
            }}
          >
            SISTEMA DE ACOMPAÑAMIENTO Y SEGUIMIENTO ESCOLAR
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
                color: "var(--gold)",
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              <User size={16} /> Nombre y Apellido
            </label>
            <input
              type="text"
              placeholder="Nombre y Apellido..."
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setError("");
              }}
              style={{
                width: "100%",
                padding: "16px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,215,0,0.2)",
                borderRadius: "12px",
                color: "white",
                fontSize: "16px",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
                color: "var(--gold)",
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              <Users size={16} /> Grupo
            </label>
            <select
              value={grupo}
              onChange={(e) => {
                setGrupo(e.target.value);
                setError("");
              }}
              style={{
                width: "100%",
                padding: "16px",
                background: "rgba(25, 35, 80, 0.5)",
                border: "1px solid rgba(255,215,0,0.2)",
                borderRadius: "12px",
                color: "white",
                fontSize: "16px",
                outline: "none",
              }}
            >
              <option value="">Selecciona tu grupo...</option>
              {GRUPOS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <motion.p
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              style={{
                color: "var(--crimson)",
                textAlign: "center",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              ⚠️ {error}
            </motion.p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              marginTop: "10px",
              padding: "18px",
              background: loading ? "rgba(211,47,47,0.5)" : "var(--crimson)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 10px 20px rgba(211, 47, 47, 0.3)",
            }}
          >
            {loading ? "Registrando..." : "Comenzar Recorrido"}
          </button>
        </div>
      </div>
    </Layout>
  );
};
