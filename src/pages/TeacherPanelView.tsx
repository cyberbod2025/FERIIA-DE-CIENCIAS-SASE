import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { AlertTriangle, RefreshCcw, LogOut, Users, MapPin } from "lucide-react";

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
      supabase.from("panel_grupos").select("grupo,total_checkins,correctas,precision"),
      supabase
        .from("panel_inactividad")
        .select("estudiante_id,nickname,grupo,ultima_actividad,minutos_inactivo"),
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

  const maxVisitantes = Math.max(1, ...estaciones.map((e) => e.visitantes_activos || 0));

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
    <Layout title="Panel Maestros">
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ color: "var(--gold)", fontWeight: 700, fontSize: "14px" }}>
              {profile?.nombre || profile?.email || "Staff"}
            </div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px" }}>
              Rol: {profile?.rol || "-"}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={loadData}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "10px",
                color: "white",
                fontSize: "11px",
                cursor: "pointer",
              }}
            >
              <RefreshCcw size={14} /> Actualizar
            </button>
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                background: "rgba(231,76,60,0.2)",
                border: "1px solid rgba(231,76,60,0.4)",
                borderRadius: "10px",
                color: "white",
                fontSize: "11px",
                cursor: "pointer",
              }}
            >
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              color: "var(--crimson)",
              background: "rgba(231,76,60,0.12)",
              border: "1px solid rgba(231,76,60,0.3)",
              padding: "12px",
              borderRadius: "12px",
              fontSize: "12px",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "12px" }}>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>Asistencia</div>
            <div style={{ fontSize: "18px", fontWeight: 800 }}>{totalCheckins}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "12px" }}>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>Precision global</div>
            <div style={{ fontSize: "18px", fontWeight: 800 }}>{precisionGlobal}%</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "12px" }}>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>Stands activos</div>
            <div style={{ fontSize: "18px", fontWeight: 800 }}>{standsActivos.length}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "12px" }}>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>Stands vacios</div>
            <div style={{ fontSize: "18px", fontWeight: 800 }}>{standsVacios.length}</div>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", padding: "14px", borderRadius: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <MapPin size={16} color="var(--gold)" />
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--gold)" }}>
              Zonas de calor (stands)
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {estaciones
              .sort((a, b) => (b.visitantes_activos || 0) - (a.visitantes_activos || 0))
              .slice(0, 8)
              .map((est) => (
                <div key={est.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "12px" }}>{est.nombre}</div>
                    <div
                      style={{
                        height: "6px",
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: "999px",
                        overflow: "hidden",
                        marginTop: "6px",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.round(((est.visitantes_activos || 0) / maxVisitantes) * 100)}%`,
                          height: "100%",
                          background: "linear-gradient(90deg, var(--gold), #27ae60)",
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                    {est.visitantes_activos || 0} activos
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", padding: "14px", borderRadius: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <AlertTriangle size={16} color="var(--crimson)" />
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--crimson)" }}>
              Alertas por grupo
            </div>
          </div>
          {alertasGrupos.length === 0 ? (
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
              Sin alertas detectadas.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {alertasGrupos.map((g) => (
                <div
                  key={g.grupo}
                  style={{
                    background: "rgba(231,76,60,0.08)",
                    border: "1px solid rgba(231,76,60,0.2)",
                    borderRadius: "10px",
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700 }}>{g.grupo}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                      Check-ins: {g.total_checkins} | Precision: {g.precision ?? 0}%
                    </div>
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--crimson)" }}>
                    Revisar flujo
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", padding: "14px", borderRadius: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <Users size={16} color="var(--gold)" />
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--gold)" }}>
              Alumnos inactivos ({">"}{INACTIVO_MINUTOS} min)
            </div>
          </div>
          {alumnosInactivos.length === 0 ? (
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
              Sin inactividad relevante.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {alumnosInactivos.map((a) => (
                <div
                  key={a.estudiante_id}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "10px",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 700 }}>{a.nickname}</div>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>
                      {a.grupo || "Sin grupo"}
                    </div>
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                    {Math.round(a.minutos_inactivo || 0)} min
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {loading && (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
            Cargando metricas...
          </div>
        )}
      </div>
    </Layout>
  );
};
