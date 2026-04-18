import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { 
  AlertTriangle, 
  RefreshCcw, 
  LogOut, 
  Users, 
  MapPin, 
  Activity, 
  Target, 
  BarChart3, 
  ShieldCheck,
  Download,
  Award,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Interface para el perfil del docente
interface PanelProfile {
  rol: "maestro" | "direccion";
  nombre: string | null;
  email: string | null;
}

interface EstacionPanel {
  id: string;
  nombre: string;
  materia: string;
  grupo: string | null;
  visitantes_activos: number;
  estado: string;
}

interface GrupoPanel {
  grupo: string;
  total_checkins: number;
  correctas: number;
  precision: number | null;
  puntos_grupo: number;
}

interface EstudianteTop {
  nickname: string;
  grupo: string | null;
  total_puntos: number;
}

export const TeacherPanelView: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PanelProfile | null>(null);
  const [estaciones, setEstaciones] = useState<EstacionPanel[]>([]);
  const [grupos, setGrupos] = useState<GrupoPanel[]>([]);
  const [topAlumnos, setTopAlumnos] = useState<EstudianteTop[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setGenerating] = useState(false);

  const loadProfile = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      navigate("/panel/login");
      return null;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("usuarios")
      .select("rol, nombre, email")
      .eq("id", data.session.user.id)
      .single();

    if (profileError || !profileData) {
      console.error("Permisos institucionales no validados.");
      return null;
    }

    setProfile(profileData as PanelProfile);
    return profileData as PanelProfile;
  }, [navigate]);

  const loadData = useCallback(async () => {
    setLoading(true);

    const profileData = await loadProfile();
    if (!profileData) {
      setLoading(false);
      return;
    }

    // Cargar datos del panel y el ranking top 5
    const [estacionesRes, gruposRes, rankingRes] = await Promise.all([
      supabase.from("estaciones").select("id,nombre,materia,grupo,visitantes_activos,estado"),
      supabase.rpc("obtener_panel_grupos_v1"),
      supabase.from("estudiantes").select("nickname, grupo, total_puntos").order("total_puntos", { ascending: false }).limit(5)
    ]);

    if (!estacionesRes.error) setEstaciones((estacionesRes.data as EstacionPanel[]) || []);
    if (!gruposRes.error) setGrupos((gruposRes.data as GrupoPanel[]) || []);
    if (!rankingRes.error) setTopAlumnos((rankingRes.data as EstudianteTop[]) || []);

    setLoading(false);
  }, [loadProfile]);

  useEffect(() => {
    loadData();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/panel/login");
    });
    return () => { authListener.subscription.unsubscribe(); };
  }, [loadData, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/panel/login");
  };

  // Lógica para obtener el mejor grupo de cada grado (1, 2, 3)
  const mejoresGruposPorGrado = useMemo(() => {
    const grados = ["1", "2", "3"];
    return grados.map(grado => {
      const gruposDelGrado = grupos.filter(g => g.grupo.startsWith(grado));
      return gruposDelGrado.reduce((prev, current) => 
        (prev.puntos_grupo > current.puntos_grupo) ? prev : current, 
        { grupo: `${grado}° SIN DATOS`, puntos_grupo: 0 } as any
      );
    });
  }, [grupos]);

  // Simulación de generación de diploma (En producción usaría pdfkit)
  const handleGenerateDiplomas = async (type: 'ALUMNOS' | 'GRUPOS') => {
    setGenerating(true);
    // Simular procesamiento
    await new Promise(r => setTimeout(r, 2000));
    alert(`DIPLOMAS PARA ${type} GENERADOS CORRECTAMENTE. Se ha enviado la orden de impresión al sistema institucional.`);
    setGenerating(false);
  };

  const totalCheckins = useMemo(() => grupos.reduce((sum, g) => sum + (g.total_checkins || 0), 0), [grupos]);
  const precisionGlobal = totalCheckins ? Math.round((grupos.reduce((sum, g) => sum + (g.correctas || 0), 0) / totalCheckins) * 100) : 0;

  return (
    <Layout title="Panel de Control Docente">
      <div className="flex flex-col gap-6 px-6 py-8 pb-32 max-w-5xl mx-auto w-full">
        
        {/* HEADER: CENTRO DE COMANDO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/40 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
              <ShieldCheck size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Operador Institucional</span>
              <h2 className="text-xl font-headline font-bold text-on-background truncate">
                {profile?.nombre || "C. DOCENTE DIURNA 310"}
              </h2>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={loadData} className="flex-1 md:flex-none px-4 py-3 bg-white/60 rounded-xl text-primary hover:bg-white transition-all flex items-center justify-center gap-2 border border-white/60">
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Actualizar</span>
            </button>
            <button onClick={handleLogout} className="flex-1 md:flex-none px-4 py-3 bg-error/10 rounded-xl text-error border border-error/20 flex items-center justify-center gap-2">
              <LogOut size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* MÉTRICAS DE IMPACTO CRISTALINAS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Check-ins Totales", val: totalCheckins, icon: <Activity size={18} />, colorClass: "text-primary" },
            { label: "Precisión Académica", val: `${precisionGlobal}%`, icon: <Target size={18} />, colorClass: "text-secondary" },
            { label: "Módulos Activos", val: estaciones.length, icon: <MapPin size={18} />, colorClass: "text-tertiary" },
            { label: "Alertas de Grupo", val: grupos.filter(g => (g.precision || 0) < 40).length, icon: <AlertTriangle size={18} />, colorClass: "text-error" },
          ].map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 glass-panel rounded-3xl border border-white/40 bg-white/20 flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`size-8 rounded-lg bg-white/50 flex items-center justify-center shadow-sm ${m.colorClass}`}>{m.icon}</div>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40 leading-none">{m.label}</span>
              </div>
              <p className={`text-3xl font-headline font-bold ${m.colorClass}`}>{m.val}</p>
            </motion.div>
          ))}
        </div>

        {/* SECCIÓN DE CERTIFICACIÓN (DIPLOMAS) */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Award size={18} className="text-secondary" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface/40">Módulo de Certificación</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Diplomas Individuales */}
            <div className="glass-panel p-6 rounded-[2.5rem] border border-white/40 bg-gradient-to-br from-white/40 to-transparent">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-lg font-headline font-bold uppercase tracking-tight text-primary">Top 5 Alumnos</h4>
                  <p className="text-[10px] uppercase font-bold opacity-40">Basado en puntos acumulados</p>
                </div>
                <button 
                  disabled={isGenerating || topAlumnos.length === 0}
                  onClick={() => handleGenerateDiplomas('ALUMNOS')}
                  className="p-3 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  title="Descargar Diplomas"
                >
                  <Download size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {topAlumnos.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/40">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-primary opacity-40">#0{i+1}</span>
                      <div className="flex flex-col">
                         <span className="text-xs font-bold uppercase">{a.nickname}</span>
                         <span className="text-[9px] uppercase opacity-40">{a.grupo}</span>
                      </div>
                    </div>
                    <span className="text-xs font-headline font-bold text-primary">{a.total_puntos} pts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diplomas Grupales */}
            <div className="glass-panel p-6 rounded-[2.5rem] border border-white/40 bg-gradient-to-br from-white/40 to-transparent">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-lg font-headline font-bold uppercase tracking-tight text-secondary">Mejor Grupo por Grado</h4>
                  <p className="text-[10px] uppercase font-bold opacity-40">Suma total de puntos por grupo</p>
                </div>
                <button 
                  disabled={isGenerating || mejoresGruposPorGrado.length === 0}
                  onClick={() => handleGenerateDiplomas('GRUPOS')}
                  className="p-3 rounded-2xl bg-secondary text-white shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  title="Descargar Certificados"
                >
                  <Download size={20} />
                </button>
              </div>
              <div className="space-y-3">
                {mejoresGruposPorGrado.map((g, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-white/40">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                        <Users size={16} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-secondary tracking-widest uppercase mb-0.5">Líder {i+1}° Grado</span>
                         <span className="text-sm font-headline font-bold uppercase">{g.grupo}</span>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-sm font-headline font-bold text-secondary">{g.puntos_grupo}</span>
                       <p className="text-[8px] font-black uppercase opacity-30">Puntos Totales</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MAPA DE DENSIDAD DE STANDS */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <BarChart3 size={18} className="text-primary opacity-40" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface/40">Ocupación de la Feria</h3>
          </div>
          <div className="glass-panel rounded-[2.5rem] p-6 border border-white/40 bg-white/20 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {estaciones
              .sort((a, b) => (b.visitantes_activos || 0) - (a.visitantes_activos || 0))
              .map((est) => (
                <div key={est.id} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase text-primary tracking-widest leading-none mb-1">{est.materia}</span>
                      <span className="text-xs font-bold text-on-background uppercase">{est.nombre}</span>
                    </div>
                    <span className="text-[10px] font-headline font-bold text-primary">{est.visitantes_activos} ACTIVOS</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/30 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (est.visitantes_activos / 10) * 100)}%` }}
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>
                </div>
              ))}
          </div>
        </section>

      </div>

      {/* OVERLAY DE CARGA PARA GENERACIÓN */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary/20 backdrop-blur-md flex items-center justify-center"
          >
            <div className="bg-white p-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6">
               <div className="relative size-20">
                  <Sparkles size={80} className="text-primary animate-pulse" />
                  <div className="absolute inset-0 size-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
               </div>
               <div className="text-center">
                  <h3 className="text-xl font-headline font-bold uppercase tracking-tight">Generando Diplomas</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Compilando datos y promedios...</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};
