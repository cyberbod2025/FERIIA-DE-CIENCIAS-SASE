import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Compass, Users, CheckCircle, Lock, XCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Navigation } from "../components/Navigation";
import { SaseIdentityOrb } from "../components/SaseIdentityOrb";

interface Estacion {
  id: string;
  nombre: string;
  materia: string;
  categoria: string;
  visitantes_activos: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

interface ProgresoItem {
  estacion_id: string;
  trivia_respondida_correctamente: boolean;
}

const MATERIA_COLORS: Record<string, string> = {
  Física: "#e74c3c",
  Biología: "#27ae60",
  Química: "#f39c12",
  Geografía: "#3498db",
  Matemáticas: "#9b59b6",
};

const MATERIA_EMOJI: Record<string, string> = {
  Física: "⚡",
  Biología: "🧬",
  Química: "🧪",
  Geografía: "🌎",
  Matemáticas: "📐",
};

export const MapView: React.FC = () => {
  const navigate = useNavigate();
  const [estaciones, setEstaciones] = useState<Estacion[]>([]);
  const [progreso, setProgreso] = useState<ProgresoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const userGroup = localStorage.getItem("user_group") || "";
  const studentId = localStorage.getItem("student_id") || "";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Obtener todas las estaciones disponibles
        const { data: stands, error: standsErr } = await supabase
          .from("estaciones")
          .select("id, nombre, materia, categoria, visitantes_activos")
          .eq("estado", "disponible");

        if (standsErr) throw standsErr;
        setEstaciones(stands || []);

        // Obtener progreso del estudiante actual
        if (studentId) {
          const { data: prog, error: progErr } = await supabase
            .from("progreso_recorrido")
            .select("estacion_id, trivia_respondida_correctamente")
            .eq("estudiante_id", studentId);

          if (!progErr) setProgreso(prog || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  const getStandStatus = (estacionId: string) => {
    const p = progreso.find((pr) => pr.estacion_id === estacionId);
    if (!p) return "disponible";
    if (p.trivia_respondida_correctamente) return "completado";
    return "visitado"; // Ya fue pero no respondió bien
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completado":
        return {
          icon: <CheckCircle size={14} />,
          text: "✅ Completado",
          color: "#27ae60",
          bg: "rgba(39,174,96,0.15)",
        };
      case "visitado":
        return {
          icon: <XCircle size={14} />,
          text: "❌ Fallido",
          color: "#e74c3c",
          bg: "rgba(231,76,60,0.15)",
        };
      default:
        return {
          icon: <Lock size={14} />,
          text: "🔓 Disponible",
          color: "var(--gold)",
          bg: "rgba(255,215,0,0.1)",
        };
    }
  };

  // Stand sugerido: el que no ha visitado y tiene menos gente
  const standSugerido = estaciones
    .filter((e) => getStandStatus(e.id) === "disponible")
    .sort(
      (a, b) => (a.visitantes_activos || 0) - (b.visitantes_activos || 0),
    )[0];

  return (
    <Layout title="📍 Mapa de la Función">
      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          flex: 1,
          overflowY: "auto",
        }}
      >
        {/* Header con grupo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Compass size={18} color="var(--gold)" />
            <span
              style={{
                color: "var(--gold)",
                fontWeight: "bold",
                fontSize: "13px",
              }}
            >
              Grupo {userGroup}
            </span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
            {progreso.filter((p) => p.trivia_respondida_correctamente).length}/
            {estaciones.length} completados
          </span>
        </div>

        {/* Barra de progreso */}
        <div
          style={{
            width: "100%",
            height: "6px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${
                estaciones.length > 0
                  ? (progreso.filter((p) => p.trivia_respondida_correctamente)
                      .length /
                      estaciones.length) *
                    100
                  : 0
              }%`,
            }}
            transition={{ duration: 0.8 }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, var(--gold), #27ae60)",
              borderRadius: "3px",
            }}
          />
        </div>

        {/* Stand sugerido */}
        {standSugerido && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background:
                "linear-gradient(135deg, rgba(255,215,0,0.12) 0%, rgba(26,47,122,0.3) 100%)",
              padding: "16px",
              borderRadius: "16px",
              border: "1px solid rgba(255,215,0,0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <Compass size={16} color="var(--gold)" />
              <span
                style={{
                  color: "var(--gold)",
                  fontSize: "12px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Sugerencia del Sistema
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <SaseIdentityOrb
                  state="stable"
                  size={70}
                  showAccessories={true}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    color: "white",
                    margin: "0 0 4px 0",
                    fontSize: "15px",
                  }}
                >
                  {MATERIA_EMOJI[standSugerido.materia] || "🎪"}{" "}
                  {standSugerido.nombre}
                </h4>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "11px",
                  }}
                >
                  <Users size={11} /> {standSugerido.visitantes_activos || 0}{" "}
                  personas
                </div>
              </div>
              <button
                onClick={() => navigate(`/stand/${standSugerido.id}`)}
                style={{
                  background: "var(--gold)",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "12px",
                  cursor: "pointer",
                  color: "black",
                }}
              >
                Ir al Stand
              </button>
            </div>
          </motion.div>
        )}

        {/* Lista de todos los stands */}
        <h3 style={{ color: "white", fontSize: "14px", margin: "4px 0 0 0" }}>
          Todos los Stands
        </h3>

        {loading ? (
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
              padding: "20px",
            }}
          >
            Cargando estaciones...
          </p>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {estaciones.map((estacion) => {
              const status = getStandStatus(estacion.id);
              const badge = getStatusBadge(status);
              const color = MATERIA_COLORS[estacion.materia] || "var(--gold)";
              const isBlocked = status !== "disponible";

              return (
                <motion.div
                  key={estacion.id}
                  variants={itemVariants}
                  whileTap={!isBlocked ? { scale: 0.97 } : {}}
                  onClick={() => {
                    if (!isBlocked) {
                      navigate(`/stand/${estacion.id}`);
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 16px",
                    background: isBlocked
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(26, 47, 122, 0.25)",
                    borderRadius: "14px",
                    border: `1px solid ${isBlocked ? "rgba(255,255,255,0.05)" : `${color}33`}`,
                    cursor: isBlocked ? "not-allowed" : "pointer",
                    opacity: isBlocked ? 0.6 : 1,
                    transition: "background 0.2s ease, border 0.2s ease",
                  }}
                >
                  {/* Icono de materia */}
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: `${color}22`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                      flexShrink: 0,
                    }}
                  >
                    {MATERIA_EMOJI[estacion.materia] || "🎪"}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        color: isBlocked ? "rgba(255,255,255,0.5)" : "white",
                        margin: "0 0 4px 0",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {estacion.nombre}
                    </h4>
                    <span
                      style={{
                        fontSize: "11px",
                        color: color,
                        fontWeight: "600",
                      }}
                    >
                      {estacion.materia}
                    </span>
                  </div>

                  {/* Badge de estado */}
                  <div
                    style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      background: badge.bg,
                      color: badge.color,
                      fontSize: "10px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {badge.text}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Mensaje si completó todo */}
        {!loading && estaciones.length > 0 && !standSugerido && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "20px",
              background: "rgba(39,174,96,0.1)",
              borderRadius: "16px",
              border: "1px solid rgba(39,174,96,0.3)",
            }}
          >
            <h3 style={{ color: "#27ae60", marginBottom: "8px" }}>
              🏆 ¡Recorrido Completo!
            </h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
              Ya visitaste todos los stands. Revisa tu posición en el ranking.
            </p>
            <button
              onClick={() => navigate("/ranking")}
              style={{
                marginTop: "12px",
                background: "#27ae60",
                border: "none",
                padding: "10px 24px",
                borderRadius: "10px",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Ver Ranking
            </button>
          </motion.div>
        )}
      </div>
      <Navigation />
    </Layout>
  );
};
