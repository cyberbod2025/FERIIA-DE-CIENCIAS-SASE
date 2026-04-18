import React, { useEffect, useState, useCallback } from "react";
import { Layout } from "../components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  Timer,
  Trophy,
  ShieldAlert,
  Lock,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronRight
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { getStudentSession } from "../lib/studentSession";
import { ScienceCore } from "../components/ScienceCore";

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
      if (!hasAccess && studentId && sessionToken && id) {
        const { data: progreso } = await supabase.rpc("obtener_progreso_estudiante_v1", {
          p_estudiante_id: studentId,
          p_session_token: sessionToken,
        });
        const progresoActual = progreso?.find((item: { estacion_id: string }) => item.estacion_id === id);
        if (!progresoActual) {
          setBlocked(true);
          setBlockReason("Es necesario registrar la visita en el módulo físico antes de iniciar la evaluación.");
          setLoading(false);
          return;
        }
        if (progresoActual.trivia_respondida_correctamente || progresoActual.puntos_ganados > 0) {
          setBlocked(true);
          setBlockReason("Esta trivia ya fue respondida. Solo hay una oportunidad por stand.");
          setLoading(false);
          return;
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
        await supabase.rpc("finalizar_trivia_v2", {
          p_estudiante_id: studentId,
          p_estacion_id: id,
          p_puntos_adicionales: finalPuntos,
          p_session_token: sessionToken,
        });
      } catch (err) {
        console.error(err);
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
    }, 4000);
  };

  if (blocked) return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center p-10 gap-8 bg-white">
        <div className="size-24 rounded-full bg-[var(--error-container)]/10 flex items-center justify-center text-[var(--error)]">
          <Lock size={40} />
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-[var(--font-display)] font-black text-[var(--on-surface)] uppercase tracking-tight">Acceso limitado</h2>
          <p className="text-sm font-medium text-[var(--on-surface-variant)] opacity-70 max-w-[280px] mx-auto leading-relaxed">{blockReason}</p>
        </div>
        <div className="w-full p-5 bg-[var(--surface-container-low)] rounded-3xl flex items-center gap-4 border border-[var(--surface-container-highest)]/50">
          <ShieldAlert size={20} className="text-[var(--primary)]" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--on-surface-variant)]">Mecanismo de seguridad activo</p>
        </div>
        <button onClick={() => navigate("/mapa")} className="w-full h-15 bg-[var(--primary)] text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20">
          Volver al mapa
        </button>
      </div>
    </Layout>
  );

  if (loading) return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-6 bg-white">
        <ScienceCore size={120} />
        <div className="flex flex-col items-center gap-2">
           <Loader2 size={24} className="animate-spin text-[var(--primary)] opacity-40" />
           <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[var(--primary)] opacity-60">Cargando trivia</p>
        </div>
      </div>
    </Layout>
  );

  const currentTrivia = trivias[currentIndex];

  return (
    <Layout>
      <div className="flex flex-col gap-8 px-6 py-10 pb-32 flex-1 bg-white">
        {!isFinished ? (
          <>
            {/* Minimalist Top HUD */}
            <header className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-4 px-5 py-3 bg-[var(--surface-container-low)] rounded-3xl border border-[var(--surface-container-highest)]/50">
                <div className={`p-1.5 rounded-full ${timeLeft < 15 ? 'bg-[var(--error)]/20 text-[var(--error)]' : 'bg-[var(--primary)]/10 text-[var(--primary)]'}`}>
                  <Timer size={16} className={timeLeft < 15 ? 'animate-pulse' : ''} />
                </div>
                <span className={`text-base font-bold font-mono ${timeLeft < 15 ? 'text-[var(--error)]' : 'text-[var(--on-surface)]'}`}>
                  00:{timeLeft.toString().padStart(2, "0")}
                </span>
              </div>
              <div className="px-5 py-3 bg-[var(--surface-container-low)] rounded-3xl border border-[var(--surface-container-highest)]/50">
                <span className="text-[10px] font-bold text-[var(--on-surface-variant)] opacity-60 tracking-widest uppercase">
                  {currentIndex + 1} DE {trivias.length}
                </span>
              </div>
            </header>

            <AnimatePresence mode="wait">
              {showExplanation ? (
                <motion.div 
                  key="feedback"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col items-center justify-center text-center gap-8"
                >
                  <div className={`size-28 rounded-[2rem] flex items-center justify-center shadow-xl ${
                    lastAnswerCorrect 
                    ? "bg-[var(--secondary)] text-white shadow-emerald-500/20" 
                    : "bg-[var(--error)] text-white shadow-red-500/20"
                  }`}>
                    {lastAnswerCorrect ? <CheckCircle size={48} strokeWidth={2.5} /> : <XCircle size={48} strokeWidth={2.5} />}
                  </div>
                  <div className="space-y-4">
                    <h3 className={`text-3xl font-[var(--font-display)] font-black uppercase tracking-tight ${lastAnswerCorrect ? 'text-[var(--secondary)]' : 'text-[var(--error)]'}`}>
                      {lastAnswerCorrect ? '¡Correcta!' : 'Respuesta incorrecta'}
                    </h3>
                    <p className="text-base font-medium text-[var(--on-surface-variant)] leading-relaxed max-w-[300px] mx-auto">
                      {currentExplanation}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3 opacity-30 mt-6">
                    <div className="h-1 w-12 bg-[var(--primary)] rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Siguiente Segmento en proceso</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="question"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 flex flex-col"
                >
                  <div className="space-y-4 mb-10">
                    <div className="size-2 w-16 bg-[var(--primary)] rounded-full opacity-30" />
                    <h2 className="text-3xl font-[var(--font-display)] font-black leading-[1.1] text-[var(--on-surface)]">
                      {currentTrivia.pregunta}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(currentTrivia.opciones).map(([key, val]) => (
                      <motion.button
                        key={key}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(key)}
                        className="w-full p-6 premium-card text-left flex items-center gap-5 group hover:border-[var(--primary)] transition-all"
                      >
                        <div className="size-9 shrink-0 rounded-xl bg-[var(--surface-container-high)] flex items-center justify-center text-[13px] font-black text-[var(--on-surface-variant)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all shadow-sm">
                          {key}
                        </div>
                        <span className="text-[17px] font-semibold text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors">
                          {val}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-10"
          >
            <div className="relative">
              <ScienceCore size={180} showAccessories={false} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Trophy size={42} className={puntos > 0 ? "text-[var(--primary)]" : "text-[var(--on-surface-variant)]/30"} />
              </div>
            </div>

            <div className="text-center space-y-3">
              <h2 className="text-4xl font-[var(--font-display)] font-black text-[var(--on-surface)] uppercase tracking-tight">Trivia finalizada</h2>
              <p className="text-sm font-medium text-[var(--on-surface-variant)] opacity-60 max-w-[280px] mx-auto leading-relaxed">
                Tus puntos ya fueron registrados. Continúa con tu recorrido por la feria.
              </p>
            </div>

            <div className="w-full grid grid-cols-2 gap-4">
              <div className="premium-card p-6 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--on-surface-variant)] opacity-50">PUNTOS</span>
                <span className="text-3xl font-black text-[var(--primary)]">{puntos}</span>
              </div>
              <div className="premium-card p-6 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--on-surface-variant)] opacity-50">ESTADO</span>
                <span className="text-sm font-bold text-[var(--secondary)]">SINCRONIZADO</span>
              </div>
            </div>

            <button 
              onClick={() => navigate("/mapa")}
              className="w-full h-18 bg-[var(--primary)] text-white rounded-[2rem] font-bold uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] action-glow"
            >
              Regresar al Mapa <ChevronRight size={22} />
            </button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};



