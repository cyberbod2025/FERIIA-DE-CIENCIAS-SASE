import React from "react";

export type OrbState = "stable" | "alert" | "critical" | "imposing" | "scanning";

interface FeriaIdentityOrbProps {
  state?: OrbState;
  size?: number;
  className?: string;
}

const stateColors = {
  stable: {
    main: "#FFD700", 
    glow: "rgba(255, 215, 0, 0.4)",
    shimmer: "#06B6D4",
    iris: "#ffffff"
  },
  alert: {
    main: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.4)",
    shimmer: "#fff7ed",
    iris: "#fff"
  },
  critical: {
    main: "#EF4444",
    glow: "rgba(239, 68, 68, 0.5)",
    shimmer: "#fef2f2",
    iris: "#fff"
  },
  imposing: {
    main: "#FFD700", 
    glow: "rgba(255, 215, 0, 0.6)",
    shimmer: "#06B6D4",
    iris: "#06B6D4"
  },
  scanning: {
    main: "#06B6D4",
    glow: "rgba(6, 182, 212, 0.6)",
    shimmer: "#ffffff",
    iris: "#ffffff"
  }
};

export const FeriaIdentityOrb: React.FC<FeriaIdentityOrbProps> = ({
  state = "imposing",
  size = 300,
  className = "",
}) => {
  const colors = stateColors[state] || stateColors.stable;

  return (
    <div
      className={`orb-wrapper ${className}`}
      style={{ "--orb-size": `${size}px` } as React.CSSProperties}
    >
      <div className="orb-container">
        {/* Anillos de Datos Externos */}
        <div className="data-ring ring-1" style={{ borderColor: `${colors.main}22` }}></div>
        <div className="data-ring ring-2" style={{ borderColor: `${colors.shimmer}33` }}></div>
        
        {/* Plasma Rings */}
        <div className="plasma-ring pr-1" style={{ borderTopColor: colors.main }}></div>
        <div className="plasma-ring pr-2" style={{ borderBottomColor: colors.shimmer }}></div>

        {/* Cuerpo del Orbe */}
        <div
          className="main-orb"
          style={{
            background: `radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.15) 0%, ${colors.main} 40%, #422006 80%, #000 100%)`,
            boxShadow: `0 0 80px 10px ${colors.glow}, inset -10px -10px 40px rgba(0, 0, 0, 0.9)`,
            border: `1px solid ${colors.main}33`
          }}
        >
          {/* El "Ojo" / Núcleo de la IA */}
          <div className="ia-face">
            <div className="iris-glow" style={{ backgroundColor: colors.shimmer }}></div>
            <div className="iris-primary" style={{ backgroundColor: colors.iris }}>
              <div className="pupil-scan" style={{ backgroundColor: colors.shimmer }}></div>
            </div>
            {/* Escaneo Circular Interno */}
            <div className="inner-scanner" style={{ borderTopColor: colors.shimmer }}></div>
          </div>
          
          {/* Brillo de Energía */}
          <div className="energy-field" style={{ 
            background: `radial-gradient(circle at 50% 50%, ${colors.main}22 0%, transparent 70%)` 
          }}></div>
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
          width: 85%;
          height: 85%;
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
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .ia-face {
          position: relative;
          width: 40%;
          height: 40%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .iris-glow {
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          filter: blur(25px);
          opacity: 0.6;
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .iris-primary {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          position: relative;
          box-shadow: 0 0 20px rgba(255,255,255,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pupil-scan {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: blink 4s infinite;
        }

        .inner-scanner {
          position: absolute;
          inset: -15px;
          border: 1px solid transparent;
          border-radius: 50%;
          animation: spin 3s linear infinite;
        }

        .data-ring {
          position: absolute;
          border: 1px dashed;
          border-radius: 50%;
          z-index: 1;
        }
        .ring-1 { inset: -40px; animation: spin 20s linear infinite; }
        .ring-2 { inset: -60px; animation: spin 30s linear reverse infinite; }

        .plasma-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid transparent;
          z-index: 2;
        }
        .pr-1 { inset: -15px; animation: spin 4s linear infinite; }
        .pr-2 { inset: -25px; animation: spin 6s linear reverse infinite; opacity: 0.4; }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        @keyframes blink {
          0%, 45%, 55%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0; transform: scale(0.5); }
        }
      `}</style>
    </div>
  );
};

