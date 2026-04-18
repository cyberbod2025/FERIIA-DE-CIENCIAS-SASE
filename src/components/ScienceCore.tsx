import React from "react";
import { motion } from "framer-motion";

/**
 * SCIENCE CORE - Redesigned to be more professional and less "creepy".
 * Removed the "eyes" (dots) and mouse tracking that felt intrusive.
 */
type Props = {
  size?: number;
  showAccessories?: boolean;
};

export const ScienceCore: React.FC<Props> = ({
  size = 300,
  showAccessories = true
}) => {
  const orbSize = size * 0.7;

  return (
    <div 
      style={{ 
        width: size, 
        height: size, 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        userSelect: 'none',
        pointerEvents: 'none'
      }}
    >
      {/* 1. HUD EXTERNO (Anillos de precisión abstractos) */}
      {showAccessories && (
        <div className="absolute inset-0 z-0 opacity-20">
          <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="95" fill="none" stroke="var(--primary)" strokeWidth="0.5" strokeDasharray="4 12" />
            <motion.circle 
               cx="100" cy="100" r="85" fill="none" stroke="var(--primary)" strokeWidth="1" strokeDasharray="20 180" 
               animate={{ rotate: 360 }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               style={{ originX: "100px", originY: "100px" }}
            />
          </svg>
        </div>
      )}

      {/* 2. ATMÓSFERA BIOLUMINISCENTE */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 4, repeat: Infinity, ease: "easeInOut" 
        }}
        style={{
          position: 'absolute',
          inset: '10%',
          borderRadius: '9999px',
          filter: 'blur(40px)',
          background: "radial-gradient(circle, var(--primary), var(--tertiary))"
        }}
      />

      {/* 3. EL ORBE (Energía Pura) */}
      <div 
        style={{
          position: 'relative',
          width: orbSize,
          height: orbSize,
          borderRadius: '9999px',
          border: '1px solid var(--outline-variant)',
          boxShadow: 'inset 0 0 20px rgba(0, 165, 233, 0.1), 0 10px 30px rgba(0, 0, 0, 0.05)',
          background: "var(--surface)",
          overflow: 'hidden'
        }}
      >
        {/* Capas de Plasma Abstractas */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            inset: '-20%',
            opacity: 0.1,
            background: "conic-gradient(from 0deg, var(--primary), var(--secondary), var(--primary))",
            filter: 'blur(20px)'
          }}
        />
        
        {/* Reflejos Centrales */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div 
              style={{
                width: orbSize * 0.2,
                height: orbSize * 0.2,
                backgroundColor: 'var(--primary)',
                borderRadius: '9999px',
                filter: 'blur(8px)',
                opacity: 0.3
              }}
              className="animate-pulse" 
            />
        </div>
      </div>
    </div>
  );
};


