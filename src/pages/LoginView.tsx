import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Users, ArrowRight, Loader2, Sparkles, School, Microscope } from "lucide-react";
import { supabase } from "../lib/supabase";
import { saveStudentSession } from "../lib/studentSession";
import { motion, AnimatePresence } from "framer-motion";

const GRUPOS = [
  "1°A", "1°B", "1°C", "1°D",
  "2°A", "2°B", "2°C", "2°D",
  "3°A", "3°B", "3°C", "3°D",
];

const BANNED_WORDS = [
  "CULO", "PENE", "PUTO", "PUTA", "PENDEJO", "MIERDA", "ZORRA", "VERGA", 
  "CHINGA", "CABRON", "JOTO", "MARICA", "IDOTA", "TONTO", "ESTUPIDO"
];

export const LoginView: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [paterno, setPaterno] = useState("");
  const [grupo, setGrupo] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [perfil, setPerfil] = useState<"alumno" | "maestro">("alumno");
  const navigate = useNavigate();

  const handleUpperChange = (val: string, setter: (v: string) => void) => {
    setter(val.toUpperCase());
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (perfil === "maestro") {
        navigate("/panel/login");
        return;
    }
    
    if (!nombre.trim() || !paterno.trim() || !grupo) {
      setError("TODOS LOS CAMPOS SON OBLIGATORIOS");
      return;
    }

    const fullName = `${nombre.trim()} ${paterno.trim()}`;
    const hasBannedWord = BANNED_WORDS.some(word => 
      fullName.includes(word) || grupo.includes(word)
    );

    if (hasBannedWord) {
      setError("CONTENIDO NO PERMITIDO POR SEGURIDAD");
      return;
    }

    setLoading(true);

    try {
      const grado = parseInt(grupo.charAt(0));
      const { data, error: rpcError } = await supabase.rpc("issue_student_session", {
        p_nickname: fullName,
        p_grupo: grupo,
        p_grado: grado,
      });

      if (rpcError) throw rpcError;
      if (!data?.success) throw new Error(data?.message || "ERROR DE ACCESO");

      saveStudentSession({
        studentId: data.student_id,
        studentName: fullName,
        studentGroup: grupo,
        sessionToken: data.session_token,
      });

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "ERROR DE CONEXIÓN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-body selection:bg-primary/20">
      
      {/* HEADER INSTITUCIONAL */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/10 backdrop-blur-3xl border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3">
          <Microscope className="text-primary" size={24} />
          <span className="text-lg font-bold text-primary font-headline tracking-tight">DIURNA 310</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-on-surface-variant font-medium text-sm hidden md:block uppercase tracking-widest opacity-60">Feria de Ciencias 2026</span>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <School size={16} className="text-primary" />
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel max-w-4xl w-full rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
        >
          
          {/* LADO IZQUIERDO: VISUAL */}
          <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-between bg-white/5 border-r border-white/10">
            <div>
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-on-primary-container leading-tight tracking-tight mb-4">
                SECUNDARIA <br/> <span className="text-primary">DIURNA 310</span>
              </h2>
              <p className="text-on-surface-variant text-lg font-light leading-relaxed max-w-xs uppercase opacity-70">
                Presidentes de México. <br/>
                <span className="font-bold text-primary">Portal Académico Digital.</span>
              </p>
            </div>

            <div className="mt-12 md:mt-0">
               <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-2xl bg-surface-container-high/50 backdrop-blur-md">
                    <Sparkles size={24} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface uppercase">Innovación Educativa</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Ciencia y tecnología escolar</p>
                  </div>
               </div>

               <div className="relative h-44 w-full rounded-2xl overflow-hidden shadow-inner group">
                <img 
                  alt="Institutional" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFjIZjPt6KeLJ41mjQj0UWvBFblF4gF3edi210CM6PFpjSb69We5KOgHOPfip6_gBgWz9MXZdiODFXKyQdE6OgunMXYeg6hHhzIZvZvOaYwwEShX3kabZH2UtwLQZ3amq9cxi6PnZHK6FEk1wwUVAJ1n0AcyXlR8O7UOeECzbg355UcyGhwlG6On8k3EiQqMfxAH71vu95K-SQ0hGJXVug_SKwgAmXYMAJV9aJIdvQoP0FuIY3iKdLclGRpOxYmhNNejkhQd_ukOjr"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              </div>
            </div>
          </div>

          {/* LADO DERECHO: FORMULARIO */}
          <div className="w-full md:w-1/2 p-10 md:p-14 bg-white/10 backdrop-blur-md">
            <div className="mb-10 text-center md:text-left">
              <h1 className="font-headline text-3xl font-bold text-on-surface mb-2 uppercase">Bienvenido</h1>
              <p className="text-on-surface-variant text-sm uppercase opacity-60">Selecciona tu perfil institucional</p>
            </div>

            {/* TOGGLE PERFIL */}
            <div className="flex p-1.5 bg-surface-container-low/60 rounded-2xl mb-10 border border-outline-variant/20 backdrop-blur-sm">
                <button 
                  onClick={() => setPerfil("alumno")}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all duration-300 uppercase tracking-widest ${perfil === "alumno" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:bg-white/40"}`}
                >
                  Alumno
                </button>
                <button 
                  onClick={() => setPerfil("maestro")}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all duration-300 uppercase tracking-widest ${perfil === "maestro" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:bg-white/40"}`}
                >
                  Maestro
                </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-error-container/10 border border-error/20 rounded-xl text-error text-[10px] font-black text-center uppercase"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant ml-1 tracking-widest uppercase opacity-40">Nombre(s)</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Escribre tu nombre"
                    className="w-full bg-white/30 border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-outline/40 text-on-surface font-black uppercase text-sm backdrop-blur-sm"
                    value={nombre}
                    onChange={(e) => handleUpperChange(e.target.value, setNombre)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant ml-1 tracking-widest uppercase opacity-40">Apellido Paterno</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Escribe tu apellido"
                    className="w-full bg-white/30 border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-outline/40 text-on-surface font-black uppercase text-sm backdrop-blur-sm"
                    value={paterno}
                    onChange={(e) => handleUpperChange(e.target.value, setPaterno)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant ml-1 tracking-widest uppercase opacity-40">Grupo Escolar</label>
                <div className="relative group">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={18} />
                  <select
                    required
                    title="Selecciona tu grupo"
                    className="w-full appearance-none bg-white/30 border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-10 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-on-surface font-black uppercase text-sm backdrop-blur-sm"
                    value={grupo}
                    onChange={(e) => { setGrupo(e.target.value); setError(""); }}
                  >
                    <option value="">SELECCIONA TU GRUPO</option>
                    {GRUPOS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="liquid-button w-full py-5 rounded-2xl text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : "INGRESAR"}
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="mt-10 flex flex-col items-center gap-4">
               <button className="text-[10px] font-black text-primary hover:text-on-primary-container transition-all flex items-center gap-2 uppercase tracking-widest">
                  ¿Necesitas ayuda con tu acceso?
               </button>
               <p className="text-[10px] text-outline uppercase tracking-[0.4em] font-black opacity-30">Secretaría de Educación Pública</p>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="h-16 w-full flex items-center justify-center px-6">
        <p className="text-[10px] text-outline/40 font-black uppercase tracking-[0.4em]">© 2026 Escuela Secundaria Diurna 310</p>
      </footer>
    </div>
  );
};
