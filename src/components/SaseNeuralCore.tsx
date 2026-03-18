import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * SASE NEURAL CORE - Versión de Identidad Pura
 * Un orbe iridiscente 3D con ojos interactivos y HUD táctico.
 * Refactorizado para máxima estabilidad sin depender de clases externas de layout.
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

  const orbSize = size * 0.75;

  return (
    <div 
      style={{ 
        width: size, 
        height: size, 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        userSelect: 'none'
      }}
    >
      {/* 1. HUD EXTERNO (Anillos de precisión dorados) */}
      {showAccessories && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.6 }}>
          <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 200">
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
        style={{
          position: 'absolute',
          inset: '16px',
          borderRadius: '9999px',
          filter: 'blur(60px)',
          opacity: 0.4,
          background: "conic-gradient(from 0deg, #3b82f6, #06b6d4, #8b5cf6, #ec4899, #f59e0b, #3b82f6)"
        }}
      />

      {/* 3. EL ORBE (Esfera de Cristal Irradiante) */}
      <div 
        style={{
          position: 'relative',
          width: orbSize,
          height: orbSize,
          borderRadius: '9999px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
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
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.6,
            filter: 'blur(24px)',
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
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.5,
            filter: 'blur(32px)',
            background: "radial-gradient(circle at center, #06b6d4 0%, #3b82f6 60%, transparent 100%)",
            mixBlendMode: "overlay"
          }}
        />

        {/* 4. ROSTRO (Ojos Verticales Blancos) */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div 
            style={{
              display: 'flex',
              gap: orbSize * 0.1, // Distancia proporcional entre ojos
              transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
              transform: `translate(${mousePos.x * (orbSize * 0.05)}px, ${mousePos.y * (orbSize * 0.05)}px)`
            }}
          >
            <div 
              style={{
                width: orbSize * 0.03,
                height: orbSize * 0.1,
                backgroundColor: 'white',
                borderRadius: '9999px',
                boxShadow: '0 0 20px white'
              }}
              className="animate-sase-blink" 
            />
            <div 
              style={{
                width: orbSize * 0.03,
                height: orbSize * 0.1,
                backgroundColor: 'white',
                borderRadius: '9999px',
                boxShadow: '0 0 20px white'
              }}
              className="animate-sase-blink-delayed" 
            />
          </div>
        </div>

        {/* Brillo de Superficie */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
      </div>

      {/* 5. ESCANEO (Línea Pulsante) */}
      {showAccessories && (
        <motion.div 
          animate={{ top: ["20%", "80%", "20%"], opacity: [0, 0.3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            left: '20%',
            right: '20%',
            height: '1px',
            backgroundColor: 'white',
            zIndex: 10,
            filter: 'blur(1px)',
            pointerEvents: 'none'
          }}
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
