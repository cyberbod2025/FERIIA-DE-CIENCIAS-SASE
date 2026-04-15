import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Users } from "lucide-react";
import { supabase } from "../lib/supabase";
import { SaseNeuralCore } from "../components/SaseNeuralCore";
import { saveStudentSession } from "../lib/studentSession";

const GRUPOS = [
  "1°A", "1°B", "1°C", "1°D",
  "2°A", "2°B", "2°C", "2°D",
  "3°A", "3°B", "3°C", "3°D",
];

const BANNED_WORDS = [
  "groseria1", "falso", "tonto", "puto", "pendejo", "verga", "culo",
];

export const LoginView: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [grupo, setGrupo] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
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
      const grado = parseInt(grupo.charAt(0));

      const { data, error } = await supabase.rpc("issue_student_session", {
        p_nickname: nombre.trim(),
        p_grupo: grupo,
        p_grado: grado,
      });

      if (error) throw error;
      if (!data?.success || !data.student_id || !data.session_token) {
        throw new Error(data?.message || "No se pudo iniciar la sesion del alumno.");
      }

      saveStudentSession({
        studentId: data.student_id,
        studentName: nombre.trim(),
        studentGroup: grupo,
        sessionToken: data.session_token,
      });

      navigate("/tutorial");
    } catch (err) {
      console.error("Error en registro:", err);
      setError("Error al registrar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Acceso al Núcleo">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          minHeight: "100%",
          padding: "24px",
          paddingTop: "24px",
          gap: "24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "360px" }}>
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 900,
                lineHeight: 0.95,
                textTransform: "uppercase",
                letterSpacing: "-0.03em",
                background: "linear-gradient(180deg, #ffffff 0%, #fbbf24 100%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              FERIA DE CIENCIAS 2026 ESD-310
            </h1>
            <p
              style={{
                marginTop: "6px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "var(--accent)",
                opacity: 0.8,
              }}
            >
              Registro de Investigadores
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <SaseNeuralCore size={180} />
        </motion.div>

        <div style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
                fontSize: "12px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#fbbf24",
              }}
            >
              <User size={14} /> Nombre y Apellido
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
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,215,0,0.15)",
                borderRadius: "14px",
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
                fontSize: "12px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#fbbf24",
              }}
            >
              <Users size={14} /> Grupo
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
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255,215,0,0.15)",
                borderRadius: "14px",
                color: "white",
                fontSize: "16px",
                outline: "none",
                appearance: "none"
              }}
            >
              <option value="">Selecciona tu grupo...</option>
              {GRUPOS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: "center",
                color: "#ef4444",
                fontSize: "12px",
                fontWeight: 700,
                background: "rgba(239, 68, 68, 0.1)",
                padding: "10px 12px",
                borderRadius: "12px",
              }}
            >
              ⚠️ {error}
            </motion.p>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "20px",
              borderRadius: "18px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              border: isLoading ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(6, 182, 212, 0.5)",
              background: isLoading ? "rgba(255,255,255,0.05)" : "rgba(0, 0, 0, 0.4)",
              color: isLoading ? "rgba(255,255,255,0.25)" : "white",
              cursor: isLoading ? "not-allowed" : "pointer",
              boxShadow: isLoading ? "none" : "0 0 30px rgba(6, 182, 212, 0.15)",
            }}
          >
            {isLoading ? 'Iniciando Protocolo...' : 'Sincronizar Acceso'}
          </button>
          
          <button
            onClick={() => navigate("/panel/login")}
            style={{
              width: "100%",
              padding: "12px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              fontSize: "10px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              cursor: "pointer",
            }}
          >
            Acceso Maestros
          </button>
        </div>
      </div>
    </Layout>
  );
};
