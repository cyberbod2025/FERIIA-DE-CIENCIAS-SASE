import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Users } from "lucide-react";
import { supabase } from "../lib/supabase";
import { FeriaIdentityOrb } from "../components/SaseIdentityOrb";

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

      const { data: existing } = await supabase
        .from("estudiantes")
        .select("id")
        .eq("nickname", nombre.trim())
        .eq("grupo", grupo)
        .single();

      let studentId: string;

      if (existing) {
        studentId = existing.id;
        await supabase
          .from("estudiantes")
          .update({ ultimo_acceso: new Date().toISOString() })
          .eq("id", studentId);
      } else {
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
    <Layout title="Acceso al Núcleo">
      <div className="flex flex-col items-center justify-start min-h-full p-6 pt-12 space-y-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-amber-400 uppercase">
              FERIA DE CIENCIAS 2026 ESD-310
            </h1>
            <p className="text-sm font-bold tracking-[0.3em] uppercase text-cyan-500 opacity-80">
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
          <FeriaIdentityOrb state="imposing" size={200} />
        </motion.div>

        <div className="w-full max-w-sm space-y-6" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label className="flex items-center gap-2 mb-2 text-xs font-black uppercase text-amber-400 tracking-widest">
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
            <label className="flex items-center gap-2 mb-2 text-xs font-black uppercase text-amber-400 tracking-widest">
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
              className="text-center text-red-500 text-xs font-bold bg-red-500/10 py-2 rounded-lg"
            >
              ⚠️ {error}
            </motion.p>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`
                w-full py-5 rounded-2xl font-black uppercase tracking-[0.15em] transition-all duration-300
                ${isLoading
                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                : 'bg-black/40 border border-cyan-500/50 text-white hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] active:scale-[0.98]'
              }
              `}
          >
            {isLoading ? 'Iniciando Protocolo...' : 'Sincronizar Acceso'}
          </button>
          
          <button
            onClick={() => navigate("/panel/login")}
            className="w-full py-3 bg-transparent border border-white/10 rounded-xl text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] hover:text-white/60 transition-colors"
          >
            Acceso Maestros
          </button>
        </div>
      </div>
    </Layout>
  );
};
