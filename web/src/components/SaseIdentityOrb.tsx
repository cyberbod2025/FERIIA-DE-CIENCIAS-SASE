import React from "react";

export type OrbState = "stable" | "alert" | "critical" | "imposing";

interface SaseIdentityOrbProps {
  state?: OrbState;
  size?: number;
  className?: string;
  showAccessories?: boolean;
}

const stateColors = {
  stable: {
    main: "#00C853", // Verde
    glow: "rgba(0, 200, 83, 0.4)",
    shimmer: "#4ade80",
  },
  alert: {
    main: "#FF9800", // Naranja
    glow: "rgba(255, 152, 0, 0.4)",
    shimmer: "#fbbf24",
  },
  critical: {
    main: "#D32F2F", // Rojo
    glow: "rgba(211, 47, 47, 0.4)",
    shimmer: "#f87171",
  },
  imposing: {
    main: "#0EA5E9", // Azul (Sky 500)
    glow: "rgba(14, 165, 233, 0.4)",
    shimmer: "#fff",
  },
};

export const SaseIdentityOrb: React.FC<SaseIdentityOrbProps> = ({
  state = "imposing",
  size = 300,
  className = "",
  showAccessories = false,
}) => {
  const colors = stateColors[state];

  return (
    <div
      className={`orb-wrapper ${className}`}
      style={{ "--orb-size": `${size}px` } as React.CSSProperties}
    >
      <div className="orb-container">
        {/* Accesorios de Domadora (Sombrero) */}
        {showAccessories && <div className="accessory hat">🎩</div>}

        {/* Plasma Exterior Ring 1 */}
        <div
          className="plasma-ring ring-1"
          style={{ borderTopColor: colors.glow }}
        ></div>
        {/* Plasma Exterior Ring 2 */}
        <div
          className="plasma-ring ring-2"
          style={{ borderBottomColor: colors.glow }}
        ></div>

        {/* Cuerpo del Orbe (Estructura 3D de Alta Densidad) */}
        <div
          className="main-orb"
          style={{
            background: `radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.9) 0%, ${colors.main} 40%, rgba(30, 58, 138, 0.9) 80%, rgba(2, 6, 23, 0.95) 100%)`,
            boxShadow: `0 0 100px 40px ${colors.glow}, inset -30px -30px 60px rgba(0, 0, 0, 0.8), inset 30px 30px 50px rgba(255, 255, 255, 0.4)`,
          }}
        >
          {/* Los Ojos */}
          <div className="eyes-container">
            <div className="eye"></div>
            <div className="eye"></div>
          </div>

          {/* Cabeza en la boca (Efecto Truco) */}
          {showAccessories && <div className="mouth-accessory">👦🏻</div>}
        </div>

        {/* Bigote (Fuera del main-orb para que no se corte por overflow hidden) */}
        {showAccessories && <div className="accessory mustache">👨🏻‍🦱</div>}
      </div>

      <style>{`
        .orb-wrapper {
          width: var(--orb-size);
          height: var(--orb-size);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .orb-container {
          position: relative;
          width: 70%;  /* Reducido para dejar espacio a accesorios y resplandor */
          height: 70%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: float 4s ease-in-out infinite;
        }
        .main-orb {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          z-index: 2;
          transition: background 0.5s ease, box-shadow 0.5s ease;
          animation: breathe 6s ease-in-out infinite;
        }
        .eyes-container {
          display: flex;
          gap: 40px;
        }
        .eye {
          width: 8px;
          height: 24px;
          background: white;
          border-radius: 999px;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
          animation: blink 5s infinite;
        }
        
        /* Accesorios */
        .accessory {
          position: absolute;
          z-index: 10;
          pointer-events: none;
        }
        .hat {
          top: -35%;
          left: 50%;
          transform: translateX(-50%);
          font-size: calc(var(--orb-size) * 0.35);
        }
        .mustache {
          bottom: 20%;
          left: 50%;
          transform: translateX(-50%);
          font-size: calc(var(--orb-size) * 0.18);
        }
        .mouth-accessory {
          position: absolute;
          bottom: 5%; /* Más abajo para que parezca la boca */
          left: 50%;
          transform: translateX(-50%);
          font-size: calc(var(--orb-size) * 0.12); /* Un poco más pequeña */
          z-index: 5; /* Por encima del fondo pero bajo los ojos si es necesario */
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
          pointer-events: none;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes blink {
          0%, 94%, 100% { transform: scaleY(1); }
          97% { transform: scaleY(0.05); }
        }
        .plasma-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid transparent;
          transition: border-color 0.5s ease;
          z-index: 1;
        }
        .ring-1 {
          inset: -15px;
          animation: spin 3s linear infinite;
        }
        .ring-2 {
          inset: -25px;
          animation: spin 5s linear reverse infinite;
          opacity: 0.6;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
