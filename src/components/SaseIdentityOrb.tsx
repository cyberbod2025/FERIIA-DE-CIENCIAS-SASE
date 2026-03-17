import React from "react";

export type OrbState = "stable" | "alert" | "critical" | "imposing";

interface FeriaIdentityOrbProps {
  state?: OrbState;
  size?: number;
  className?: string;
  showAccessories?: boolean;
}

const stateColors = {
  stable: {
    main: "#FFD700", // Gold Feria
    glow: "rgba(255, 215, 0, 0.3)",
    shimmer: "#06B6D4", // Cyan Core
  },
  alert: {
    main: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.3)",
    shimmer: "#fff7ed",
  },
  critical: {
    main: "#EF4444",
    glow: "rgba(239, 68, 68, 0.3)",
    shimmer: "#fef2f2",
  },
  imposing: {
    main: "#FFD700", 
    glow: "rgba(255, 215, 0, 0.5)",
    shimmer: "#06B6D4",
  },
};

export const FeriaIdentityOrb: React.FC<FeriaIdentityOrbProps> = ({
  state = "imposing",
  size = 300,
  className = "",
}) => {
  const colors = stateColors[state];

  return (
    <div
      className={`orb-wrapper ${className}`}
      style={{ "--orb-size": `${size}px` } as React.CSSProperties}
    >
      <div className="orb-container">
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

        {/* Cuerpo del Orbe (Núcleo de Ciencia Digital) */}
        <div
          className="main-orb"
          style={{
            background: `radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 1) 0%, ${colors.main} 40%, #854d0e 80%, #000 100%)`,
            boxShadow: `0 0 80px 10px ${colors.glow}, inset -15px -15px 40px rgba(0, 0, 0, 0.8), inset 15px 15px 30px rgba(255, 255, 255, 0.3)`,
            border: "1px solid rgba(255, 215, 0, 0.2)"
          }}
        >
          {/* Efecto de Energía Interna Cyan */}
          <div className="energy-core" style={{ background: `radial-gradient(circle, ${colors.shimmer} 0%, transparent 100%)` }}></div>
        </div>
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
          width: 80%;
          height: 80%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: float 6s ease-in-out infinite;
        }
        .main-orb {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          position: relative;
          z-index: 2;
          animation: breathe 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
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
