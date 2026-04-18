import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ShieldAlert, ArrowLeft, Terminal } from "lucide-react";
import { supabase } from "../lib/supabase";
import { ScienceCore } from "../components/ScienceCore";

export const TeacherLoginView: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("Se requieren credenciales de mando.");
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
      setError("Acceso denegado: Credenciales no válidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center px-6 py-12 gap-10 max-w-md mx-auto w-full flex-1">
        
        {/* Security Header */}
        <div className="w-full text-center space-y-2">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--error-container)]/10 border border-[var(--error-container)]/20 rounded-full mb-3">
              <ShieldAlert size={12} className="text-[var(--error)]" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[var(--error)]">
                Acceso limitado
              </span>
            </div>
            <h1 className="text-4xl font-[var(--font-display)] font-black leading-none tracking-tighter">
              PANEL DE <span className="text-[var(--primary)]">CONTROL</span>
            </h1>
            <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40 mt-2">
              Panel docente • ESD-310
            </p>
          </motion.div>
        </div>

        {/* Neural Core Security Agent */}
        <div className="relative">
          <ScienceCore size={180} />
          <div className="absolute inset-0 bg-transparent rounded-full shadow-[inset_0_0_30px_rgba(255,180,171,0.05)]" />
        </div>

        {/* Auth Form */}
        <div className="w-full space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--outline)]">
                <Mail size={12} /> Correo institucional
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="docente@esd310.edu.mx"
                className="w-full h-14 px-5 bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/20 rounded-xl text-[var(--on-background)] font-[var(--font-body)] focus:outline-none focus:border-[var(--primary)]/50 transition-all placeholder:opacity-20"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--outline)]">
                <Lock size={12} /> Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                className="w-full h-14 px-5 bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/20 rounded-xl text-[var(--on-background)] font-[var(--font-body)] focus:outline-none focus:border-[var(--primary)]/50 transition-all placeholder:opacity-20"
              />
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-[var(--error-container)]/10 border border-[var(--error-container)]/30 rounded-xl flex items-center gap-3">
              <div className="size-1.5 rounded-full bg-[var(--error)] animate-pulse" />
              <p className="text-[10px] font-bold text-[var(--error)] uppercase">{error}</p>
            </motion.div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full h-16 rounded-2xl font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center transition-all ${
                loading 
                ? "bg-[var(--surface-container-high)] text-opacity-30 cursor-not-allowed"
                : "bg-[var(--primary)] text-[var(--on-primary)] hover:scale-[1.02] active:scale-[0.98] action-glow"
              }`}
            >
              {loading ? "Verificando..." : "Entrar al Sistema"}
            </button>
            
            <button
              onClick={() => navigate("/")}
              className="w-full py-4 text-[9px] font-black uppercase tracking-[0.4em] text-[var(--on-surface-variant)] opacity-40 hover:opacity-100 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={12} /> Volver al acceso principal
            </button>
          </div>
        </div>

        {/* HUD Footer */}
        <div className="mt-8 pt-8 border-t border-white/5 w-full flex justify-between items-center opacity-20">
          <div className="flex items-center gap-2">
            <Terminal size={12} />
            <span className="text-[8px] font-mono tracking-tighter">SECURE_BOOT_v4.0</span>
          </div>
          <span className="text-[8px] font-mono tracking-tighter">AES-256_ENCRYPTED</span>
        </div>
      </div>
    </Layout>
  );
};



