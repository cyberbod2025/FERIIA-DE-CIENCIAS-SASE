import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  QrCode,
  Star,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { Navigation } from "../components/Navigation";

interface Estacion {
  id: string;
  nombre: string;
  categoria: string;
  materia: string;
  descripcion_pedagogica: string;
  proceso: string;
  meta: string;
  visitantes_activos: number;
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

export const StandDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stand, setStand] = useState<Estacion | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [alreadyVisited, setAlreadyVisited] = useState(false);
  const [visitResult, setVisitResult] = useState<
    "correct" | "incorrect" | null
  >(null);
  const [loading, setLoading] = useState(true);
  const studentId = localStorage.getItem("student_id") || "";

  useEffect(() => {
    const fetchStand = async () => {
      setLoading(true);

      // Obtener datos del stand
      const { data, error } = await supabase
        .from("estaciones")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setStand(data);

      // Verificar si ya visitó este stand (ANTI-TRAMPA)
      if (studentId && id) {
        const { data: progreso } = await supabase
          .from("progreso_recorrido")
          .select("trivia_respondida_correctamente")
          .eq("estudiante_id", studentId)
          .eq("estacion_id", id)
          .single();

        if (progreso) {
          setAlreadyVisited(true);
          setVisitResult(
            progreso.trivia_respondida_correctamente ? "correct" : "incorrect",
          );
        }
      }

      setLoading(false);
    };
    fetchStand();
  }, [id, studentId]);

  const handleCheckIn = async () => {
    setShowQRModal(true);

    try {
      // Registrar check-in en progreso_recorrido
      if (studentId && id) {
        await supabase.from("progreso_recorrido").insert({
          estudiante_id: studentId,
          estacion_id: id,
          trivia_respondida_correctamente: false,
          puntos_ganados: 0,
        });

        // Incrementar visitantes_activos
        const { error: rpcError } = await supabase.rpc("increment_visitantes", {
          stand_id: id,
        });

        if (rpcError) {
          // Si no existe el RPC o falla, hacerlo manual
          await supabase
            .from("estaciones")
            .update({
              visitantes_activos: (stand?.visitantes_activos || 0) + 1,
            })
            .eq("id", id);
        }

        // Incrementar escaneos del estudiante (Simulación si no hay RPC específico)
        // Obtenemos el estudiante para tener el conteo actual o usamos un valor base
        const { data: studentData } = await supabase
          .from("estudiantes")
          .select("escaneos_realizados")
          .eq("id", studentId)
          .single();

        if (studentData) {
          await supabase
            .from("estudiantes")
            .update({
              escaneos_realizados: (studentData.escaneos_realizados || 0) + 1,
            })
            .eq("id", studentId);
        }
      }
    } catch (err) {
      console.error("Error en check-in:", err);
    }

    setTimeout(() => {
      setShowQRModal(false);
      setCheckedIn(true);
    }, 2000);
  };

  if (loading) {
    return (
      <Layout title="Cargando Stand...">
        <div style={{ padding: "40px", textAlign: "center", color: "white" }}>
          Buscando información de la función...
        </div>
      </Layout>
    );
  }

  if (!stand) {
    return (
      <Layout title="Stand no encontrado">
        <div style={{ padding: "40px", textAlign: "center", color: "white" }}>
          <p>Este stand no existe.</p>
          <button
            onClick={() => navigate("/mapa")}
            style={{
              marginTop: "20px",
              background: "var(--gold)",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Volver al Mapa
          </button>
        </div>
      </Layout>
    );
  }

  // PANTALLA DE BLOQUEO: Ya visitó este stand
  if (alreadyVisited) {
    return (
      <Layout title={`📍 ${stand.nombre}`}>
        <div
          style={{
            padding: "40px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: "20px",
            flex: 1,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background:
                visitResult === "correct"
                  ? "rgba(39,174,96,0.15)"
                  : "rgba(231,76,60,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {visitResult === "correct" ? (
              <CheckCircle size={50} color="#27ae60" />
            ) : (
              <XCircle size={50} color="#e74c3c" />
            )}
          </motion.div>

          <h2 style={{ color: "white", fontSize: "22px" }}>
            {visitResult === "correct"
              ? "✅ Stand Completado"
              : "❌ Ya visitaste este stand"}
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "14px",
              maxWidth: "280px",
            }}
          >
            {visitResult === "correct"
              ? "¡Felicidades! Ya respondiste correctamente la trivia de este stand."
              : "Ya respondiste la trivia de este stand. No puedes intentar de nuevo."}
          </p>

          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              padding: "16px",
              borderRadius: "12px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifyContent: "center",
              }}
            >
              <ShieldAlert size={16} color="var(--gold)" />
              <span
                style={{
                  color: "var(--gold)",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                SISTEMA ANTI-TRAMPA
              </span>
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "11px",
                marginTop: "6px",
              }}
            >
              Cada alumno solo tiene una oportunidad por stand.
            </p>
          </div>

          <button
            onClick={() => navigate("/mapa")}
            style={{
              width: "100%",
              padding: "16px",
              background: "var(--crimson)",
              color: "white",
              borderRadius: "14px",
              border: "none",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Volver al Mapa
          </button>
        </div>
        <Navigation />
      </Layout>
    );
  }

  return (
    <Layout title={`📍 ${stand.nombre}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          flex: 1,
        }}
      >
        <motion.div
          variants={itemVariants}
          style={{
            background:
              "linear-gradient(135deg, var(--midnight-light) 0%, var(--deep-blue) 100%)",
            borderRadius: "24px",
            padding: "24px",
            border: "1px solid rgba(255, 215, 0, 0.1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              opacity: 0.1,
            }}
          >
            <Tent size={120} />
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span
              style={{
                background: "rgba(255, 215, 0, 0.2)",
                color: "var(--gold)",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "10px",
                fontWeight: "bold",
                letterSpacing: "0.1em",
              }}
            >
              {stand.categoria?.toUpperCase()}
            </span>
            <span
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                color: "rgba(255, 255, 255, 0.8)",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "10px",
                fontWeight: "bold",
                letterSpacing: "0.1em",
              }}
            >
              {stand.materia?.toUpperCase()}
            </span>
          </div>

          <h2
            style={{
              fontSize: "24px",
              color: "white",
              marginTop: "12px",
              marginBottom: "8px",
            }}
          >
            {stand.nombre}
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.7)",
              lineHeight: "1.6",
            }}
          >
            {stand.descripcion_pedagogica ||
              "Descripción no disponible en este momento."}
          </p>
        </motion.div>

        {!checkedIn ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <QrCode
                size={64}
                color="var(--gold)"
                style={{ margin: "0 auto 20px" }}
              />
            </motion.div>
            <h3 style={{ color: "white", marginBottom: "10px" }}>
              Escanea para empezar
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "14px",
                marginBottom: "30px",
              }}
            >
              Busca el código QR de acceso en el stand para realizar tu
              Check-in.
            </p>
            <button
              onClick={handleCheckIn}
              style={{
                width: "100%",
                padding: "16px",
                background: "white",
                color: "var(--deep-blue)",
                borderRadius: "14px",
                border: "none",
                fontWeight: "bold",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              Simular Escaneo <ArrowRight size={20} />
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div
              style={{
                background: "rgba(211, 47, 47, 0.1)",
                borderLeft: "4px solid var(--crimson)",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  color: "var(--crimson)",
                  marginBottom: "5px",
                }}
              >
                <Star size={18} fill="currentColor" />
                <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                  ¡ATENCIÓN!
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "white" }}>
                Escucha atentamente la explicación del expositor. Al finalizar,
                se activará la <strong>Trivia de un minuto</strong> para ganar
                tus puntos.
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                padding: "20px",
                borderRadius: "16px",
              }}
            >
              <h4
                style={{
                  color: "var(--gold)",
                  marginBottom: "10px",
                  fontSize: "14px",
                }}
              >
                ¿Tienes dudas?
              </h4>
              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "15px",
                }}
              >
                Puedes preguntar al terminar la explicación.
              </p>
              <button
                onClick={() => {
                  // Marcar acceso válido a la trivia
                  sessionStorage.setItem(`trivia_access_${id}`, "true");
                  navigate(`/trivia/${id}`);
                }}
                style={{
                  width: "100%",
                  padding: "20px",
                  background: "var(--gold)",
                  color: "black",
                  borderRadius: "14px",
                  border: "none",
                  fontWeight: "900",
                  fontSize: "18px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  boxShadow: "0 10px 30px rgba(255, 215, 0, 0.2)",
                  cursor: "pointer",
                }}
              >
                IR A LA TRIVIA
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {showQRModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.9)",
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <QrCode size={100} color="var(--gold)" />
              </motion.div>
              <h2 style={{ color: "var(--gold)" }}>Escaneando...</h2>
              <p style={{ color: "white" }}>Registrando check-in</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <Navigation />
    </Layout>
  );
};

const Tent: React.FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3.5 21 12 3l8.5 18" />
    <path d="M12 3v18" />
    <path d="M2.5 21h19" />
  </svg>
);
