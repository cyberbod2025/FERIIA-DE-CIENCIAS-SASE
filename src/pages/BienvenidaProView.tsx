import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Navigation } from "../components/Navigation";
import { getStudentSession } from "../lib/studentSession";
import { supabase } from "../lib/supabase";
import { Map, ArrowRight, Sparkles, Microscope, Atom, Beaker, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface EstacionResumen {
  id: string;
  nombre: string;
  materia: string;
  categoria: string;
  visitantes_activos: number;
}

interface ProgresoResumen {
  estacion_id: string;
}

const CATEGORIES = [
  { id: "all", name: "Todos", color: "primary" },
  { id: "biologia", name: "Biología", color: "green-500", icon: <Microscope size={14} /> },
  { id: "fisica", name: "Física", color: "orange-500", icon: <Atom size={14} /> },
  { id: "quimica", name: "Química", color: "tertiary", icon: <Beaker size={14} /> },
  { id: "geografia", name: "Geografía", color: "blue-400", icon: <Globe size={14} /> },
];

export const BienvenidaProView: React.FC = () => {
  const navigate = useNavigate();
  const { studentName } = getStudentSession();
  const [stations, setStations] = useState<EstacionResumen[]>([]);
  const [progress, setProgress] = useState<ProgresoResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const session = getStudentSession();

      const [stationsRes, progressRes] = await Promise.all([
        supabase.from("estaciones").select("id,nombre,materia,categoria,visitantes_activos").order("nombre"),
        session.studentId && session.sessionToken
          ? supabase.rpc("obtener_progreso_estudiante_v1", {
              p_estudiante_id: session.studentId,
              p_session_token: session.sessionToken,
            })
          : Promise.resolve({ data: [] as ProgresoResumen[] }),
      ]);

      setStations((stationsRes.data as EstacionResumen[]) || []);
      setProgress((progressRes.data as ProgresoResumen[]) || []);
      setLoading(false);
    };

    loadData();
  }, []);

  const progressCount = progress.length;
  const totalStations = stations.length;
  const progressPercent = totalStations > 0 ? Math.round((progressCount / totalStations) * 100) : 0;

  const nextStand = useMemo(() => {
    const visited = new Set(progress.map((item) => item.estacion_id));
    const available = stations
      .filter((station) => !visited.has(station.id))
      .sort((a, b) => (a.visitantes_activos || 0) - (b.visitantes_activos || 0));
    
    return available[0] || null;
  }, [progress, stations]);

  const filteredStations = useMemo(() => {
    if (filter === "all") return stations;
    return stations.filter(s => s.materia?.toLowerCase().includes(filter) || s.categoria?.toLowerCase().includes(filter));
  }, [stations, filter]);

  const firstName = studentName?.split(" ")[0] || "Explorador";

  return (
    <Layout title="Dashboard Alumno" hideFooter>
      <div className="px-6 py-8 pb-36 space-y-8 min-h-screen bg-transparent relative z-10">
        
        {/* HEADER SECTION */}
        <header className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] tracking-[0.2em] uppercase">
            <Sparkles size={12} fill="currentColor" />
            Secundaria Diurna 310
          </div>
          <h2 className="font-headline font-bold text-4xl text-on-surface leading-tight">
            ¡Hola, <span className="text-primary">{firstName}</span>!
          </h2>
          <p className="text-on-surface-variant text-sm font-light uppercase opacity-70">
            Explora la innovación y el talento de nuestra comunidad.
          </p>
        </header>

        {/* PROGRESS & RECOMMENDATION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="glass-card premium-card rounded-[2rem] p-6 relative overflow-hidden shadow-xl border-white/20">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex justify-between items-end mb-4 relative z-10">
              <div>
                <span className="text-5xl font-headline font-bold text-primary">{loading ? "--" : progressCount}</span>
                <span className="text-xl font-headline font-bold text-on-surface-variant">/{loading ? "--" : totalStations}</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-dim">Check-ins realizados</p>
              </div>
            </div>
            <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-primary progress-fill-premium shadow-[0_0_12px_rgba(var(--primary-rgb),0.4)]"
              />
            </div>
            <p className="mt-4 text-[10px] text-on-surface-variant font-black uppercase tracking-wider relative z-10 opacity-50">
              {loading ? "Calculando trayectoria..." : `Has descubierto el ${progressPercent}% de la feria científica.`}
            </p>
          </section>

          <section className="crystal-panel rounded-[2rem] p-6 flex flex-col justify-between border-primary/10 shadow-lg bg-white/20 backdrop-blur-md">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-secondary uppercase mb-2 block">Recomendación Smart</span>
              <h3 className="text-xl font-bold text-on-surface uppercase truncate">
                {nextStand ? nextStand.nombre : "¡Recorrido completo!"}
              </h3>
              <p className="text-[10px] text-on-surface-variant mt-1 uppercase opacity-60 font-bold">
                {nextStand 
                  ? "Baja afluencia en este momento. ¡Ideal para interactuar!" 
                  : "Has validado todos los stands. ¡Consulta el ranking!"}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-secondary-container/30 text-secondary p-2 rounded-xl">
                   <Microscope size={18} />
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-outline opacity-40">Estado</span>
                  <span className="text-xs font-bold text-secondary uppercase">{nextStand ? 'Disponible' : 'Finalizado'}</span>
                </div>
              </div>
              <button
                onClick={() => navigate(nextStand ? `/stand/${nextStand.id}` : "/ranking")}
                className="bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                {nextStand ? "Ir ahora" : "Ver Ranking"}
                <ArrowRight size={16} />
              </button>
            </div>
          </section>
        </div>

        {/* MODULES GRID SECTION */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Map size={20} />
              </div>
              <h2 className="text-2xl font-bold font-headline uppercase tracking-tight">Módulos de Exposición</h2>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${
                    filter === cat.id 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "bg-white/40 text-outline hover:bg-white/60 backdrop-blur-sm border border-white/40"
                  }`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-card h-32 rounded-3xl animate-pulse bg-surface-container" />
              ))
            ) : filteredStations.length > 0 ? (
              filteredStations.map((station) => (
                <div 
                  key={station.id}
                  onClick={() => navigate(`/stand/${station.id}`)}
                  className="glass-panel refractive-boundary p-4 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 active:scale-95 transition-all group border-b-4 border-b-transparent hover:border-b-primary shadow-sm bg-white/40 backdrop-blur-sm"
                >
                  <span className="text-xl font-bold font-headline text-primary group-hover:scale-110 transition-transform uppercase">
                    {station.nombre.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-tighter text-on-surface-variant opacity-70 mt-1 line-clamp-1 px-2">
                    {station.nombre.split(' ').slice(1).join(' ') || station.materia}
                  </span>
                  <div className={`mt-3 size-1.5 rounded-full ${
                    progress.some(p => p.estacion_id === station.id) ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-outline/30"
                  }`} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-on-surface-variant font-bold uppercase opacity-30 tracking-widest">
                No se encontraron módulos.
              </div>
            )}
          </div>
        </section>

      </div>
      <Navigation />
    </Layout>
  );
};
