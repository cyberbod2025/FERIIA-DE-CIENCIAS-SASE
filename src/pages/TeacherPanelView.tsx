import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, LogOut, Users, MapPin, Target } from "lucide-react";

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
  puntos_grupo?: number | null;
}

interface InactividadPanel {
  estudiante_id: string;
  nickname: string;
  grupo: string | null;
  ultima_actividad: string | null;
  minutos_inactivo: number | null;
}

const ALERTA_MIN_CHECKINS = 4;
const ALERTA_MAX_PRECISION = 20;
const INACTIVO_MINUTOS = 10;

export const TeacherPanelView: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PanelProfile | null>(null);
  const [estaciones, setEstaciones] = useState<EstacionPanel[]>([]);
  const [grupos, setGrupos] = useState<GrupoPanel[]>([]);
  const [inactividad, setInactividad] = useState<InactividadPanel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError("No tienes permisos para ver este panel.");
      return null;
    }

    setProfile(profileData as PanelProfile);
    return profileData as PanelProfile;
  }, [navigate]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    const profileData = await loadProfile();
    if (!profileData) {
      setLoading(false);
      return;
    }

    const [estacionesRes, gruposRes, inactividadRes] = await Promise.all([
      supabase
        .from("estaciones")
        .select("id,nombre,materia,grupo,visitantes_activos,estado"),
      supabase.rpc("obtener_panel_grupos_v1"),
      supabase.rpc("obtener_panel_inactividad_v1"),
    ]);

    if (estacionesRes.error || gruposRes.error || inactividadRes.error) {
      setError("No se pudieron cargar las metricas del panel.");
    } else {
      setEstaciones((estacionesRes.data as EstacionPanel[]) || []);
      setGrupos((gruposRes.data as GrupoPanel[]) || []);
      setInactividad((inactividadRes.data as InactividadPanel[]) || []);
    }

    setLoading(false);
  }, [loadProfile]);

  useEffect(() => {
    loadData();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) navigate("/panel/login");
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [loadData, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/panel/login");
  };

  const totalCheckins = useMemo(
    () => grupos.reduce((sum, g) => sum + (g.total_checkins || 0), 0),
    [grupos],
  );

  const totalCorrectas = useMemo(
    () => grupos.reduce((sum, g) => sum + (g.correctas || 0), 0),
    [grupos],
  );

  const precisionGlobal = totalCheckins
    ? Math.round((totalCorrectas / totalCheckins) * 100)
    : 0;

  const standsActivos = estaciones.filter((e) => (e.visitantes_activos || 0) > 0);
  const standsVacios = estaciones.filter((e) => (e.visitantes_activos || 0) === 0);

  const alertasGrupos = grupos
    .filter(
      (g) =>
        g.total_checkins >= ALERTA_MIN_CHECKINS &&
        (g.precision ?? 0) <= ALERTA_MAX_PRECISION,
    )
    .sort((a, b) => (a.precision ?? 0) - (b.precision ?? 0));

  const alumnosInactivos = inactividad
    .filter((a) => (a.minutos_inactivo || 0) >= INACTIVO_MINUTOS)
    .sort((a, b) => (b.minutos_inactivo || 0) - (a.minutos_inactivo || 0))
    .slice(0, 10);

  return (
    <Layout title="Panel de Control">
      <div className="flex flex-col gap-6 p-6 pb-24 max-w-lg mx-auto">
        
        {/* Perfil del Staff Premium */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-card-strong flex items-center justify-between p-5"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
              <div className="relative size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                <Users size={24} className="text-blue-400" />
              </div>
            </div>
            <div>
              <div className="title-sase text-base">
                {profile?.nombre || profile?.email?.split('@')[0] || "Staff"}
              </div>
              <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                {profile?.rol || "SISTEMA"}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadData}
              className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-95"
            >
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={handleLogout}
              className="size-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all active:scale-95"
            >
              <LogOut size={18} />
            </button>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center flex items-center gap-3"
          >
            <AlertTriangle size={16} /> {error}
          </motion.div>
        )}

        {/* Métricas Principales Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Asistencia", value: totalCheckins, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Precisión", value: `${precisionGlobal}%`, icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Activos", value: standsActivos.length, icon: MapPin, color: "text-amber-400", bg: "bg-amber-500/10" },
            { label: "Vacíos", value: standsVacios.length, icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-500/10" }
          ].map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="surface-card p-4 relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <m.icon size={40} />
              </div>
              <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">
                {m.label}
              </div>
              <div className={`text-2xl font-black ${m.color}`}>
                {m.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Monitoreo de Estaciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="surface-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <MapPin size={16} className="text-amber-400" />
            </div>
            <h3 className="title-sase text-sm">Capacidad de Estaciones</h3>
          </div>
          <div className="flex flex-col gap-5">
            {estaciones
              .sort((a, b) => (b.visitantes_activos || 0) - (a.visitantes_activos || 0))
              .slice(0, 6)
              .map((est) => (
                <div key={est.id} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-xs font-bold text-white/90 group-hover:text-blue-400 transition-colors">{est.nombre}</div>
                    <div className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      est.visitantes_activos >= 20 ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/10 text-emerald-400"
                    }`}>
                      {est.visitantes_activos || 0} / 20
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, ((est.visitantes_activos || 0) / 20) * 100)}%` }}
                      className={`h-full rounded-full transition-all duration-1000 ${
                        est.visitantes_activos >= 20 
                          ? "bg-gradient-to-r from-rose-600 to-rose-400" 
                          : "bg-gradient-to-r from-blue-600 to-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                      }`}
                    />
                  </div>
                </div>
              ))}
          </div>
        </motion.div>

        {/* Alertas Críticas */}
        {alertasGrupos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="surface-card p-6 border border-rose-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle size={18} className="text-rose-400" />
              <h3 className="title-sase text-sm text-rose-400">Intervención Requerida</h3>
            </div>
            <div className="flex flex-col gap-3">
              {alertasGrupos.map((g) => (
                <div key={g.grupo} className="flex items-center justify-between p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                  <div>
                    <div className="text-sm font-black text-white">{g.grupo}</div>
                    <div className="text-[10px] text-rose-400/70 font-bold uppercase tracking-wider">
                      Precisión Crítica: {g.precision}%
                    </div>
                  </div>
                  <div className="size-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 animate-pulse">
                    <Target size={14} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Inactividad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="surface-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Users size={16} className="text-blue-400" />
            </div>
            <h3 className="title-sase text-sm">Alumnos Estancados</h3>
          </div>
          <div className="grid gap-3">
            {alumnosInactivos.length === 0 ? (
              <div className="text-center py-4 text-white/20 text-xs font-bold uppercase tracking-widest">
                Sin anomalías detectadas
              </div>
            ) : (
              alumnosInactivos.map((a) => (
                <div key={a.estudiante_id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-lg">
                      {a.nickname.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white/90">{a.nickname}</div>
                      <div className="text-[10px] text-white/30 font-black uppercase tracking-widest">{a.grupo || "S/G"}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-amber-400">{Math.round(a.minutos_inactivo || 0)}m</div>
                    <div className="text-[8px] text-white/20 font-black uppercase tracking-[0.2em]">INACTIVO</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};
