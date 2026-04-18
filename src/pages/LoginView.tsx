import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Users, ArrowRight, Loader2, Sparkles, School, ShieldAlert } from "lucide-react";
import { supabase } from "../lib/supabase";
import { saveStudentSession } from "../lib/studentSession";
import { motion, AnimatePresence } from "framer-motion";

// Lista de 12 grupos institucionales
const GRUPOS = [
  "1°A", "1°B", "1°C", "1°D",
  "2°A", "2°B", "2°C", "2°D",
  "3°A", "3°B", "3°C", "3°D",
];

// Filtro de seguridad básico (expandible)
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
  const navigate = useNavigate();

  // Función para manejar el cambio de texto forzando MAYÚSCULAS
  const handleUpperChange = (val: string, setter: (v: string) => void) => {
    setter(val.toUpperCase());
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación de campos vacíos
    if (!nombre.trim() || !paterno.trim() || !grupo) {
      setError("TODOS LOS CAMPOS SON OBLIGATORIOS");
      return;
    }

    const fullName = `${nombre.trim()} ${paterno.trim()}`;
    
    // Verificación de seguridad (Palabras prohibidas)
    const hasBannedWord = BANNED_WORDS.some(word => 
      fullName.includes(word) || grupo.includes(word)
    );

    if (hasBannedWord) {
      setError("NOMBRE O CONTENIDO NO PERMITIDO POR SEGURIDAD");
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
      if (!data?.success || !data.student_id || !data.session_token) {
        throw new Error(data?.message || "ERROR EN LA SECUENCIA DE ACCESO");
      }

      saveStudentSession({
        studentId: data.student_id,
        studentName: fullName,
        studentGroup: grupo,
        sessionToken: data.session_token,
      });

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "ERROR DE CONEXIÓN CON EL SERVIDOR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col font-body selection:bg-primary/20">
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/10 backdrop-blur-3xl border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-primary translate-y-[-1px]">
            <Sparkles size={22} fill="currentColor" />
          </div>
          <span className="text-lg font-bold text-primary font-headline tracking-tighter uppercase">DIURNA 310</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <School size={16} className="text-primary" />
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel max-w-5xl w-full rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative min-h-[620px] border border-white/30"
        >
          
          {/* LADO IZQUIERDO: VISUAL */}
          <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-between bg-primary/[0.03] border-r border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center px-3 py-1 bg-white/40 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/40 backdrop-blur-md mb-6">
                Acceso Estudiantil
              </div>
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-on-primary-container leading-[1.1] tracking-tight mb-6">
                SECUNDARIA <br/> <span className="text-primary">DIURNA 310</span>
              </h2>
              <p className="text-on-surface-variant text-base font-light leading-relaxed max-w-xs uppercase opacity-70">
                PRESIDENTES DE MÉXICO. <br/>
                <span className="font-medium text-primary/80">FERIA DE CIENCIAS 2026.</span>
              </p>
            </div>

            <div className="relative z-10 mt-12 md:mt-0 space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/60 backdrop-blur-md shadow-sm border border-white/40">
                  <ShieldAlert size={24} className="text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface uppercase">Sistema Seguro</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Validación de identidad escolar</p>
                </div>
              </div>

              <div className="relative h-44 w-full rounded-3xl overflow-hidden shadow-2xl group border border-white/40 lg:block hidden">
                <img 
                  alt="Ciencia" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFjIZjPt6KeLJ41mjQj0UWvBFblF4gF3edi210CM6PFpjSb69We5KOgHOPfip6_gBgWz9MXZdiODFXKyQdE6OgunMXYeg6hHhzIZvZvOaYwwEShX3kabZH2UtwLQZ3amq9cxi6PnZHK6FEk1wwUVAJ1n0AcyXlR8O7UOeECzbg355UcyGhwlG6On8k3EiQqMfxAH71vu95K-SQ0hGJXVug_SKwgAmXYMAJV9aJIdvQoP0FuIY3iKdLclGRpOxYmhNNejkhQd_ukOjr" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white uppercase font-bold text-xs tracking-widest">
                  Laboratorio de Innovación
                </div>
              </div>
            </div>
          </div>

          {/* LADO DERECHO: FORMULARIO */}
          <div className="w-full md:w-1/2 p-10 md:p-14 bg-white/20 backdrop-blur-xl flex flex-col justify-center">
            <div className="mb-10 text-center md:text-left">
              <h1 className="font-headline text-4xl font-bold text-on-surface mb-2 uppercase">Bienvenido</h1>
              <p className="text-on-surface-variant text-xs uppercase tracking-wider opacity-60">Ingresa tus datos institucionales</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-error-container/10 border border-error/20 rounded-2xl text-error text-[10px] font-black text-center uppercase tracking-[0.1em]"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-on-surface-variant ml-1 tracking-[0.2em] uppercase opacity-40">Nombre(s)</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="ESTEBAN"
                    className="w-full bg-white/40 border border-outline-variant/30 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-outline/20 text-on-surface font-black uppercase tracking-wider text-sm backdrop-blur-sm"
                    value={nombre}
                    onChange={(e) => handleUpperChange(e.target.value, setNombre)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-on-surface-variant ml-1 tracking-[0.2em] uppercase opacity-40">Apellido Paterno</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="VALENCIA"
                    className="w-full bg-white/40 border border-outline-variant/30 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-outline/20 text-on-surface font-black uppercase tracking-wider text-sm backdrop-blur-sm"
                    value={paterno}
                    onChange={(e) => handleUpperChange(e.target.value, setPaterno)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-on-surface-variant ml-1 tracking-[0.2em] uppercase opacity-40">Grupo</label>
                <div className="relative group">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" size={16} />
                  <select
                    required
                    title="Selecciona tu grupo escolar"
                    className="w-full appearance-none bg-white/40 border border-outline-variant/30 rounded-2xl py-4 pl-12 pr-10 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-on-surface font-black uppercase tracking-wider text-sm backdrop-blur-sm cursor-pointer"
                    value={grupo}
                    onChange={(e) => { setGrupo(e.target.value); setError(""); }}
                  >
                    <option value="">SELECCIONA GRUPO</option>
                    {GRUPOS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-primary/30 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-300 mt-6 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    VALIDANDO...
                  </>
                ) : (
                  <>
                    INGRESAR RALLY
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex flex-col items-center gap-6">
              <button 
                onClick={() => navigate("/panel/login")}
                className="text-[9px] text-outline uppercase tracking-[0.4em] font-black opacity-30 hover:opacity-100 transition-all"
              >
                ACCESO MAESTROS
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="h-16 w-full flex items-center justify-center px-6">
        <p className="text-[9px] text-outline/40 font-black uppercase tracking-[0.4em]">© 2026 ESCUELA SECUNDARIA DIURNA 310</p>
      </footer>
    </div>
  );
};




