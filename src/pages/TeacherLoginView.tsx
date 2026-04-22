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
      setError("Acceso no autorizado. Verifica tus datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Control Docente">
      <div className="flex flex-col items-center justify-center min-h-full p-6 pt-10 pb-20 relative overflow-hidden">
        {/* Ambient background effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px] text-center mb-10">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Panel de <span className="text-cyan-400">Control</span>
          </h1>
          <p className="mt-2 text-[10px] font-bold tracking-[0.4em] uppercase text-white/30">
            Personal Autorizado
          </p>
        </motion.div>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }} className="relative mb-12">
          <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <SaseNeuralCore size={140} />
        </motion.div>

        <div className="w-full max-w-[360px] space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="surface-card-strong p-6 border border-white/5">
            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-cyan-400">
                  <Mail size={12} /> Correo Institucional
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="docente@escuela.mx"
                  className="w-full h-14 px-5 text-sm text-white placeholder:text-white/20 transition-all border outline-none bg-black/40 border-white/10 focus:border-cyan-400/30 rounded-xl"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-cyan-400">
                  <Lock size={12} /> Clave de Acceso
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="********"
                  className="w-full h-14 px-5 text-sm text-white placeholder:text-white/20 transition-all border outline-none bg-black/40 border-white/10 focus:border-cyan-400/30 rounded-xl"
                />
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 border bg-red-500/10 border-red-500/20 rounded-xl text-center">
                  <span className="text-[11px] font-bold text-red-400">⚠️ {error}</span>
                </motion.div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className={`w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl ${
                  loading ? "opacity-50 cursor-not-allowed bg-white/5" : "bg-gradient-to-br from-cyan-500 to-blue-700 text-white shadow-cyan-500/10 active:scale-95"
                }`}
              >
                {loading ? "Sincronizando..." : "Entrar al Sistema"}
              </button>
            </div>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate("/")}
            className="w-full py-4 text-[10px] font-black tracking-[0.3em] uppercase text-white/20 hover:text-white/50 transition-colors"
          >
            Volver al Inicio
          </motion.button>
        </div>
        
        <div className="mt-12 text-center opacity-20">
          <p className="text-[9px] font-black tracking-[0.3em] uppercase text-white">
            Protocolo ESD-310-SASE
          </p>
        </div>
      </div>
    </Layout>
  );
};

