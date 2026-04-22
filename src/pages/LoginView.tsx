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

    const isBanned = BANNED_WORDS.some((word) => nombre.toLowerCase().includes(word));
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
        throw new Error(data?.message || "Error de sesión.");
      }

      saveStudentSession({
        studentId: data.student_id,
        studentName: nombre.trim(),
        studentGroup: grupo,
        sessionToken: data.session_token,
      });
      navigate("/tutorial");
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Acceso al Núcleo">
      <div className="flex flex-col items-center justify-center min-h-full p-6 pt-10 pb-20 overflow-hidden relative">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px] text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2 uppercase italic">
            Feria <span className="text-blue-400">2026</span>
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-6 bg-blue-500/30" />
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">Investigadores</p>
            <div className="h-[1px] w-6 bg-blue-500/30" />
          </div>
        </motion.div>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }} className="relative mb-12">
          <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <SaseNeuralCore size={140} />
        </motion.div>

        <div className="w-full max-w-[360px] space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="surface-card-strong p-6 border border-white/5">
            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-blue-300">
                  <User size={12} /> Identidad del Alumno
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre completo..."
                  value={nombre}
                  onChange={(e) => { setNombre(e.target.value); setError(""); }}
                  className="w-full h-14 px-5 text-sm text-white placeholder:text-white/20 transition-all border outline-none bg-black/40 border-white/10 focus:border-blue-400/30 rounded-xl"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-blue-300">
                  <Users size={12} /> Grupo de Misión
                </label>
                <div className="relative">
                  <select
                    value={grupo}
                    onChange={(e) => { setGrupo(e.target.value); setError(""); }}
                    className="w-full h-14 px-5 text-sm text-white transition-all border outline-none bg-black/40 border-white/10 focus:border-blue-400/30 rounded-xl appearance-none"
                  >
                    <option value="" className="bg-slate-950">Selecciona tu grupo...</option>
                    {GRUPOS.map((g) => <option key={g} value={g} className="bg-slate-950">{g}</option>)}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 text-white">
                    <Users size={16} />
                  </div>
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 border bg-red-500/10 border-red-500/20 rounded-xl">
                  <p className="text-[11px] font-bold text-red-400 text-center">⚠️ {error}</p>
                </motion.div>
              )}

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className={`w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl ${
                  isLoading ? "opacity-50 cursor-not-allowed bg-white/5" : "bg-gradient-to-br from-blue-400 to-blue-700 text-white shadow-blue-500/20 active:scale-95"
                }`}
              >
                {isLoading ? "Sincronizando..." : "Iniciar Misión"}
              </button>
            </div>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => navigate("/panel/login")}
            className="w-full py-4 text-[10px] font-black tracking-[0.3em] uppercase text-white/30 hover:text-white/60 transition-colors"
          >
            Acceso Personal Docente
          </motion.button>
        </div>
      </div>
    </Layout>
  );
};
