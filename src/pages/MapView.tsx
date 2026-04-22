import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Compass, Users, CheckCircle, Lock, XCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Navigation } from "../components/Navigation";
import { SaseNeuralCore } from "../components/SaseNeuralCore";
import { getStudentSession } from "../lib/studentSession";

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
  Matemáticas: "var(--chemistry-purple)", 
  Biología: "var(--biology-green)",
  Geografía: "var(--physics-blue)",
  Física: "var(--crimson)",
  Química: "var(--robotics-orange)",
};

const MATERIA_EMOJI: Record<string, string> = {
  Matemáticas: "📐",
  Biología: "🧬",
  Geografía: "🌎",
  Física: "⚡",
  Química: "🧪",
};

export const MapView: React.FC = () => {
  const navigate = useNavigate();
  const [estaciones, setEstaciones] = useState<Estacion[]>([]);
  const [progreso, setProgreso] = useState<ProgresoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { studentGroup: userGroup, studentId, sessionToken } = getStudentSession();

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
        if (studentId && sessionToken) {
          const { data: prog, error: progErr } = await supabase.rpc(
            "obtener_progreso_estudiante_v1",
            {
              p_estudiante_id: studentId,
              p_session_token: sessionToken,
            },
          );

          if (!progErr) setProgreso(prog || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    const channel = supabase
      .channel("realtime-estaciones")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "estaciones" },
        (payload) => {
          setEstaciones((prev) =>
            prev.map((est) =>
              est.id === payload.new.id
                ? { ...est, visitantes_activos: payload.new.visitantes_activos }
                : est
            )
          );
        }
      )
      .subscribe();

    fetchData();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionToken, studentId]);

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
          text: "✅ ¡Éxito!",
          color: "#00ff88",
          bg: "rgba(0,255,136,0.15)",
        };
      case "visitado":
        return {
          icon: <XCircle size={14} />,
          text: "❌ Reintentar",
          color: "#ff4d4d",
          bg: "rgba(255,77,77,0.15)",
        };
      default:
        return {
          icon: <Lock size={14} />,
          text: "🔓 Explorar",
          color: "var(--gold)",
          bg: "rgba(255,215,0,0.1)",
        };
    }
  };

  // Stand sugerido: el que no ha visitado y tiene menos gente
  const standSugerido = estaciones
    .filter((e) => getStandStatus(e.id) === "disponible")
    .sort((a, b) => (a.visitantes_activos || 0) - (b.visitantes_activos || 0))[0];

  return (
    <Layout title="🧭 Brújula del Tesoro">
      <div className="flex flex-col gap-6 p-6 pb-24 max-w-lg mx-auto min-h-full overflow-y-auto">
        
        {/* Header de Expedición Premium */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/20 blur-lg rounded-full animate-pulse"></div>
              <div className="relative size-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Compass size={20} className="text-amber-400" />
              </div>
            </div>
            <div>
              <div className="title-sase text-base">Grupo {userGroup}</div>
              <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Expedición 2026</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-black text-amber-400">
              {Math.round((progreso.filter((p) => p.trivia_respondida_correctamente).length / (estaciones.length || 1)) * 100)}%
            </div>
            <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">PROGRESO</div>
          </div>
        </div>

        {/* Barra de Progreso High-Fidelity */}
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${estaciones.length > 0 ? (progreso.filter((p) => p.trivia_respondida_correctamente).length / estaciones.length) * 100 : 0}%`,
            }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-400 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          />
        </div>

        {/* Recomendación de IA (Sasito) */}
        {standSugerido && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="surface-card-strong p-6 relative overflow-hidden group border-amber-500/20"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Compass size={120} />
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="size-2 rounded-full bg-amber-400 animate-ping"></div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">Asignación de Sasito</span>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex-shrink-0 relative">
                 <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full"></div>
                 <SaseNeuralCore size={70} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-black text-white truncate mb-1">{standSugerido.nombre}</h4>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border ${
                    standSugerido.materia === 'Física' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    standSugerido.materia === 'Biología' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {standSugerido.materia}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-bold">
                    <Users size={12} /> {standSugerido.visitantes_activos}/20
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/stand/${standSugerido.id}`)}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl text-amber-950 font-black uppercase tracking-widest text-xs shadow-xl active:scale-[0.98] transition-transform"
            >
              Iniciar Misión
            </button>
          </motion.div>
        )}

        {/* Mapa Estelar de Estaciones */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h3 className="title-sase text-lg">Mapa Estelar</h3>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>

          {loading ? (
            <div className="py-12 text-center flex flex-col items-center gap-4">
              <div className="size-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Localizando estaciones...</span>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-3"
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
                    layout
                    whileTap={!isBlocked ? { scale: 0.98 } : {}}
                    onClick={() => !isBlocked && navigate(`/stand/${estacion.id}`)}
                    className={`surface-card p-4 flex items-center gap-4 transition-all ${
                      isBlocked ? "opacity-50 grayscale bg-white/[0.02]" : "hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className={`size-12 rounded-2xl flex items-center justify-center text-2xl border shadow-lg ${
                      isBlocked ? "bg-white/5 border-white/5" : "bg-white/5 border-white/10"
                    }`} style={{ borderColor: isBlocked ? undefined : `${color}33` }}>
                      {MATERIA_EMOJI[estacion.materia] || "🔬"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-white/90 truncate mb-1">{estacion.nombre}</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black uppercase tracking-wider" style={{ color }}>{estacion.materia}</span>
                        {!isBlocked && (
                          <div className="flex items-center gap-1 text-[9px] text-white/30 font-bold uppercase">
                            <Users size={10} /> {estacion.visitantes_activos}/20
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-colors ${
                      status === 'completado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      status === 'visitado' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      'bg-white/5 text-white/30 border-white/10'
                    }`}>
                      {badge.text.split(' ')[1] || badge.text}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Estado Final */}
        {!loading && estaciones.length > 0 && !standSugerido && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="surface-card-strong p-8 text-center border-emerald-500/30"
          >
            <div className="size-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle size={32} className="text-emerald-400" />
            </div>
            <h3 className="text-emerald-400 text-xl font-black mb-3">¡Misión Cumplida!</h3>
            <p className="text-xs text-white/50 leading-relaxed mb-8">
              Has explorado todos los rincones de la ciencia. Tu conocimiento ha crecido exponencialmente.
            </p>
            <button
              onClick={() => navigate("/ranking")}
              className="w-full py-4 bg-emerald-600 rounded-2xl text-emerald-950 font-black uppercase tracking-widest text-xs shadow-xl"
            >
              Consultar Tabla de Honor
            </button>
          </motion.div>
        )}
      </div>
      <Navigation />
    </Layout>
  );
};
