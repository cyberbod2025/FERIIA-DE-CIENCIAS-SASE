import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SaseIdentityOrb, OrbState } from "../components/SaseIdentityOrb";

export const IntroView: React.FC = () => {
  const [stage, setStage] = useState<"plasma" | "orb" | "circus" | "domadora">(
    "plasma",
  );
  const [orbState, setOrbState] = useState<OrbState>("imposing");
  const navigate = useNavigate();

  useEffect(() => {
    // Stage 1: Plasma acumulándose
    const t1 = setTimeout(() => setStage("orb"), 2500);

    // Stage 2: Orbe cambiando colores
    const t2 = setTimeout(() => {
      const colors: OrbState[] = ["critical", "stable", "alert", "imposing"];
      let i = 0;
      const interval = setInterval(() => {
        setOrbState(colors[i % colors.length]);
        i++;
        if (i >= 8) clearInterval(interval);
      }, 500);
    }, 2600);

    // Stage 3: Emerge carpa de circo
    const t3 = setTimeout(() => setStage("circus"), 7000);

    // Stage 4: Transformación a Domadora
    const t4 = setTimeout(() => setStage("domadora"), 9500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#020617",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        color: "white",
      }}
    >
      {/* Fondo de Estrellas/Plasma */}
      <AnimatePresence>
        {stage === "plasma" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Carpa de Circo que emerge al fondo */}
      <AnimatePresence>
        {(stage === "circus" || stage === "domadora") && (
          <motion.div
            initial={{ y: 300, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            style={{
              position: "absolute",
              bottom: "10%",
              fontSize: "120px",
              zIndex: 1,
              filter: "drop-shadow(0 0 30px rgba(211, 47, 47, 0.4))",
            }}
          >
            🎪
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orbe / IA-SASE */}
      <div style={{ zIndex: 10, position: "relative" }}>
        <AnimatePresence mode="wait">
          {stage !== "domadora" ? (
            <motion.div
              key="orb"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: stage === "plasma" ? [0, 1.2, 1] : 1,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0, rotate: 360 }}
              transition={{ duration: 1.5, type: "spring" }}
            >
              <SaseIdentityOrb
                state={orbState}
                size={stage === "plasma" ? 150 : 280}
              />
            </motion.div>
          ) : (
            <motion.div
              key="domadora"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >
              {/* Representación de Domadora: Orbe con accesorios */}
              <div style={{ position: "relative" }}>
                <SaseIdentityOrb state="imposing" size={260} />
                {/* Sombrero de Copa */}
                <div
                  style={{
                    position: "absolute",
                    top: "-40px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "80px",
                    filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.5))",
                  }}
                >
                  🎩
                </div>
                {/* Bigote */}
                <div
                  style={{
                    position: "absolute",
                    top: "60%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "40px",
                    filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.3))",
                  }}
                >
                  👨🏻‍🦱
                </div>
                {/* Látigo lateral */}
                <motion.div
                  animate={{ rotate: [0, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  style={{
                    position: "absolute",
                    right: "-60px",
                    top: "40%",
                    fontSize: "60px",
                  }}
                >
                  ➰
                </motion.div>
              </div>

              {/* Texto de Bienvenida */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                style={{
                  textAlign: "center",
                  background: "rgba(15, 23, 42, 0.8)",
                  padding: "24px",
                  borderRadius: "24px",
                  border: "2px solid var(--gold)",
                  maxWidth: "320px",
                  boxShadow: "0 0 30px rgba(255, 215, 0, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h2 style={{ color: "var(--gold)", marginBottom: "12px" }}>
                  ¡Pasen, pasen!
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  Soy la IA-SASE, domadora de este Circo de la Ciencia.
                  Prepárense para ver lo imposible convertido en conocimiento.
                  ¡La función está por comenzar!
                </p>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate("/login")}
                  style={{
                    marginTop: "20px",
                    padding: "12px 30px",
                    background: "var(--crimson)",
                    border: "none",
                    borderRadius: "50px",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 5px 15px rgba(211, 47, 47, 0.4)",
                  }}
                >
                  ENTRAR A LA FUNCIÓN
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Efectos de Plasma flotantes */}
      {stage === "plasma" && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * 400 - 200,
                y: Math.random() * 400 - 200,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                x: 0,
                y: 0,
                scale: [0, 1.5, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
              }}
              style={{
                position: "absolute",
                width: "40px",
                height: "40px",
                background: "rgba(14, 165, 233, 0.4)",
                borderRadius: "50%",
                filter: "blur(10px)",
              }}
            />
          ))}
        </>
      )}

      {/* Estilo Global para variables */}
      <style>{`
        :root {
          --gold: #FFD700;
          --crimson: #D32F2F;
          --sky: #0EA5E9;
        }
      `}</style>
    </div>
  );
};
