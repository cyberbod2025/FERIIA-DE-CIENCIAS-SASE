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
      const hasAccess = sessionStorage.getItem(`trivia_access_${id}`);
      if (!hasAccess) {
        if (studentId && sessionToken && id) {
          const { data: progreso } = await supabase.rpc("obtener_progreso_estudiante_v1", {
            p_estudiante_id: studentId,
            p_session_token: sessionToken,
          });
          const progresoActual = progreso?.find((item: { estacion_id: string }) => item.estacion_id === id);
          if (!progresoActual) {
            setBlocked(true);
            setBlockReason("Debes hacer check-in en el stand antes de responder la trivia.");
            setLoading(false);
            return;
          }
          if (progresoActual.trivia_respondida_correctamente || progresoActual.puntos_ganados > 0) {
            setBlocked(true);
            setBlockReason("Ya participaste en esta trivia. Solo tienes una oportunidad.");
            setLoading(false);
            return;
          }
        }
      }

      const { data, error } = await supabase.from("trivias").select("*").eq("estacion_id", id);
      if (!error) setTrivias(data || []);
      setLoading(false);
    };
    checkAccessAndFetch();
  }, [id, sessionToken, studentId]);

  const handleFinish = useCallback(async (finalPuntos: number) => {
    setIsFinished(true);
    sessionStorage.removeItem(`trivia_access_${id}`);
    if (studentId && sessionToken && id) {
      try {
        const { data, error: rpcError } = await supabase.rpc("finalizar_trivia_v2", {
          p_estudiante_id: studentId,
          p_estacion_id: id,
          p_puntos_adicionales: finalPuntos,
          p_session_token: sessionToken,
        });
        if (rpcError || !data?.success) throw new Error(data?.message || "Error al guardar");
      } catch (err) {
        console.error("Error guardando resultado:", err);
      }
    }
  }, [id, sessionToken, studentId]);

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

    setTimeout(() => {
      setShowExplanation(false);
      if (currentIndex + 1 < trivias.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        handleFinish(correct ? puntos + (currentTrivia.puntos || 10) : puntos);
      }
    }, 2500);
  };

  if (loading) {
    return (
      <Layout title="Preparando Trivia">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
            <Timer size={48} className="text-yellow-400/40" />
          </motion.div>
          <p className="mt-4 text-white/40 animate-pulse uppercase tracking-widest text-[10px] font-bold">Iniciando Sincronización...</p>
        </div>
      </Layout>
    );
  }

  if (blocked) {
    return (
      <Layout title="Acceso Denegado">
        <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <Lock size={32} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">Zona Restringida</h2>
          <p className="text-sm text-white/50">{blockReason}</p>
          <button onClick={() => navigate("/mapa")} className="w-full py-4 font-bold text-white rounded-xl bg-white/5 border border-white/10">
            VOLVER AL MAPA
          </button>
        </div>
      </Layout>
    );
  }

  if (trivias.length === 0) {
    return (
      <Layout title="Sin Trivia">
        <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
          <AlertCircle size={48} className="text-yellow-400/30" />
          <p className="text-sm text-white/50">Este stand no tiene desafíos configurados.</p>
          <button onClick={() => navigate("/mapa")} className="w-full py-4 font-bold text-black bg-yellow-400 rounded-xl">
            VOLVER AL MAPA
          </button>
        </div>
      </Layout>
    );
  }

  const currentTrivia = trivias[currentIndex];

  return (
    <Layout title="Trivia Relámpago">
      <div className="flex flex-col p-5 space-y-6 flex-1">
        {!isFinished ? (
          <>
            <div className="flex items-center justify-between p-4 border surface-card-strong border-white/5 rounded-2xl">
              <div className={`flex items-center gap-3 font-mono text-xl ${timeLeft < 10 ? "text-red-400 animate-pulse" : "text-white"}`}>
                <Timer size={20} className={timeLeft < 10 ? "text-red-400" : "text-yellow-400"} />
                00:{timeLeft.toString().padStart(2, "0")}
              </div>
              <div className="text-[10px] font-bold tracking-widest text-white/30 uppercase bg-white/5 px-3 py-1 rounded-full">
                {currentIndex + 1} / {trivias.length}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {showExplanation ? (
                <motion.div key="explanation" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center ${lastAnswerCorrect ? "bg-green-500/20 border-green-500/40" : "bg-red-500/20 border-red-500/40"} border`}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}>
                      {lastAnswerCorrect ? <CheckCircle size={48} className="text-green-400" /> : <XCircle size={48} className="text-red-400" />}
                    </motion.div>
                  </div>
                  <h3 className={`text-2xl font-black uppercase ${lastAnswerCorrect ? "text-green-400" : "text-red-400"}`}>
                    {lastAnswerCorrect ? "¡Brillante!" : "Incorrecto"}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed max-w-xs">{currentExplanation}</p>
                </motion.div>
              ) : (
                <motion.div key="question" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} className="flex-1 space-y-8">
                  <h2 className="text-2xl font-bold leading-tight text-white">{currentTrivia.pregunta}</h2>
                  <div className="grid gap-3">
                    {Object.entries(currentTrivia.opciones).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => handleAnswer(key)}
                        className="flex items-center gap-4 p-5 text-left border surface-card border-white/5 rounded-2xl active:scale-95 transition-all group hover:bg-white/5"
                      >
                        <span className="w-8 h-8 flex items-center justify-center text-xs font-black text-yellow-400 rounded-lg bg-yellow-400/10 border border-yellow-400/20 uppercase tracking-tighter">
                          {key}
                        </span>
                        <span className="text-sm font-medium text-white/80 group-hover:text-white">{val}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
            <div className={`relative w-32 h-32 flex items-center justify-center rounded-full ${puntos > 0 ? "bg-yellow-400/20 shadow-[0_0_50px_rgba(234,179,8,0.2)]" : "bg-white/5"} border border-white/10`}>
              <Trophy size={64} className={puntos > 0 ? "text-yellow-400" : "text-white/20"} />
              {puntos > 0 && (
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 rounded-full bg-yellow-400/10" />
              )}
            </div>

            <div>
              <h2 className={`text-3xl font-black uppercase tracking-tighter ${puntos > 0 ? "text-white" : "text-white/40"}`}>
                {puntos > 0 ? "¡Excelente Trabajo!" : "Misión Fallida"}
              </h2>
              <p className="mt-2 text-white/50 text-sm">
                Has recolectado <span className="text-yellow-400 font-bold">{puntos} puntos</span> en este módulo.
              </p>
            </div>

            <div className="w-full p-6 border surface-card-strong border-white/5 rounded-2xl space-y-4">
              <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase text-center">Estatus del Usuario</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Puntos Ganados</span>
                <span className="text-yellow-400 font-mono font-bold">+{puntos}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-white/5 pt-3">
                <span className="text-white/60">Estación</span>
                <span className="text-blue-300 font-bold truncate max-w-[120px]">{stand?.nombre || "Finalizado"}</span>
              </div>
            </div>

            <button onClick={() => navigate("/mapa")} className="w-full flex items-center justify-center gap-3 py-5 font-black text-black rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-xl shadow-yellow-500/20">
              EXPLORAR SIGUIENTE STAND <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};
