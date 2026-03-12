import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { Navigation } from "../components/Navigation";
import { supabase } from "../lib/supabase";

interface EstudianteRanking {
  nickname: string;
  total_puntos: number;
  grado: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export const RankingView: React.FC = () => {
  const [ranking, setRanking] = useState<EstudianteRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      const { data, error } = await supabase
        .from("estudiantes")
        .select("nickname, total_puntos, grado")
        .order("total_puntos", { ascending: false })
        .limit(10);

      if (!error) setRanking(data || []);
      setLoading(false);
    };
    fetchRanking();
  }, []);

  return (
    <Layout title="🏆 Líderes de la Función">
      <div
        style={{
          background: "linear-gradient(135deg, #1a2f7a 0%, #0d1b4b 100%)",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "rgba(255, 215, 0, 0.2)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            border: "2px solid var(--gold)",
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
          }}
        >
          <Trophy size={40} color="var(--gold)" />
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "24px",
            color: "var(--gold)",
            marginBottom: "8px",
          }}
        >
          Tabla de Honor
        </h1>
        <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.6)" }}>
          ¡Los malabaristas del conocimiento!
        </p>
      </div>

      <div style={{ padding: "20px", flex: 1, overflowY: "auto" }}>
        {loading ? (
          <p style={{ textAlign: "center", color: "white" }}>
            Cargando ranking...
          </p>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {ranking.map((user, i) => (
              <motion.div
                key={user.nickname}
                variants={itemVariants}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border:
                    i < 3
                      ? "1px solid rgba(255, 215, 0, 0.3)"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background:
                      i === 0
                        ? "var(--gold)"
                        : i === 1
                          ? "#c0c0c0"
                          : i === 2
                            ? "#cd7f32"
                            : "rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    color: i < 3 ? "#000" : "var(--white)",
                    fontSize: "14px",
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "15px" }}>
                    {user.nickname}
                  </div>
                  <div
                    style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}
                  >
                    {user.grado}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      color: "var(--gold)",
                      fontWeight: 800,
                      fontSize: "16px",
                    }}
                  >
                    {user.total_puntos}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                    }}
                  >
                    puntos
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <Navigation />
    </Layout>
  );
};
