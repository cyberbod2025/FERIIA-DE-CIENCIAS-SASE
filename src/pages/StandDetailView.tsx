import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  QrCode,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  XCircle,
  FlaskConical,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { getStudentSession } from "../lib/studentSession";

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
  const [alreadyVisited, setAlreadyVisited] = useState(false);
  const [visitResult, setVisitResult] = useState<"correct" | "incorrect" | null>(null);
  const [question, setQuestion] = useState("");
  const [isSendingQuestion, setIsSendingQuestion] = useState(false);
  const [questionSent, setQuestionSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const { studentId, sessionToken } = getStudentSession();

  const fetchStand = async () => {
    const { data, error } = await supabase.from("estaciones").select("*").eq("id", id).single();
    if (!error) setStand(data);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchStand();
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
    init();

    // Suscripción en tiempo real para ocupación
    const sub = supabase.channel(`stand-${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'estaciones', filter: `id=eq.${id}` }, 
      (payload) => setStand(payload.new as Estacion))
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, [id, sessionToken, studentId]);

  const handleCheckIn = async () => {
    setErrorMsg("");
    try {
      if (studentId && sessionToken && id) {
        const { data, error: rpcError } = await supabase.rpc("registrar_progreso_v2", {
          p_estudiante_id: studentId,
          p_estacion_id: id,
          p_puntos_ganados: 0,
          p_session_token: sessionToken,
        });

        if (rpcError || !data?.success) {
          const msg = data?.message || "Error al registrar check-in.";
          setErrorMsg(msg.includes("llena") ? "🛑 STAND LLENO (Máx 20): Por favor espera a que otros alumnos salgan." : msg);
          return;
        }
      }
      
      setTimeout(() => {
        setCheckedIn(true);
      }, 1500);
    } catch (err) {
      setErrorMsg("Error de conexión.");
    }
  };

  const handleSendQuestion = async () => {
    if (!question.trim() || !studentId || !id) return;
    setIsSendingQuestion(true);
    try {
      const { error } = await supabase.from("preguntometro").insert({
        estudiante_id: studentId,
        estacion_id: id,
        pregunta: question.trim(),
        moderacion_estado: "pendiente"
      });
      if (error) throw error;
      setQuestionSent(true);
      setQuestion("");
      setTimeout(() => setQuestionSent(false), 3000);
    } catch (err) {
      setErrorMsg("No se pudo enviar la pregunta.");
    } finally {
      setIsSendingQuestion(false);
    }
  };

  if (loading) return (
    <Layout title="Sincronizando...">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FlaskConical size={40} className="text-blue-400 animate-pulse" />
        <p className="mt-4 text-xs font-bold text-white/30 uppercase tracking-widest">Analizando Módulo...</p>
      </div>
    </Layout>
  );

  if (!stand) return (
    <Layout title="Error">
      <div className="p-8 text-center text-white">
        <XCircle size={64} className="mx-auto mb-4 text-red-500/30" />
        <h2 className="text-xl font-black italic">Módulo Extraviado</h2>
        <button onClick={() => navigate("/mapa")} className="w-full py-4 mt-8 font-black text-black rounded-xl bg-blue-400">VOLVER AL MAPA</button>
      </div>
    </Layout>
  );

  if (alreadyVisited) return (
    <Layout title={stand.nombre}>
      <div className="flex flex-col items-center justify-center p-6 space-y-8 text-center min-h-[70vh]">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`size-24 rounded-full flex items-center justify-center ${visitResult === "correct" ? "bg-green-500/20 border border-green-500/30" : "bg-red-500/20 border border-red-500/30"}`}>
          {visitResult === "correct" ? <CheckCircle size={48} className="text-green-400" /> : <XCircle size={48} className="text-red-400" />}
        </motion.div>
        <div>
          <p className="mt-3 text-sm text-white/40 leading-relaxed">
            {visitResult === "correct" ? "Has completado este módulo con éxito. ¡Sigue explorando!" : "Ya has agotado tus intentos en este módulo de investigación."}
          </p>
        </div>
        <button onClick={() => navigate("/mapa")} className="w-full py-5 font-black text-white rounded-2xl bg-white/5 border border-white/10 active:scale-95 transition-all">VOLVER AL MAPA</button>
      </div>
    </Layout>
  );

  return (
    <Layout title={stand.nombre} showNav={true}>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col p-5 space-y-6 pb-24">
        {/* Stand Header */}
        <motion.div variants={itemVariants} className="surface-card-strong p-6 relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 p-8 opacity-5"><FlaskConical size={120} /></div>
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full">{stand.categoria}</span>
            <span className="px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full">G-{stand.grupo}</span>
          </div>
          <h2 className="text-2xl font-black text-white leading-none mb-4 italic uppercase tracking-tighter">{stand.nombre}</h2>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Investigador Jefe</p>
            <p className="text-sm font-bold text-white/80">{stand.docente_responsable}</p>
          </div>
          <div className="mt-6 pt-6 border-t border-white/5">
            {/* BUG FIX: Handle newline-separated description */}
            <div className="space-y-3">
              {(stand.descripcion_pedagogica || "Sin descripción disponible.").split("\n").map((line, i) => (
                <p key={i} className="text-sm leading-relaxed text-white/50">{line}</p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Occupancy Indicator */}
        <motion.div variants={itemVariants} className="surface-card p-4 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3">
            <div className={`size-3 rounded-full animate-pulse ${stand.visitantes_activos >= 20 ? "bg-red-500 shadow-[0_0_10px_red]" : "bg-green-500 shadow-[0_0_10px_green]"}`} />
            <div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Ocupación Actual</p>
              <p className="text-sm font-black text-white">{stand.visitantes_activos} / 20 <span className="text-white/20 ml-1">alumnos</span></p>
            </div>
          </div>
          <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-500 ${stand.visitantes_activos >= 20 ? "bg-red-500" : "bg-blue-400"}`} style={{ width: `${(stand.visitantes_activos / 20) * 100}%` }} />
          </div>
        </motion.div>

        {!checkedIn ? (
          <motion.div variants={itemVariants} className="flex flex-col items-center py-6 text-center">
            <div className="size-20 mb-6 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
              <QrCode size={40} className="text-blue-400/50" />
            </div>
            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Escaneo de Módulo</h3>
            <p className="mt-2 text-xs text-white/30 max-w-[200px] font-bold">Identifícate en la estación para habilitar la trivia.</p>
            
            {errorMsg && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 border bg-red-500/10 border-red-500/20 rounded-xl w-full">
                <p className="text-[11px] font-black text-red-400 text-center uppercase tracking-wider">{errorMsg}</p>
              </motion.div>
            )}

            <button 
              onClick={handleCheckIn} 
              disabled={stand.visitantes_activos >= 20}
              className={`w-full py-5 mt-8 font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 ${
                stand.visitantes_activos >= 20 
                ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed" 
                : "bg-gradient-to-br from-blue-400 to-blue-700 text-white shadow-xl shadow-blue-500/10 active:scale-95"
              }`}
            >
              {stand.visitantes_activos >= 20 ? "MÓDULO SATURADO" : "SIMULAR ESCANEO"} <ArrowRight size={18} />
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-5 surface-card-strong border border-blue-400/20 flex gap-4 items-start">
              <Star size={20} className="text-blue-400 shrink-0 mt-1" />
              <p className="text-xs text-blue-100/70 font-bold leading-relaxed uppercase tracking-tighter">
                Acceso Concedido. Escucha la explicación y luego resuelve el desafío para sumar puntos.
              </p>
            </div>

            <div className="surface-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-blue-400" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-white/80">Preguntómetro</span>
                </div>
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">Modo Seguro</span>
              </div>
              
              <div className="relative">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="¿Tienes alguna duda científica?"
                  className="w-full h-24 p-4 text-sm text-white transition-all border outline-none bg-black/40 border-white/5 focus:border-blue-400/30 rounded-xl placeholder:text-white/10 resize-none"
                />
                <button
                  onClick={handleSendQuestion}
                  disabled={!question.trim() || isSendingQuestion || questionSent}
                  className={`absolute bottom-3 right-3 px-4 py-2 text-[10px] font-black rounded-lg transition-all ${questionSent ? "bg-green-500 text-white" : "bg-blue-400 text-black active:scale-90"}`}
                >
                  {questionSent ? "✓ ENVIADA" : "ENVIAR"}
                </button>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    sessionStorage.setItem(`trivia_access_${id}`, "true");
                    navigate(`/trivia/${id}`);
                  }}
                  className="w-full py-5 font-black text-white uppercase tracking-[0.3em] text-sm rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-xl shadow-amber-500/10 active:scale-95 transition-all"
                >
                  ABRIR TRIVIA
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};
