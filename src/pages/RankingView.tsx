import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { ShieldCheck, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { Navigation } from "../components/Navigation";
import { supabase } from "../lib/supabase";
import { ScienceCore } from "../components/ScienceCore";

interface EstudianteRanking {
  nickname: string;
  total_puntos: number;
  grado: string;
}

export const RankingView: React.FC = () => {
  const [ranking, setRanking] = useState<EstudianteRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      const { data, error } = await supabase
        .from("estudiantes")
        .select("nickname, total_puntos, grado")
        .order("total_puntos", { ascending: false })
        .limit(10);

      if (!error) setRanking(data || []);
      setLoading(false);
    };
    fetchRanking();
  }, []);

  return (
    <Layout title="Ranking de Líderes">
      <div className="flex flex-col gap-8 px-6 py-8 pb-32">
        
        {/* Top 1 Hero Card */}
        {ranking.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex flex-col items-center pt-8 pb-10 px-6 glass-morphism rounded-[2.5rem] bg-gradient-to-br from-[var(--surface-container-high)] to-[var(--surface-container-low)] border border-[var(--secondary)]/10 overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--secondary)]/40 to-transparent" />
            <div className="absolute -top-20 size-40 bg-[var(--secondary)]/5 blur-[60px] rounded-full" />
            
            <div className="relative mb-6">
              <ScienceCore size={140} showAccessories={false} />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-[var(--secondary)]/20 rounded-full"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[var(--secondary)] text-[var(--on-secondary)] px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase action-glow">
                Top 01
              </div>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-3xl font-[var(--font-display)] font-black tracking-tight">{ranking[0].nickname}</h2>
              <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--on-surface-variant)] opacity-60">
                <ShieldCheck size={12} className="text-[var(--secondary)]" />
                Puesto actual • {ranking[0].grado}
              </div>
            </div>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-mono font-black text-[var(--secondary)]">{ranking[0].total_puntos}</span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Puntos de Ciencia</span>
            </div>
          </motion.div>
        )}

        {/* Technical HUD Separator */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-[var(--outline-variant)]/10" />
          <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-30">Tabla general</span>
          <div className="h-px flex-1 bg-[var(--outline-variant)]/10" />
        </div>

        {/* Full Ranking List */}
        <div className="space-y-3">
          {loading ? (
             <div className="flex flex-col items-center py-12 gap-4">
               <div className="size-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
               <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Accediendo a la base de datos...</p>
             </div>
          ) : (
            ranking.slice(1).map((user, i) => (
              <motion.div
                key={user.nickname}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex items-center gap-4 p-4 glass-morphism rounded-2xl border border-white/5 bg-[var(--surface-container-high)]/30 hover:bg-[var(--surface-container-high)]/50 transition-all"
              >
                {/* Position */}
                <div className={`size-10 shrink-0 rounded-xl flex items-center justify-center font-mono font-black border ${
                  i === 0 
                  ? "border-[var(--primary)]/30 text-[var(--primary)] bg-[var(--primary)]/5" 
                  : i === 1
                  ? "border-[var(--secondary)]/30 text-[var(--secondary)] bg-[var(--secondary)]/5"
                  : "border-white/5 opacity-40"
                }`}>
                  {(i + 2).toString().padStart(2, '0')}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h4 className="text-[14px] font-[var(--font-display)] font-bold text-[var(--on-background)]">{user.nickname}</h4>
                  <p className="text-[9px] font-black uppercase tracking-wider text-[var(--on-surface-variant)] opacity-40">{user.grado}</p>
                </div>

                {/* Score */}
                <div className="text-right flex flex-col items-end">
                  <div className="flex items-center gap-1.5 text-[var(--primary)]">
                    <span className="text-[16px] font-mono font-black">{user.total_puntos}</span>
                    <ChevronUp size={14} className="opacity-40" />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-tighter opacity-30">PTS_CIENCIA</span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Global Stats HUD */}
        <div className="mt-4 p-4 rounded-2xl border border-dashed border-[var(--outline-variant)]/20 flex justify-around items-center">
          <div className="text-center">
            <p className="text-[8px] font-black uppercase opacity-30 mb-1">Muestra</p>
            <p className="text-sm font-mono font-bold">{ranking.length}</p>
          </div>
          <div className="h-8 w-px bg-[var(--outline-variant)]/10" />
          <div className="text-center">
            <p className="text-[8px] font-black uppercase opacity-30 mb-1">Status</p>
            <p className="text-xs font-bold text-[var(--tertiary)]">LIVE</p>
          </div>
          <div className="h-8 w-px bg-[var(--outline-variant)]/10" />
          <div className="text-center">
            <p className="text-[8px] font-black uppercase opacity-30 mb-1">Ciclo</p>
            <p className="text-sm font-mono font-bold">2026</p>
          </div>
        </div>
      </div>
      <Navigation />
    </Layout>
  );
};



