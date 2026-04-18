import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  QrCode,
  Users,
  CheckCircle,
  XCircle,
  FlaskConical,
  MessageSquare,
  Zap,
  Target,
  ArrowRight
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { Navigation } from "../components/Navigation";
import { getStudentSession } from "../lib/studentSession";
import { ScienceCore } from "../components/ScienceCore";

interface Estacion {
  id: string;
  nombre: string;
  categoria: string;
  materia: string;
  docente_responsable: string;
  grupo: string;
  descripcion_pedagogica: string;
  proceso: string;
  meta: string;
  visitantes_activos: number;
}

export const StandDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stand, setStand] = useState<Estacion | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [alreadyVisited, setAlreadyVisited] = useState(false);
  const [visitResult, setVisitResult] = useState<"correct" | "incorrect" | null>(null);
  const [question, setQuestion] = useState("");
  const [isSendingQuestion, setIsSendingQuestion] = useState(false);
  const [questionSent, setQuestionSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const { studentId, sessionToken } = getStudentSession();

  useEffect(() => {
    const fetchStand = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("estaciones").select("*").eq("id", id).single();
      if (!error) setStand(data);

      if (studentId && sessionToken && id) {
        const { data: progreso } = await supabase.rpc("obtener_progreso_estudiante_v1", {
          p_estudiante_id: studentId,
          p_session_token: sessionToken,
        });

        const progresoActual = progreso?.find((item: { estacion_id: string }) => item.estacion_id === id);
        if (progresoActual) {
          setAlreadyVisited(true);
          setVisitResult(progresoActual.trivia_respondida_correctamente ? "correct" : "incorrect");
        }
      }
      setLoading(false);
    };
    fetchStand();
  }, [id, sessionToken, studentId]);

  const handleCheckIn = async () => {
    setShowQRModal(true);
    try {
      if (studentId && sessionToken && id) {
        const { data, error: rpcError } = await supabase.rpc("registrar_progreso_v2", {
          p_estudiante_id: studentId,
          p_estacion_id: id,
          p_puntos_ganados: 0,
          p_session_token: sessionToken,
        });
        if (rpcError || !data?.success) throw new Error(data?.message || "Error en check-in.");
      }
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => {
      setShowQRModal(false);
      setCheckedIn(true);
    }, 2000);
  };

  const handleSendQuestion = async () => {
    if (!question.trim() || !studentId || !sessionToken || !id) return;
    setIsSendingQuestion(true);
    try {
      const { error } = await supabase.from("preguntometro").insert({
        estudiante_id: studentId,
        estacion_id: id,
        pregunta: question.trim(),
        moderacion_estado: "pendiente"
      });
      if (!error) {
        setQuestionSent(true);
        setQuestion("");
        setTimeout(() => setQuestionSent(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingQuestion(false);
    }
  };

  if (loading) return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
        <ScienceCore size={100} />
        <p className="text-[9px] font-black tracking-[0.4em] uppercase text-[var(--primary)] animate-pulse">Cargando stand...</p>
      </div>
    </Layout>
  );

  if (!stand) return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <XCircle size={48} className="text-[var(--error)] opacity-20" />
        <h2 className="text-xl font-[var(--font-display)] font-black uppercase tracking-tight">Stand no encontrado</h2>
        <button onClick={() => navigate("/mapa")} className="px-8 py-3 bg-[var(--surface-container)] rounded-xl text-[9px] font-black uppercase tracking-widest">
          Volver al mapa
        </button>
      </div>
    </Layout>
  );

  if (alreadyVisited) return (
    <Layout title={stand.nombre}>
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="relative">
          <div className={`size-32 rounded-3xl flex items-center justify-center shadow-2xl ${
            visitResult === "correct" ? "bg-[var(--secondary)] text-white shadow-[var(--secondary)]/20" : "bg-[var(--error)] text-white shadow-[var(--error)]/20"
          }`}>
            {visitResult === "correct" ? <CheckCircle size={54} /> : <XCircle size={54} />}
          </div>
        </motion.div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-[var(--font-display)] font-black uppercase tracking-tight text-[var(--on-surface)]">
            {visitResult === "correct" ? "Registro completado" : "Visita registrada"}
          </h2>
          <p className="text-[12px] font-bold text-[var(--on-surface-variant)] leading-relaxed max-w-[240px] mx-auto opacity-50 uppercase tracking-wide">
            {visitResult === "correct" ? "Los datos de este módulo han sido verificados correctamente." : "Ya registraste tu visita a este stand."}
          </p>
        </div>

        <button onClick={() => navigate("/mapa")} className="w-full max-w-xs h-16 bg-[var(--on-background)] text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 shadow-xl">
          Explorar otro stand
        </button>
      </div>
      <Navigation />
    </Layout>
  );

  return (
    <Layout title={stand.materia}>
      <div className="flex flex-col gap-6 px-6 py-8 pb-40">
        
        {/* Main Station Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-6 bg-gradient-to-br from-white to-[var(--surface-container-low)]">
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-wrap gap-2">
               <span className="px-3 py-1 bg-[var(--primary-container)] rounded-lg text-[9px] font-black tracking-widest text-[var(--primary)] uppercase">
                {stand.categoria}
              </span>
              <span className="px-3 py-1 bg-[var(--surface-container-high)] rounded-lg text-[9px] font-black tracking-widest opacity-40 uppercase">
                G {stand.grupo}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--secondary-container)] rounded-lg text-[var(--secondary)]">
              <Users size={12} />
              <span className="text-[10px] font-black uppercase">{stand.visitantes_activos}</span>
            </div>
          </div>

          <h1 className="text-3xl font-[var(--font-display)] font-black leading-tight mb-3 uppercase tracking-tight">
            {stand.nombre}
          </h1>
          <p className="text-[12px] font-bold text-[var(--on-surface-variant)] leading-relaxed opacity-60 uppercase tracking-wide">
            {stand.descripcion_pedagogica}
          </p>
          
          <div className="mt-8 pt-4 border-t border-[var(--outline-variant)]/20 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Científico a Cargo</span>
              <span className="text-[11px] font-black text-[var(--on-background)] uppercase">{stand.docente_responsable}</span>
            </div>
            <FlaskConical size={20} className="text-[var(--primary)] opacity-20" />
          </div>
        </motion.div>

        {!checkedIn ? (
          <div className="flex flex-col items-center py-10 text-center space-y-6">
            <div className="size-20 rounded-full bg-[var(--primary-container)] flex items-center justify-center text-[var(--primary)] shadow-inner">
              <QrCode size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black uppercase tracking-tight">Check-in QR</h3>
              <p className="text-[11px] font-bold text-[var(--on-surface-variant)] max-w-[200px] opacity-40 uppercase tracking-wider">Escanea el código QR del stand para registrar tu visita.</p>
            </div>
            <button 
              onClick={handleCheckIn}
              className="w-full max-w-xs h-14 bg-[var(--primary)] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs action-glow flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-blue-500/20"
            >
              Registrar visita <Target size={18} />
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-5 bg-[var(--tertiary-container)] border border-[var(--tertiary)]/10 rounded-2xl flex gap-4">
              <Zap size={20} className="text-[var(--tertiary)] shrink-0" />
              <p className="text-[11px] font-bold text-[var(--on-tertiary-container)] leading-snug uppercase tracking-wide">
                Escucha la explicación del stand. Al finalizar, podrás responder la trivia para ganar puntos.
              </p>
            </div>

            <div className="space-y-4">
              <div className="premium-card p-0 overflow-hidden bg-white/50 border-[var(--outline-variant)]">
                <div className="px-5 py-3 border-b border-[var(--outline-variant)]/40 flex items-center gap-2">
                  <MessageSquare size={14} className="text-[var(--primary)]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Preguntómetro</span>
                </div>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Escribe tu duda científica..."
                  disabled={questionSent || isSendingQuestion}
                  className="w-full h-28 bg-transparent p-5 text-sm font-bold text-[var(--on-background)] placeholder:text-[var(--on-surface-variant)]/20 focus:outline-none resize-none"
                />
                <div className="p-4 bg-[var(--surface-container-low)] flex justify-end">
                   <button
                    onClick={handleSendQuestion}
                    disabled={!question.trim() || isSendingQuestion || questionSent}
                    className={`px-6 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      questionSent ? "bg-[var(--secondary)] text-white" : "bg-[var(--primary)] text-white opacity-90 active:scale-95"
                    }`}
                  >
                    {isSendingQuestion ? "Enviando..." : questionSent ? "✓ Enviada" : "Enviar Pregunta"}
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  sessionStorage.setItem(`trivia_access_${id}`, "true");
                  navigate(`/trivia/${id}`);
                }}
                className="w-full h-16 bg-[var(--on-background)] text-white rounded-3xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl active:scale-95 space-x-3 flex items-center justify-center"
              >
                <span>Responder trivia</span>
                <ArrowRight size={18} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {showQRModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-white/95 backdrop-blur-2xl z-[100] flex flex-col items-center justify-center p-8 gap-8">
              <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                <QrCode size={100} className="text-[var(--primary)]" />
              </motion.div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-[var(--font-display)] font-black uppercase tracking-tight text-[var(--primary)]">Registrando visita...</h2>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Verificando acceso del stand</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Navigation />
    </Layout>
  );
};



