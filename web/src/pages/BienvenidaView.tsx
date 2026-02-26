import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const BienvenidaView: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const handleEnter = () => {
    if (nickname.trim()) {
      navigate("/stand");
    }
  };

  return (
    <Layout title="🎪 Circo de la Ciencia 310">
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "40px 30px",
          textAlign: "center",
          background:
            "radial-gradient(circle at center, var(--midnight-light) 0%, var(--deep-blue) 100%)",
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div style={{ fontSize: "80px", marginBottom: "20px" }}>🎪</div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "32px",
              fontWeight: 900,
              color: "var(--gold)",
              textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
              marginBottom: "10px",
            }}
          >
            Bienvenido a la Función
          </h1>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "16px",
              marginBottom: "40px",
            }}
          >
            Ingresa tu nickname de artista para comenzar el recorrido.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <input
            type="text"
            placeholder="Ej: El Mago de las Mate"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEnter()}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "2px solid rgba(255, 215, 0, 0.3)",
              borderRadius: "16px",
              padding: "18px",
              color: "white",
              fontSize: "16px",
              textAlign: "center",
              outline: "none",
              fontFamily: "'Outfit', sans-serif",
            }}
          />
          <button
            onClick={handleEnter}
            style={{
              background:
                "linear-gradient(135deg, var(--crimson) 0%, #8b0000 100%)",
              color: "white",
              border: "none",
              borderRadius: "16px",
              padding: "18px",
              fontSize: "18px",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(211, 47, 47, 0.4)",
              transition: "all 0.3s",
            }}
          >
            ¡Entrar al Circo!
          </button>
        </div>

        <p
          style={{
            marginTop: "30px",
            fontSize: "12px",
            color: "rgba(255, 255, 255, 0.4)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Matemáticas • Ciencia • Magia
        </p>
      </div>
    </Layout>
  );
};
