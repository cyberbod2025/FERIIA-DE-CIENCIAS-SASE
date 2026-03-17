import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { supabase } from "../lib/supabase";

export const TeacherLoginView: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("Completa correo y contrasena.");
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
    } catch (err) {
      console.error("Error en acceso maestros:", err);
      setError("Acceso no autorizado. Verifica tus datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Acceso Maestros">
      <div
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          flex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginTop: "8px" }}>
          <h1
            style={{
              color: "var(--gold)",
              fontSize: "22px",
              marginBottom: "6px",
            }}
          >
            Panel de Direccion y Docentes
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
            Solo personal autorizado
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <label style={{ color: "var(--gold)", fontSize: "11px" }}>
            <Mail size={14} style={{ marginRight: "6px" }} /> Correo
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="docente@escuela.mx"
            style={{
              width: "100%",
              padding: "14px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,215,0,0.2)",
              borderRadius: "12px",
              color: "white",
              fontSize: "14px",
              outline: "none",
            }}
          />

          <label style={{ color: "var(--gold)", fontSize: "11px" }}>
            <Lock size={14} style={{ marginRight: "6px" }} /> Contrasena
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            style={{
              width: "100%",
              padding: "14px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,215,0,0.2)",
              borderRadius: "12px",
              color: "white",
              fontSize: "14px",
              outline: "none",
            }}
          />

          {error && (
            <div
              style={{
                color: "var(--crimson)",
                textAlign: "center",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              marginTop: "6px",
              padding: "16px",
              background: loading ? "rgba(14,165,233,0.4)" : "var(--physics-blue)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 10px 20px rgba(14, 165, 233, 0.25)",
            }}
          >
            {loading ? "Verificando..." : "Ingresar al Panel"}
          </button>

          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              color: "rgba(255,255,255,0.7)",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </Layout>
  );
};
