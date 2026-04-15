import React from "react";
import { Layout } from "../components/Layout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Target, ChevronRight } from "lucide-react";
import { SaseNeuralCore } from "../components/SaseNeuralCore";
import { getStudentSession } from "../lib/studentSession";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

export const TutorialView: React.FC = () => {
  const navigate = useNavigate();
  const { studentName } = getStudentSession();
  const userName = studentName || "Artista";

  return (
    <Layout title="📘 Manual de Misión">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          padding: "30px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          flex: 1,
        }}
      >
        <motion.div
          variants={sectionVariants}
          className="surface-card-strong"
          style={{
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "15px",
            }}
          >
            <SaseNeuralCore size={140} />
          </div>
          <h2
            style={{
              fontSize: "20px",
              color: "var(--gold)",
              marginBottom: "8px",
            }}
          >
            ¡Hola, {userName}!
          </h2>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.6",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Estás a punto de entrar a la <strong>FERIA DE CIENCIAS 2026 ESD-310</strong>,
            una experiencia donde el conocimiento y la innovación se unen.
          </p>
        </motion.div>

        <motion.section
          variants={sectionVariants}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div
            className="surface-card"
            style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "16px" }}
          >
            <div
              style={{
                background: "var(--crimson)",
                padding: "10px",
                borderRadius: "12px",
              }}
            >
              <Target size={20} color="white" />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "16px",
                  color: "white",
                  marginBottom: "4px",
                }}
              >
                El Objetivo
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: "1.4",
                }}
              >
                Recorrer los stands de{" "}
                <strong>Física, Biología, Química y Geografía</strong>. ¡Y por
                primera vez, las <strong>Matemáticas</strong> se unen a la
                función!
              </p>
            </div>
          </div>

          <div
            className="surface-card"
            style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "16px" }}
          >
            <div
              style={{
                background: "var(--midnight-light)",
                padding: "10px",
                borderRadius: "12px",
              }}
            >
              <BookOpen size={20} color="white" />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "16px",
                  color: "white",
                  marginBottom: "4px",
                }}
              >
                ¿Cómo funciona?
              </h3>
              <ul
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.6)",
                  paddingLeft: "18px",
                  lineHeight: "1.6",
                }}
              >
                <li>
                  Sigue el <strong>Mapa</strong> para encontrar tu stand
                  asignado.
                </li>
                <li>
                  Haz <strong>Check-in</strong> con el QR al llegar.
                </li>
                <li>Pon mucha atención a la explicación.</li>
                <li>
                  Gana puntos resolviendo la <strong>Trivia Final</strong>.
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.button
          variants={sectionVariants}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/mapa")}
          className="crimson-action"
          style={{
            marginTop: "auto",
            padding: "18px",
            borderRadius: "50px",
            fontSize: "16px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          Entendido, Ver Mapa <ChevronRight size={20} />
        </motion.button>
      </motion.div>
    </Layout>
  );
};
