import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { supabase } from "../lib/supabase";
import { SaseNeuralCore } from "../components/SaseNeuralCore";

export const TeacherLoginView: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("Completa correo y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) throw signInError;
      navigate("/panel");
    } catch (err: unknown) {
      console.error("Error en acceso maestros:", err);
      setError("Acceso no autorizado. Verifica tus datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Acceso de Maestros">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          minHeight: "100%",
          padding: "24px",
          paddingTop: "48px",
          gap: "32px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "360px" }}>
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "-0.03em",
                background: "linear-gradient(180deg, #ffffff 0%, #fbbf24 100%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Panel de Control
            </h1>
            <p
              style={{
                marginTop: "8px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--accent)",
                opacity: 0.8,
              }}
            >
              Solo personal autorizado
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <SaseNeuralCore size={160} />
        </motion.div>

        <div style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
                fontSize: "10px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#fbbf24",
              }}
            >
              <Mail size={12} /> Correo Institucional
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="docente@escuela.mx"
              style={{
                width: "100%",
                padding: "16px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(251, 191, 36, 0.2)",
                borderRadius: "12px",
                color: "white",
                fontSize: "14px",
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
                fontSize: "10px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#fbbf24",
              }}
            >
              <Lock size={12} /> Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="********"
              style={{
                width: "100%",
                padding: "16px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(251, 191, 36, 0.2)",
                borderRadius: "12px",
                color: "white",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: "center",
                color: "#ef4444",
                fontSize: "10px",
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
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "16px",
              borderRadius: "12px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontSize: "14px",
              border: loading ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(6, 182, 212, 0.5)",
              background: loading ? "rgba(255,255,255,0.05)" : "rgba(0, 0, 0, 0.4)",
              color: loading ? "rgba(255,255,255,0.25)" : "white",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 0 30px rgba(6, 182, 212, 0.15)",
            }}
          >
            {loading ? "Iniciando Sesión..." : "Entrar al Sistema"}
          </button>

          <button
            onClick={() => navigate("/")}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              fontSize: "10px",
              fontWeight: 700,
              color: loading ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.35)",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Volver al Inicio
          </button>
        </div>
        
        <div style={{ paddingTop: "16px", textAlign: "center" }}>
          <p
            style={{
              fontSize: "9px",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontWeight: 700,
            }}
          >
            Protocolo de Seguridad <span style={{ color: "rgba(6, 182, 212, 0.4)" }}>ESD-310-SASE</span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

