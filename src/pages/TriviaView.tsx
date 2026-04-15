import React, { useEffect, useState, useCallback } from "react";
import { Layout } from "../components/Layout";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  Timer,
  ArrowRight,
  Trophy,
  AlertCircle,
  ShieldAlert,
  Lock,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { getStudentSession } from "../lib/studentSession";

interface Trivia {
  id: string;
  pregunta: string;
  opciones: Record<string, string>;
  respuesta_correcta: string;
  explicacion_post_respuesta: string;
  puntos: number;
}

export const TriviaView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trivias, setTrivias] = useState<Trivia[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFinished, setIsFinished] = useState(false);
  const [puntos, setPuntos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState("");

  const { studentId, sessionToken } = getStudentSession();

  useEffect(() => {
    const checkAccessAndFetch = async () => {
      setLoading(true);

      // VERIFICACIÓN 1: ¿Viene del check-in?
        const hasAccess = sessionStorage.getItem(`trivia_access_${id}`);
        if (!hasAccess) {
          // Verificar si tiene progreso (quizá recargó la página)
        if (studentId && sessionToken && id) {
          const { data: progreso } = await supabase.rpc("obtener_progreso_estudiante_v1", {
            p_estudiante_id: studentId,
            p_session_token: sessionToken,
          });

          const progresoActual = progreso?.find((item: { estacion_id: string }) => item.estacion_id === id);

          if (!progresoActual) {
            // No tiene check-in
            setBlocked(true);
            setBlockReason(
              "Debes hacer check-in en el stand antes de responder la trivia.",
            );
            setLoading(false);
            return;
          }

          if (
            progresoActual.trivia_respondida_correctamente ||
            progresoActual.puntos_ganados > 0
          ) {
            // Ya respondió
            setBlocked(true);
            setBlockReason(
              "Ya respondiste esta trivia. Solo tienes una oportunidad por stand.",
            );
            setLoading(false);
            return;
          }
        }
      }

      // Fetch trivias
      const { data, error } = await supabase
        .from("trivias")
        .select("*")
        .eq("estacion_id", id);

      if (!error) setTrivias(data || []);
      setLoading(false);
    };

    checkAccessAndFetch();
  }, [id, sessionToken, studentId]);

  const handleFinish = useCallback(
    async (finalPuntos: number) => {
      setIsFinished(true);

      // Limpiar el acceso de sesión
      sessionStorage.removeItem(`trivia_access_${id}`);

      // Guardar resultado de forma atómica usando RPC
      if (studentId && sessionToken && id) {
        try {
          const { data, error: rpcError } = await supabase.rpc("finalizar_trivia_v2", {
            p_estudiante_id: studentId,
            p_estacion_id: id,
            p_puntos_adicionales: finalPuntos,
            p_session_token: sessionToken,
          });

          if (rpcError || !data?.success) {
            console.error("Error en finalizar_trivia_v2:", rpcError || data?.message);
            throw new Error(data?.message || "No se pudo guardar la trivia.");
          }
        } catch (err) {
          console.error("Error guardando resultado:", err);
        }
      }
    },
    [id, sessionToken, studentId],
  );

  useEffect(() => {
    if (timeLeft > 0 && !isFinished && !showExplanation && !blocked) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isFinished) {
      handleFinish(puntos);
    }
  }, [timeLeft, isFinished, showExplanation, blocked, handleFinish, puntos]);

  const handleAnswer = (selectedKey: string) => {
    const currentTrivia = trivias[currentIndex];
    const correct = selectedKey === currentTrivia.respuesta_correcta;

    if (correct) setPuntos((prev) => prev + (currentTrivia.puntos || 10));

    setLastAnswerCorrect(correct);
    setCurrentExplanation(currentTrivia.explicacion_post_respuesta || "");
    setShowExplanation(true);

    // Mostrar explicación por 3 segundos, luego avanzar
    setTimeout(() => {
      setShowExplanation(false);
      if (currentIndex + 1 < trivias.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        const finalPuntos = correct
          ? puntos + (currentTrivia.puntos || 10)
          : puntos;
        handleFinish(finalPuntos);
      }
    }, 3000);
  };

  // PANTALLA DE BLOQUEO
  if (blocked) {
    return (
      <Layout title="🔒 Trivia Bloqueada">
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
              background: "rgba(231,76,60,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock size={50} color="#e74c3c" />
          </motion.div>

          <h2 style={{ color: "white", fontSize: "22px" }}>Acceso Denegado</h2>

          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "14px",
              maxWidth: "280px",
            }}
          >
            {blockReason}
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
            }}
          >
            Volver al Mapa
          </button>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout title="Cargando Trivia...">
        <div style={{ padding: "40px", textAlign: "center", color: "white" }}>
          Preparando preguntas del proyecto...
        </div>
      </Layout>
    );
  }

  if (trivias.length === 0 && !loading) {
    return (
      <Layout title="Trivia No Disponible">
        <div style={{ padding: "40px", textAlign: "center", color: "white" }}>
          <AlertCircle
            size={48}
            color="var(--gold)"
            style={{ margin: "0 auto 20px" }}
          />
          <p>Este stand no tiene preguntas configuradas aún.</p>
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

  const currentTrivia = trivias[currentIndex];

  return (
    <Layout title="⏱️ Trivia Relámpago">
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          flex: 1,
        }}
      >
        {!isFinished ? (
          <>
            {/* Timer bar */}
            <div
              className="surface-card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 20px",
                borderRadius: "50px",
                border: `1px solid ${timeLeft < 10 ? "var(--crimson)" : "rgba(255,215,0,0.3)"}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: timeLeft < 10 ? "var(--crimson)" : "white",
                }}
              >
                <Timer
                  size={20}
                  className={timeLeft < 10 ? "animate-pulse" : ""}
                />
                <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                  00:{timeLeft.toString().padStart(2, "0")}
                </span>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--gold)",
                  fontWeight: "bold",
                }}
              >
                PREGUNTA {currentIndex + 1}/{trivias.length}
              </span>
            </div>

            {/* Explicación post-respuesta */}
            {showExplanation ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  gap: "16px",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "40px",
                    background: lastAnswerCorrect
                      ? "rgba(39,174,96,0.2)"
                      : "rgba(231,76,60,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "40px",
                  }}
                >
                  {lastAnswerCorrect ? "✅" : "❌"}
                </div>
                <h3
                  style={{
                    color: lastAnswerCorrect ? "#27ae60" : "#e74c3c",
                    fontSize: "20px",
                  }}
                >
                  {lastAnswerCorrect ? "¡Correcto!" : "Incorrecto"}
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  {currentExplanation}
                </p>
              </motion.div>
            ) : (
              /* Pregunta y opciones */
              <motion.div
                key={currentIndex}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                style={{ flex: 1 }}
              >
                <h2
                  style={{
                    fontSize: "22px",
                    color: "white",
                    marginBottom: "30px",
                    lineHeight: "1.4",
                  }}
                >
                  {currentTrivia.pregunta}
                </h2>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {Object.entries(currentTrivia.opciones).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => handleAnswer(key)}
                      className="surface-card"
                      style={{
                        padding: "18px 20px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "white",
                        textAlign: "left",
                        fontSize: "15px",
                        cursor: "pointer",
                        display: "flex",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{ color: "var(--gold)", fontWeight: "bold" }}
                      >
                        {key}.
                      </span>
                      {val}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "60px",
                background: puntos > 0 ? "var(--gold)" : "rgba(231,76,60,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
                boxShadow:
                  puntos > 0 ? "0 0 40px rgba(255, 215, 0, 0.4)" : "none",
              }}
            >
              <Trophy
                size={60}
                color={puntos > 0 ? "var(--deep-blue)" : "#e74c3c"}
              />
            </div>

            <h2
              style={{
                color: puntos > 0 ? "var(--gold)" : "#e74c3c",
                fontSize: "28px",
                marginBottom: "10px",
              }}
            >
              {puntos > 0 ? "¡Misión Terminada!" : "Trivia Finalizada"}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "30px" }}>
              {puntos > 0 ? (
                <>
                  Has ganado <strong>{puntos} puntos</strong> por tu atención.
                </>
              ) : (
                "No obtuviste puntos esta vez. ¡Sigue intentando en otros stands!"
              )}
            </p>

            <div
              className="surface-card"
              style={{
                padding: "20px",
                width: "100%",
                marginBottom: "30px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "white",
                  marginBottom: "15px",
                }}
              >
                Siguiente paso:
              </p>
              <h3 style={{ color: "var(--gold)" }}>REVISAR MAPA</h3>
              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.5)",
                  marginTop: "10px",
                }}
              >
                El sistema te asignará el siguiente stand con menos gente.
              </p>
            </div>

            <button
              onClick={() => navigate("/mapa")}
              className="crimson-action"
              style={{
                width: "100%",
                padding: "18px",
                borderRadius: "50px",
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
              Consultar Siguiente Stand <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};
