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
            x: Math.random() * window.innerWidth,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 20,
            x: (Math.random() - 0.5) * 100 + Math.random() * window.innerWidth,
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
  const [stage, setStage] = useState<"plasma" | "orb" | "circus" | "domadora">(
    "plasma",
  );
  const [orbState, setOrbState] = useState<OrbState>("imposing");
  const navigate = useNavigate();

  useEffect(() => {
    // Stage 1: Plasma
    const t1 = setTimeout(() => setStage("orb"), 2500);

    // Stage 2: Orbe cambiando colores (Secuencia: Azul -> Verde -> Amarillo/Naranja -> Rojo)
    const t2 = setTimeout(() => {
      const colors: OrbState[] = ["imposing", "stable", "alert", "critical"]; // Azul, Verde, Amarillo/Naranja, Rojo
      let i = 0;
      const interval = setInterval(() => {
        setOrbState(colors[i % colors.length]);
        i++;
        if (i >= 12) clearInterval(interval);
      }, 600);
    }, 2600);

    // Stage 3: Emerge carpa de circo
    const t3 = setTimeout(() => setStage("circus"), 7000);

    // Stage 4: Domadora
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
      className="intro-root"
      style={{
        width: "100vw",
        height: "100vh",
        background: "#020617",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "fixed", // Para ocultar la hora del sistema si el navegador lo permite en fullscreen
        top: 0,
        left: 0,
        color: "white",
        zIndex: 9999,
      }}
    >
      <Confetti />
      <Reflectores />

      {/* Fondo de Plasma */}
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
                "radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, transparent 70%)",
              filter: "blur(40px)",
              zIndex: 1,
            }}
          />
        )}
      </AnimatePresence>

      {/* Carpa de Circo - Ahora más grande y central */}
      <AnimatePresence>
        {(stage === "circus" || stage === "domadora") && (
          <motion.div
            initial={{ y: 500, opacity: 0, scale: 0.8 }}
            animate={{
              y: stage === "domadora" ? -50 : 0,
              opacity: 0.4,
              scale: 1.5,
            }}
            style={{
              position: "absolute",
              bottom: "15%",
              fontSize: "200px",
              zIndex: 1,
              filter: "drop-shadow(0 0 50px rgba(211, 47, 47, 0.6)) blur(2px)",
            }}
          >
            🎪
          </motion.div>
        )}
      </AnimatePresence>

      {/* IA-SASE */}
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
                size={stage === "plasma" ? 180 : 320}
              />
            </motion.div>
          ) : (
            <motion.div
              key="domadora"
              initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <div style={{ position: "relative" }}>
                <SaseIdentityOrb state="imposing" size={300} />

                {/* Sombrero de Copa */}
                <div
                  style={{
                    position: "absolute",
                    top: "-60px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "100px",
                    zIndex: 11,
                  }}
                >
                  🎩
                </div>

                {/* Bigote */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "35%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "50px",
                    zIndex: 12,
                  }}
                >
                  👨🏻‍🦱
                </div>

                {/* El Niño / Cabeza en la boca (Efecto de truco de circo) */}
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  style={{
                    position: "absolute",
                    bottom: "20%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "45px",
                    zIndex: 15, // Por encima de los ojos
                    background: "rgba(0,0,0,0.2)",
                    borderRadius: "50%",
                    padding: "5px",
                    filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))",
                  }}
                >
                  👦🏻
                </motion.div>

                {/* Látigo lateral */}
                <motion.div
                  animate={{ rotate: [0, -30, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  style={{
                    position: "absolute",
                    right: "-80px",
                    top: "30%",
                    fontSize: "80px",
                  }}
                >
                  ➰
                </motion.div>
              </div>

              {/* Texto de Bienvenida */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                style={{
                  textAlign: "center",
                  background:
                    "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 58, 138, 0.9))",
                  padding: "30px",
                  borderRadius: "32px",
                  border: "3px solid #FFD700",
                  maxWidth: "340px",
                  boxShadow:
                    "0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(255, 215, 0, 0.3)",
                  backdropFilter: "blur(15px)",
                  marginTop: "20px",
                }}
              >
                <h2
                  style={{
                    color: "#FFD700",
                    marginBottom: "15px",
                    fontSize: "28px",
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  }}
                >
                  ¡EL ESPECTÁCULO COMIENZA!
                </h2>
                <p
                  style={{ fontSize: "16px", lineHeight: "1.6", color: "#FFF" }}
                >
                  Soy la IA-SASE, tu guía en este Circo de la Ciencia. ¡Entra
                  ahora y descubre los secretos del saber!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  style={{
                    marginTop: "25px",
                    padding: "15px 40px",
                    background: "#D32F2F",
                    border: "none",
                    borderRadius: "50px",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px",
                    cursor: "pointer",
                    boxShadow: "0 10px 20px rgba(211, 47, 47, 0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  ENTRAR A LA FUNCIÓN
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .intro-root {
          cursor: none;
          user-select: none;
        }
        @media (max-width: 600px) {
          .intro-root {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};
