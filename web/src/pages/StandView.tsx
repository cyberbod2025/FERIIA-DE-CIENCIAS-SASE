import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { Star, Map as MapIcon, Tent, User, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const StandView: React.FC = () => {
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  return (
    <Layout title="📱 Pantalla 4 — Interacción con Stand">
      <div
        style={{
          background:
            "linear-gradient(135deg, var(--crimson) 0%, #8b0000 100%)",
          padding: "20px 24px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              padding: "4px 14px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: 700,
              background: "rgba(255, 215, 0, 0.2)",
              border: "1px solid var(--gold)",
              color: "var(--gold)",
              textTransform: "uppercase",
            }}
          >
            🔭 FÍSICA
          </span>
          <span
            style={{
              padding: "4px 14px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: 700,
              background: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              textTransform: "uppercase",
            }}
          >
            3° Grupo B
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "22px",
            fontWeight: 900,
            color: "var(--gold)",
            textShadow: "0 2px 10px rgba(255, 215, 0, 0.4)",
            lineHeight: 1.2,
            marginBottom: "4px",
          }}
        >
          La Magia de la Gravedad
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.7)" }}>
          ¡El Espectáculo Continúa!
        </p>
      </div>

      <div
        style={{
          padding: "16px 24px",
          background: "rgba(255, 215, 0, 0.05)",
          borderBottom: "1px solid rgba(255, 215, 0, 0.1)",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            color: "rgba(255, 255, 255, 0.5)",
            marginBottom: "6px",
          }}
        >
          TU PROGRESO EN LA FUNCIÓN
        </p>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
            height: "6px",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "60%" }}
            transition={{ duration: 1 }}
            style={{
              background: "linear-gradient(90deg, var(--gold), #ffa500)",
              borderRadius: "10px",
              height: "100%",
              boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "6px",
            fontSize: "11px",
          }}
        >
          <span style={{ color: "var(--gold)", fontWeight: 700 }}>
            ⭐ 350 puntos
          </span>
          <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>
            3 de 5 stands visitados
          </span>
        </div>
      </div>

      <div
        style={{
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          overflowY: "auto",
          flex: 1,
        }}
      >
        {/* TRIVIA CARD */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(13, 27, 75, 0.9), rgba(26, 47, 122, 0.6))",
            border: "1px solid rgba(255, 215, 0, 0.3)",
            borderRadius: "20px",
            padding: "20px",
            position: "relative",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "linear-gradient(135deg, var(--gold), #ffa500)",
              color: "#000",
              fontSize: "10px",
              fontWeight: 800,
              padding: "4px 12px",
              borderRadius: "20px",
              marginBottom: "12px",
              textTransform: "uppercase",
            }}
          >
            🎩 DESAFÍO DEL MAGO
          </span>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.5,
              color: "var(--cream)",
              marginBottom: "16px",
            }}
          >
            ¿Cuál es la fuerza invisible que mantiene a los planetas en órbita
            alrededor del sol?
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {[
              "Fuerza Electromagnética",
              "Fuerza Gravitacional",
              "Fuerza Nuclear Fuerte",
              "Tensión Superficial",
            ].map((opt, i) => (
              <button
                key={i}
                style={{
                  background:
                    opt === "Fuerza Gravitacional"
                      ? "rgba(255, 215, 0, 0.12)"
                      : "rgba(255, 255, 255, 0.06)",
                  border:
                    opt === "Fuerza Gravitacional"
                      ? "1px solid rgba(255, 215, 0, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  color: "white",
                  fontSize: "14px",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "22px",
                    height: "22px",
                    border: "1px solid rgba(255, 215, 0, 0.5)",
                    borderRadius: "50%",
                    textAlign: "center",
                    lineHeight: "21px",
                    fontSize: "11px",
                    color: "var(--gold)",
                    marginRight: "10px",
                    fontWeight: 700,
                    background:
                      opt === "Fuerza Gravitacional"
                        ? "rgba(255, 215, 0, 0.2)"
                        : "transparent",
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                {opt} {opt === "Fuerza Gravitacional" && "✓"}
              </button>
            ))}
          </div>
        </div>

        {/* CURIOSITY CARD */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(139, 0, 0, 0.4), rgba(211, 47, 47, 0.2))",
            border: "1px solid rgba(211, 47, 47, 0.4)",
            borderRadius: "20px",
            padding: "18px",
            display: "flex",
            gap: "12px",
          }}
        >
          <Info size={28} color="var(--gold)" />
          <div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 800,
                color: "var(--gold)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Dato Curioso
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "rgba(255, 255, 255, 0.85)",
                lineHeight: 1.5,
              }}
            >
              Si pudieras saltar en la Luna, ¡tu salto sería 6 veces más alto!
            </p>
          </div>
        </div>

        {/* COMMENTS */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px dashed rgba(255, 215, 0, 0.25)",
            borderRadius: "20px",
            padding: "18px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 800,
              color: "var(--gold)",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            🎟️ PREGUNTÓMETRO
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="¡Escribe tu pregunta anónima al expositor!"
            style={{
              width: "100%",
              background: "rgba(255, 255, 255, 0.07)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              padding: "12px",
              color: "white",
              fontSize: "13px",
              resize: "none",
              height: "70px",
              outline: "none",
            }}
          />
        </div>

        <button
          style={{
            background: "linear-gradient(135deg, var(--gold) 0%, #ffa500 100%)",
            color: "#1a0a00",
            border: "none",
            borderRadius: "16px",
            padding: "16px",
            width: "100%",
            fontSize: "15px",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(255, 215, 0, 0.35)",
          }}
        >
          🌟 ¡Enviar Pregunta!
        </button>
      </div>

      <nav
        style={{
          background: "rgba(10, 16, 53, 0.95)",
          borderTop: "1px solid rgba(255, 215, 0, 0.15)",
          padding: "12px 30px 20px",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        {[
          { icon: <Star />, label: "Inicio", path: "/" },
          { icon: <MapIcon />, label: "Mapa", path: "/stand" },
          { icon: <Tent />, label: "Stands", active: true, path: "/stand" },
          { icon: <User />, label: "Perfil", path: "/ranking" },
        ].map((item, i) => (
          <div
            key={i}
            onClick={() => navigate(item.path)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                color: item.active ? "var(--gold)" : "rgba(255, 255, 255, 0.4)",
              }}
            >
              {item.icon}
            </span>
            <span
              style={{
                fontSize: "10px",
                color: item.active ? "var(--gold)" : "rgba(255, 255, 255, 0.4)",
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </nav>
    </Layout>
  );
};
