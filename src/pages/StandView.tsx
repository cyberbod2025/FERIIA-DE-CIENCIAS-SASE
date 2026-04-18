import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { Star, Map as MapIcon, Tent, User, Info, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const StandView: React.FC = () => {
  const [comment, setComment] = useState("");

  return (
    <Layout title="Interacción con Stand">
      <div className="bg-gradient-to-br from-primary to-primary-dim px-6 py-8 relative overflow-hidden">
        <div className="flex gap-2 mb-4 relative z-10">
          <span className="badge-tag badge-tag-physics">
            🔭 FÍSICA
          </span>
          <span className="badge-tag badge-tag-secondary">
            3° Grupo B
          </span>
        </div>
        <h1 className="font-display font-black text-3xl text-primary-fixed leading-tight mb-2 relative z-10">
          La Magia de la Gravedad
        </h1>
        <p className="text-sm text-on-primary/70 relative z-10">
          ¡El Espectáculo Continúa!
        </p>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="px-6 py-4 bg-surface-container-low/30 border-b border-outline-variant/20">
        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 mb-2">
          TU PROGRESO EN LA FUNCIÓN
        </p>
        <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "60%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="dynamic-progress-fill progress-fill-premium"
            style={{ "--progress-width": "60%" } as React.CSSProperties}
          />
        </div>
        <div className="flex justify-between items-center mt-3 text-[10px] font-bold">
          <span className="text-primary flex items-center gap-1">
             ⭐ 350 puntos
          </span>
          <span className="text-on-surface-variant opacity-60">
            3 de 5 stands visitados
          </span>
        </div>
      </div>

      <div className="flex-1 px-6 py-8 space-y-6 overflow-y-auto">
        {/* TRIVIA CARD */}
        <div className="science-card-gradient">
          <div className="flex items-center gap-2 mb-4">
             <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed text-[10px] font-black rounded-full uppercase tracking-widest inline-flex items-center gap-2">
                <Sparkles size={12} /> Desafío del Mago
             </span>
          </div>
          <p className="text-lg font-medium text-white mb-6 leading-relaxed">
            ¿Cuál es la fuerza invisible que mantiene a los planetas en órbita alrededor del sol?
          </p>
          <div className="grid grid-cols-1 gap-3">
            {[
              "Fuerza Electromagnética",
              "Fuerza Gravitacional",
              "Fuerza Nuclear Fuerte",
              "Tensión Superficial",
            ].map((opt, i) => (
              <button
                key={i}
                className={`text-left p-4 rounded-xl border transition-all text-sm font-medium ${
                  opt === "Fuerza Gravitacional" 
                  ? "bg-primary/20 border-primary text-white" 
                  : "bg-white/5 border-white/10 text-white/70"
                }`}
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-current mr-3 text-[10px] font-black">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* CURIOSITY CARD */}
        <div className="curiosity-card">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Info size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Dato Curioso</p>
            <p className="text-sm text-on-surface leading-relaxed font-medium">
              Si pudieras saltar en la Luna, ¡tu salto sería 6 veces más alto!
            </p>
          </div>
        </div>

        {/* COMMENTS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">🎟️ Preguntómetro</span>
          </div>
          <div className="space-y-3">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="¡Escribe tu pregunta anónima al expositor!"
              className="comment-input-area min-h-[100px]"
            />
            <button className="interactive-button-full shadow-lg">
              🌟 ¡Enviar Pregunta!
            </button>
          </div>
        </div>
      </div>
      
      {/* Fake Navigation for preview */}
      <nav className="fixed bottom-0 w-full max-w-md mx-auto bg-surface-container-highest/80 backdrop-blur-xl border-t border-outline-variant/20 px-8 py-4 flex justify-around items-center">
          <Star className="text-primary" />
          <MapIcon className="text-on-surface-variant opacity-40" />
          <Tent className="text-on-surface-variant opacity-40" />
          <User className="text-on-surface-variant opacity-40" />
      </nav>
    </Layout>
  );
};
