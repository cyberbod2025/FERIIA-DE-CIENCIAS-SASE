import React from "react";
import { Layout } from "../components/Layout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Target, ChevronRight, Binary, Zap, ShieldCheck } from "lucide-react";
import { ScienceCore } from "../components/ScienceCore";
import { getStudentSession } from "../lib/studentSession";

export const TutorialView: React.FC = () => {
  const navigate = useNavigate();
  const { studentName } = getStudentSession();
  const userName = studentName || "Investigador";

  return (
    <Layout title="Guía de la feria">
      <div className="flex flex-col gap-8 px-6 py-10 pb-40 flex-1">
        
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="premium-card p-8 bg-gradient-to-br from-[var(--primary-container)]/30 to-white text-center"
        >
          <div className="flex justify-center mb-6">
            <ScienceCore size={140} />
          </div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-[var(--primary)] text-3xl font-[var(--font-display)] font-black tracking-tight mb-2 uppercase leading-none">
              ¡Hola, <br/>{userName.split(' ')[0]}!
            </h2>
            <p className="text-[12px] font-bold text-[var(--on-surface-variant)] leading-relaxed uppercase opacity-40 tracking-wider">
              Tu recorrido por la Feria de Ciencias 2026 ESD-310 está listo para comenzar.
            </p>
          </motion.div>
        </motion.div>

        {/* Instructions Grid */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black tracking-[0.4em] uppercase opacity-20">Instrucciones de Campo</span>
            <div className="h-px flex-1 bg-[var(--outline-variant)]/30" />
          </div>

          {[
            { 
              icon: <Target className="text-[var(--secondary)]" size={20} />, 
              title: "Objetivo Principal", 
              desc: "Recorre los stands de la feria, descubre experimentos y completa tu ruta científica." 
            },
            { 
              icon: <Binary className="text-[var(--primary)]" size={20} />, 
              title: "Check-in QR", 
              desc: "Escanea el código QR de cada stand para registrar tu visita y activar la trivia." 
            },
            { 
              icon: <Zap className="text-[var(--tertiary)]" size={20} />, 
              title: "Trivia Relámpago", 
              desc: "Responde la trivia final después de cada explicación para sumar puntos en el ranking." 
            }
          ].map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="premium-card p-4 flex gap-5 items-start bg-white/50"
            >
              <div className="size-12 rounded-2xl bg-[var(--surface-container)] flex items-center justify-center shrink-0 border border-[var(--outline-variant)]/20 shadow-sm">
                {step.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-[var(--on-background)] uppercase tracking-tight">{step.title}</h3>
                <p className="text-[11px] text-[var(--on-surface-variant)] leading-snug opacity-60 font-bold">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Confirmation HUD Button */}
        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--secondary-container)] rounded-2xl border border-[var(--secondary)]/10">
            <ShieldCheck size={14} className="text-[var(--secondary)]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--on-secondary-container)]">Inducción completada al 100%</span>
          </div>

          <button
            onClick={() => navigate("/mapa")}
            className="w-full h-16 bg-[var(--on-background)] text-white rounded-3xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            Ver mapa de la feria <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </Layout>
  );
};



