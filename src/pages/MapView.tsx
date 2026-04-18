import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Navigation } from "../components/Navigation";
import { getStudentSession } from "../lib/studentSession";
import { ScienceCore } from "../components/ScienceCore";
import { MapPin, Search, CheckCircle, Lock, XCircle, ArrowRight } from "lucide-react";

interface Estacion {
  id: string;
  nombre: string;
  materia: string;
  categoria: string;
}

interface Progreso {
  estacion_id: string;
  trivia_respondida_correctamente: boolean;
  visitado_en: string;
}

export const MapView: React.FC = () => {
  const [estaciones, setEstaciones] = useState<Estacion[]>([]);
  const [progreso, setProgreso] = useState<Progreso[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { studentId, sessionToken } = getStudentSession();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: estData } = await supabase.from("estaciones").select("*");
      setEstaciones(estData || []);

      if (studentId && sessionToken) {
        const { data: progData } = await supabase.rpc("obtener_progreso_estudiante_v1", {
          p_estudiante_id: studentId,
          p_session_token: sessionToken,
        });
        setProgreso(progData || []);
      }
      setLoading(false);
    };
    fetchData();
  }, [studentId, sessionToken]);

  const getStandStatus = (estacionId: string) => {
    const p = progreso.find((pr) => pr.estacion_id === estacionId);
    if (!p) return "disponible";
    if (p.trivia_respondida_correctamente) return "completado";
    return "visitado";
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "completado":
        return {
          icon: <CheckCircle size={14} />,
          text: "VERIFICADO",
          color: "var(--secondary)",
          bg: "var(--secondary-container)",
          onBg: "var(--on-secondary-container)"
        };
      case "visitado":
        return {
          icon: <XCircle size={14} />,
          text: "FINALIZADO",
          color: "var(--error)",
          bg: "var(--error-container)",
          onBg: "var(--on-error-container)"
        };
      default:
        return {
          icon: <Lock size={14} />,
          text: "PENDIENTE",
          color: "var(--primary)",
          bg: "var(--primary-container)",
          onBg: "var(--on-primary-container)"
        };
    }
  };

  const filteredEstaciones = estaciones.filter((e) =>
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.materia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-6">
        <ScienceCore size={140} />
        <div className="text-center space-y-2">
          <p className="text-[10px] font-black tracking-[0.4em] uppercase text-[var(--primary)] animate-pulse">Cargando mapa...</p>
          <div className="w-32 h-1 bg-[var(--surface-container-high)] rounded-full overflow-hidden">
            <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="h-full bg-[var(--primary)] w-1/2" />
          </div>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout title="Mapa de la feria">
      <div className="flex flex-col gap-6 px-6 py-8 pb-40">
        
        {/* Search & Stats Module */}
        <div className="space-y-4">
          <div className="premium-card p-4 flex items-center gap-4 bg-white/50 border-[var(--outline-variant)]/40 shadow-sm">
            <Search size={20} className="text-[var(--primary)] opacity-40" />
            <input
              type="text"
              placeholder="Buscar estación o materia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm font-bold text-[var(--on-background)] placeholder:text-[var(--on-surface-variant)]/20 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-2">
               <MapPin size={14} className="text-[var(--primary)]" />
               <span className="text-[10px] font-black uppercase tracking-widest text-[var(--on-surface-variant)] opacity-40">Stands disponibles: {filteredEstaciones.length}</span>
             </div>
             <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-[var(--secondary)] animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--secondary)]">Online</span>
             </div>
          </div>
        </div>

        {/* Grid Stations */}
        <div className="grid grid-cols-1 gap-4">
          {filteredEstaciones.map((est) => {
            const status = getStandStatus(est.id);
            const info = getStatusInfo(status);

            return (
              <motion.div
                key={est.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/stand/${est.id}`)}
                className="premium-card p-5 group cursor-pointer border-[var(--outline-variant)]/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <div 
                    style={{ "--badge-bg": info.bg, "--badge-color": info.color } as React.CSSProperties}
                    className="dynamic-badge flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase opacity-60"
                  >
                    {info.icon}
                    {info.text}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter opacity-20 group-hover:opacity-100 group-hover:text-[var(--primary)] transition-all">
                    ID-{est.id.slice(0,4)}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-[var(--font-display)] font-black uppercase tracking-tight text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors">
                    {est.nombre}
                  </h3>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-[var(--on-surface-variant)] opacity-40 uppercase tracking-widest">{est.materia}</span>
                     <div className="size-1 rounded-full bg-[var(--surface-container-highest)]" />
                     <span className="text-[10px] font-bold text-[var(--primary)] uppercase opacity-60 tracking-widest">{est.categoria}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                   <div className="size-10 rounded-2xl bg-[var(--surface-container-low)] flex items-center justify-center text-[var(--on-surface-variant)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                      <ArrowRight size={18} strokeWidth={3} />
                   </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredEstaciones.length === 0 && (
          <div className="py-20 text-center space-y-4">
             <div className="size-16 rounded-full bg-[var(--surface-container)] mx-auto flex items-center justify-center opacity-20">
                <Search size={32} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-30">No se encontraron stands con ese criterio</p>
          </div>
        )}
      </div>
      <Navigation />
    </Layout>
  );
};


