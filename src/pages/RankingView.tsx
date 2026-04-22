import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { Navigation } from "../components/Navigation";
import { supabase } from "../lib/supabase";

interface EstudianteRanking {
  nickname: string;
  total_puntos: number;
  grado: string;
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

export const RankingView: React.FC = () => {
  const [ranking, setRanking] = useState<EstudianteRanking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRanking = async () => {
    const { data, error } = await supabase
      .from("estudiantes")
      .select("nickname, total_puntos, grado")
      .order("total_puntos", { ascending: false })
      .limit(10);

    if (!error) setRanking(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRanking();

    // Suscripción en tiempo real para actualizaciones inmediatas
    const subscription = supabase
      .channel("estudiantes-ranking")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "estudiantes" },
        () => {
          fetchRanking();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <Layout title="🏆 Ranking Elite">
      <div className="flex flex-col gap-6 p-6 pb-24 max-w-lg mx-auto min-h-full">
        
        {/* Header de Honor Premium */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-card-strong text-center py-10 px-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-500/10 blur-[60px] rounded-full"></div>
          
          <div className="relative mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="size-20 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)] border border-white/20"
            >
              <Trophy size={40} className="text-white" />
            </motion.div>
            <div className="absolute -bottom-2 -right-2 bg-blue-600 size-8 rounded-full border-4 border-[#0a0a0f] flex items-center justify-center">
              <span className="text-[10px] font-black text-white">LIVE</span>
            </div>
          </div>

          <h1 className="title-sase text-2xl mb-2">Cuadro de Honor</h1>
          <p className="text-xs text-white/50 font-bold uppercase tracking-widest leading-relaxed">
            Los mejores innovadores de la <br /> <span className="text-blue-400">FERIA DE CIENCIAS 2026</span>
          </p>
        </motion.div>

        {/* Lista de Ranking */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <div className="size-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Sincronizando satélites...</span>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-3"
            >
              {ranking.map((user, i) => (
                <motion.div
                  key={user.nickname}
                  layout
                  variants={itemVariants}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                    i === 0 
                      ? "bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/30 shadow-[0_10px_30px_rgba(245,158,11,0.1)]" 
                      : i < 3 
                        ? "surface-card-strong border-blue-500/20" 
                        : "surface-card"
                  }`}
                >
                  {/* Posición */}
                  <div className={`size-10 flex-shrink-0 rounded-xl flex items-center justify-center font-black text-base shadow-lg ${
                    i === 0 ? "bg-amber-400 text-amber-950 scale-110" :
                    i === 1 ? "bg-slate-300 text-slate-800" :
                    i === 2 ? "bg-orange-400 text-orange-950" :
                    "bg-white/5 text-white/40 border border-white/5"
                  }`}>
                    {i + 1}
                  </div>

                  {/* Info Usuario */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-black truncate ${i === 0 ? "text-amber-200" : "text-white"}`}>
                      {user.nickname}
                    </div>
                    <div className="text-[10px] text-white/30 font-bold uppercase tracking-wider">
                      {user.grado}
                    </div>
                  </div>

                  {/* Puntos */}
                  <div className="text-right">
                    <div className={`text-xl font-black tabular-nums ${i === 0 ? "text-amber-400" : "text-blue-400"}`}>
                      {user.total_puntos}
                    </div>
                    <div className="text-[8px] text-white/20 font-black uppercase tracking-widest">PUNTOS</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <Navigation />
    </Layout>
  );
};
