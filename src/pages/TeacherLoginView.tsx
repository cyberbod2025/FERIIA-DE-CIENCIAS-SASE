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
      <div className="flex flex-col items-center justify-start min-h-full p-6 pt-12 space-y-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-amber-400 uppercase">
              Panel de Control
            </h1>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-cyan-500 opacity-80">
              Solo personal autorizado
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center"
        >
          <SaseNeuralCore size={160} />
        </motion.div>

        <div className="w-full max-w-sm space-y-5 flex flex-col">
          <div>
            <label className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase text-amber-400 tracking-widest">
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
              className="w-full p-4 bg-white/5 border border-amber-400/20 rounded-xl text-white text-sm outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase text-amber-400 tracking-widest">
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
              className="w-full p-4 bg-white/5 border border-amber-400/20 rounded-xl text-white text-sm outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-red-500 text-[10px] font-bold bg-red-500/10 py-2 rounded-lg"
            >
              ⚠️ {error}
            </motion.p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`
              w-full py-4 mt-2 rounded-xl font-black uppercase tracking-[0.15em] text-sm transition-all duration-300
              ${loading
                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                : 'bg-black/40 border border-cyan-500/50 text-white hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] active:scale-[0.98]'
              }
            `}
          >
            {loading ? "Iniciando Sesión..." : "Entrar al Sistema"}
          </button>

          <button
            onClick={() => navigate("/")}
            disabled={loading}
            className="w-full py-3 bg-transparent border border-white/5 rounded-xl text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] hover:text-white/50 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
        
        <div className="pt-4 text-center">
          <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold">
            Protocolo de Seguridad <span className="text-cyan-500/40">ESD-310-SASE</span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

