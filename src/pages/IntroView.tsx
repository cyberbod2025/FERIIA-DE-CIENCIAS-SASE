import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SaseNeuralCore } from "../components/SaseNeuralCore";

const SpaceBackground = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
    <motion.div
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: [0.2, 0.4, 0.2]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        background: "radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.08) 0%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />
    {[...Array(40)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: Math.random() }}
        animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 1.2, 1] }}
        transition={{ duration: Math.random() * 5 + 3, repeat: Infinity }}
        style={{
          position: "absolute",
          width: "2px",
          height: "2px",
          background: i % 2 === 0 ? "var(--primary)" : "var(--accent)",
          left: Math.random() * 100 + "%",
          top: Math.random() * 100 + "%",
          borderRadius: "50%",
          boxShadow: `0 0 10px ${i % 2 === 0 ? "var(--primary)" : "var(--accent)"}`,
        }}
      />
    ))}
  </div>
);

export const IntroView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="intro-root"
      style={{
        width: "100%",
        minHeight: "100dvh",
        background: "#020617",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        color: "white",
        overflow: "hidden"
      }}
    >
      <SpaceBackground />
      
      <div style={{ zIndex: 10, textAlign: "center", padding: "20px" }}>
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "400px"
          }}
        >
          <SaseNeuralCore size={200} />
          
          <h1 style={{
            marginTop: "40px",
            fontSize: "30px",
            fontFamily: "'Outfit', sans-serif",
            background: "linear-gradient(180deg, #FFFFFF 0%, var(--primary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "5px",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            textTransform: "uppercase"
          }}>
            FERIA DE CIENCIAS 2026 ESD-310
          </h1>
          <p style={{
            fontSize: "13px",
            color: "var(--accent)",
            letterSpacing: "0.3em",
            marginBottom: "60px",
            fontWeight: 700,
            textTransform: "uppercase"
          }}>
            Innovación Educativa Sec. 310
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            style={{
              padding: "22px 56px",
              background: "rgba(2, 6, 23, 0.8)",
              border: "1px solid var(--accent)",
              borderRadius: "16px",
              color: "white",
              fontSize: "15px",
              fontWeight: "700",
              letterSpacing: "0.15em",
              cursor: "pointer",
              backdropFilter: "blur(20px)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(6, 182, 212, 0.2)"
            }}
          >
            INICIAR EXPLORACIÓN
          </motion.button>
        </motion.div>
      </div>

      <div style={{
        position: "absolute",
        bottom: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "10px",
        color: "rgba(255,255,255,0.2)",
        letterSpacing: "0.1em"
      }}>
        © 2026 CIENCIA DIGITAL | ESD-310
      </div>
    </div>
  );
};
