import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * SASE NEURAL CORE - Versión de Identidad Pura
 * Un orbe iridiscente 3D con ojos interactivos y HUD táctico.
 */
type Props = {
  size?: number;
  showAccessories?: boolean;
};

export const SaseNeuralCore: React.FC<Props> = ({
  size = 300,
  showAccessories = true,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Seguimiento del cursor para que el "rostro" te mire
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div 
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {/* 1. HUD EXTERNO (Anillos de precisión dorados) */}
      {showAccessories && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="95" fill="none" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="4 12" />
            <circle cx="100" cy="100" r="88" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="80 120" opacity="0.3" />
            <motion.path 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ originX: "100px", originY: "100px" }}
              d="M50 20 A90 90 0 0 1 150 20" 
              fill="none" stroke="#fbbf24" strokeWidth="0.8" 
            />
            <path d="M100 5 L100 15 M195 100 L185 100 M100 195 L100 185 M5 100 L15 100" stroke="#fbbf24" strokeWidth="1" />
          </svg>
        </div>
      )}

      {/* 2. ATMÓSFERA IRIDISCENTE (Efecto de aura multicolor) */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1] 
        }}
        transition={{ 
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute inset-4 rounded-full blur-[60px] opacity-40"
        style={{
          background: "conic-gradient(from 0deg, #3b82f6, #06b6d4, #8b5cf6, #ec4899, #f59e0b, #3b82f6)"
        }}
      />

      {/* 3. EL ORBE (Esfera de Cristal Irradiante) */}
      <div 
        className="relative w-[75%] h-[75%] rounded-full overflow-hidden border border-white/20 shadow-2xl"
        style={{
          background: "radial-gradient(circle at 30% 30%, #fff 0%, #3b82f6 20%, #8b5cf6 50%, #1e1b4b 100%)",
        }}
      >
        {/* Capas de Fluido de Plasma (Animación 3D simulada) */}
        <motion.div
          animate={{ 
            x: [0, 20, -20, 0],
            y: [0, -20, 20, 0],
            scale: [1, 1.2, 0.9, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-60 blur-2xl"
          style={{
            background: "radial-gradient(circle at center, #ec4899 0%, #f59e0b 50%, transparent 100%)",
            mixBlendMode: "screen"
          }}
        />
        
        <motion.div
          animate={{ 
            x: [0, -30, 30, 0],
            y: [0, 30, -30, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-50 blur-3xl"
          style={{
            background: "radial-gradient(circle at center, #06b6d4 0%, #3b82f6 60%, transparent 100%)",
            mixBlendMode: "overlay"
          }}
        />

        {/* 4. ROSTRO (Ojos Verticales Blancos) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="flex gap-6 transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`
            }}
          >
            <div className="w-2 h-7 bg-white rounded-full shadow-[0_0_20px_white] animate-sase-blink" />
            <div className="w-2 h-7 bg-white rounded-full shadow-[0_0_20px_white] animate-sase-blink-delayed" />
          </div>
        </div>

        {/* Brillo de Superficie */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* 5. ESCANEO (Línea Pulsante) */}
      {showAccessories && (
        <motion.div 
          animate={{ top: ["20%", "80%", "20%"], opacity: [0, 0.3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[20%] right-[20%] h-[1px] bg-white z-10 blur-[1px] pointer-events-none"
        />
      )}

      <style>{`
        @keyframes sase-blink {
          0%, 94%, 100% { transform: scaleY(1); opacity: 1; }
          97% { transform: scaleY(0.1); opacity: 0.5; }
        }
        .animate-sase-blink { animation: sase-blink 4s infinite 1.5s; }
        .animate-sase-blink-delayed { animation: sase-blink 4s infinite 1.8s; }
      `}</style>
    </div>
  );
};
