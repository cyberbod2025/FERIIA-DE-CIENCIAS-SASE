import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Smartphone, Microscope, Trophy } from "lucide-react";
import { ScienceCore } from "../components/ScienceCore";

export const IntroView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-[var(--background)] overflow-hidden flex flex-col items-center selection:bg-primary/20">
      {/* DECORACIÓN DINÁMICA DE FONDO */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[120px]" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center px-6 pt-20 pb-32">
        
        {/* HERO SECTION: NÚCLEO CIENTÍFICO */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] animate-pulse" />
          <ScienceCore size={240} />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-20px] border border-dashed border-primary/20 rounded-full"
          />
        </motion.div>

        {/* TEXTO DE BIENVENIDA */}
        <div className="text-center space-y-6 max-w-2xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full text-primary"
          >
            <Sparkles size={16} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Diurna 310 • Institucional</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-headline font-bold text-on-background leading-[0.95] tracking-tighter uppercase"
          >
             Feria de <br />
            <span className="text-primary">Ciencias 2026</span>
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-8 mt-12"
          >
            {/* SECCIÓN DE OBJETIVOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel p-6 rounded-3xl border border-white/30 text-left space-y-3 bg-white/40 backdrop-blur-xl">
                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                  <Microscope size={20} />
                </div>
                <h3 className="font-headline font-bold text-sm uppercase">La Feria</h3>
                <p className="text-[11px] leading-relaxed text-on-surface-variant uppercase opacity-70">
                  Un espacio para investigar, experimentar y descubrir el impacto de la ciencia en nuestro entorno diario.
                </p>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-white/30 text-left space-y-3 bg-white/40 backdrop-blur-xl">
                <div className="size-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/10">
                  <Smartphone size={20} />
                </div>
                <h3 className="font-headline font-bold text-sm uppercase">La App</h3>
                <p className="text-[11px] leading-relaxed text-on-surface-variant uppercase opacity-70">
                  Tu portal interactivo para escanear stands, resolver trivias y optimizar tu recorrido científico.
                </p>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-white/30 text-left space-y-3 bg-white/40 backdrop-blur-xl">
                <div className="size-10 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary border border-tertiary/10">
                  <Trophy size={20} />
                </div>
                <h3 className="font-headline font-bold text-sm uppercase">Rally</h3>
                <p className="text-[11px] leading-relaxed text-on-surface-variant uppercase opacity-70">
                  Acumula puntos de ciencia, compite contra otros grupos y gana tu diploma de honor científico.
                </p>
              </div>
            </div>

            <p className="text-on-surface-variant text-sm font-medium leading-relaxed max-w-lg mx-auto uppercase opacity-50 tracking-wide">
              Misión: Impulsar la innovación y el talento de los Presidentes de México a través de la tecnología.
            </p>
          </motion.div>
        </div>

        {/* ACCIÓN PRINCIPAL */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-xs mt-12"
        >
          <button
            onClick={() => navigate("/login")}
            className="w-full py-6 rounded-3xl bg-primary text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-primary/40 hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center justify-center gap-4 group"
          >
            Comenzar aventura
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </main>

      {/* FOOTER DISCRETO */}
      <footer className="fixed bottom-0 w-full h-20 bg-gradient-to-t from-[var(--background)] to-transparent flex items-center justify-center z-20 pointer-events-none">
        <p className="text-[9px] font-black text-outline/30 uppercase tracking-[0.5em]">Escuela Secundaria Diurna 310 • 2026</p>
      </footer>
    </div>
  );
};
