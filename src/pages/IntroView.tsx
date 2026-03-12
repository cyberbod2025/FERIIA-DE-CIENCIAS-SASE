import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SaseIdentityOrb, OrbState } from "../components/SaseIdentityOrb";

const Confetti = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            y: -20,
            x: Math.random() * 100 + "%",
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: "110vh",
            rotate: 360,
            opacity: 0,
          }}
          transition={{
            duration: Math.random() * 2 + 3,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            position: "absolute",
            width: "10px",
            height: "10px",
            background: ["#FFD700", "#D32F2F", "#0EA5E9", "#00C853"][
              Math.floor(Math.random() * 4)
            ],
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            zIndex: 5,
          }}
        />
      ))}
    </div>
  );
};

const Reflectores = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <motion.div
        animate={{ rotate: [-20, 20, -20] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: -100,
          left: "10%",
          width: "200px",
          height: "800px",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          filter: "blur(40px)",
          transformOrigin: "top",
        }}
      />
      <motion.div
        animate={{ rotate: [20, -20, 20] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: -100,
          right: "10%",
          width: "200px",
          height: "800px",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          filter: "blur(40px)",
          transformOrigin: "top",
        }}
      />
    </div>
  );
};

export const IntroView: React.FC = () => {
  const [stage, setStage] = useState<"plasma" | "orb" | "welcome">("plasma");
  const [orbState, setOrbState] = useState<OrbState>("imposing");
  const navigate = useNavigate();

  useEffect(() => {
    const t1 = setTimeout(() => setStage("orb"), 1200);
    const t2 = setTimeout(() => {
      const colors: OrbState[] = ["imposing", "stable", "alert", "critical"];
      let i = 0;
      const interval = setInterval(() => {
        setOrbState(colors[i % colors.length]);
        i++;
        if (i >= 6) {
          clearInterval(interval);
          setStage("welcome");
        }
      }, 400);
    }, 1300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      className="intro-root"
      style={{
        width: "100%",
        minHeight: "100dvh",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflowX: "hidden",
        overflowY: "auto",
        position: "fixed",
        top: 0,
        left: 0,
        color: "white",
        padding: "env(safe-area-inset-top) 20px env(safe-area-inset-bottom) 20px",
        zIndex: 9999,
        boxSizing: "border-box"
      }}
    >
      <Confetti />
      <Reflectores />

      {/* IA-SASE & Welcome Content */}
      <div style={{ 
        zIndex: 10, 
        position: "relative", 
        width: "100%", 
        maxWidth: "450px", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center",
        justifyContent: "center"
      }}>
        <AnimatePresence mode="wait">
          {stage !== "welcome" ? (
            <motion.div
              key="orb"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SaseIdentityOrb state={orbState} size={200} />
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                gap: "20px",
              }}
            >
              <SaseIdentityOrb state="imposing" size={180} />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-circus-quantum circus-glow"
                style={{
                  textAlign: "center",
                  padding: "24px",
                  borderRadius: "28px",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              >
                <h2
                  className="title-glow"
                  style={{
                    color: "var(--gold)",
                    marginBottom: "12px",
                    fontSize: "clamp(20px, 6vw, 28px)",
                    lineHeight: "1.2",
                    textTransform: "uppercase"
                  }}
                >
                  ¡Bienvenido a la Feria de Ciencias!
                </h2>
                <p
                  style={{ 
                    fontSize: "clamp(14px, 4vw, 16px)", 
                    lineHeight: "1.5", 
                    color: "rgba(255,255,255,0.85)",
                    marginBottom: "24px",
                  }}
                >
                  Soy <span style={{ color: 'var(--gold)', fontWeight: 700 }}>IA-SASE</span>, tu guía inteligente. 
                  Explora los proyectos y descubre el futuro hoy mismo.
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/login")}
                  style={{
                    padding: "16px",
                    background: "var(--crimson)",
                    border: "none",
                    borderRadius: "14px",
                    color: "white",
                    fontWeight: "800",
                    fontSize: "16px",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    width: "100%",
                    boxShadow: "0 8px 20px rgba(211, 47, 47, 0.3)"
                  }}
                >
                  Entrar al Sistema
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .intro-root {
          user-select: none;
          background: radial-gradient(circle at center, #020617 0%, #000 100%);
        }
        @media (max-width: 480px) {
          .intro-root { padding: 15px; }
        }
      `}</style>
    </div>
  );
};
