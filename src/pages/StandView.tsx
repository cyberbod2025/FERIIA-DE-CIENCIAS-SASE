import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { motion } from "framer-motion";
import { 
  Tent, 
  Search, 
  ChevronRight, 
  Star, 
  MapPin, 
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Estacion {
  id: string;
  nombre: string;
  descripcion_pedagogica: string;
  materia: string;
  grupo: string;
}

export const StandView: React.FC = () => {
  const navigate = useNavigate();
  const [feriaData, setFeriaData] = useState<Estacion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStands = async () => {
      const { data, error } = await supabase
        .from("estaciones")
        .select("id, nombre, descripcion_pedagogica, materia, grupo")
        .order('nombre');
      
      if (!error && data) {
        setFeriaData(data);
      }
      setLoading(false);
    };
    fetchStands();
  }, []);

  const filteredStands = feriaData.filter(stand => 
    stand.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stand.materia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Directorio de Stands" showNav={true}>
      <div className="flex flex-col gap-6 p-6 pb-32">
        
        {/* Search & Filter Header */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              type="text" 
              placeholder="Buscar stand o materia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:border-blue-500/50 outline-none transition-all"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {["Todos", "Física", "Química", "Biología", "Matemáticas"].map((cat) => (
              <button 
                key={cat}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40 whitespace-nowrap"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Status Highlights */}
        <div className="grid grid-cols-2 gap-3">
          <div className="surface-card-strong p-4 border-blue-500/20">
            <div className="text-blue-400 mb-1"><Zap size={16} /></div>
            <div className="text-xl font-black text-white">{feriaData.length}</div>
            <div className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">Estaciones Totales</div>
          </div>
          <div className="surface-card-strong p-4 border-amber-500/20">
            <div className="text-amber-400 mb-1"><Star size={16} /></div>
            <div className="text-xl font-black text-white">12</div>
            <div className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">Retos Activos</div>
          </div>
        </div>

        {/* Stands List */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <Tent size={12} /> Estaciones de Innovación
          </h3>

          {loading ? (
            <div className="py-20 text-center text-white/20 animate-pulse text-xs font-bold uppercase tracking-widest">
              Sincronizando Directorio...
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredStands.map((stand) => {
                // BUG FIX: Handle if description is a string with newlines
                const descriptionContent = stand.descripcion_pedagogica || "Sin descripción disponible.";
                const list = typeof descriptionContent === 'string' ? descriptionContent.split('\n') : [String(descriptionContent)];

                return (
                  <motion.div 
                    key={stand.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => navigate(`/stand/${stand.id}`)}
                    className="surface-card-strong p-5 border-white/5 group active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                          <Tent size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white group-hover:text-blue-300 transition-colors">{stand.nombre}</h4>
                          <span className="text-[9px] font-bold text-blue-400/60 uppercase tracking-widest">{stand.materia}</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 text-white/20">
                        <ChevronRight size={16} />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                      {list.map((item, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <div className="size-1 rounded-full bg-blue-500/30 mt-1.5 flex-shrink-0" />
                          <p className="text-[11px] text-white/50 leading-relaxed">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-2">
                      <div className="flex items-center gap-2 text-[9px] font-bold text-white/30 uppercase">
                        <MapPin size={10} /> {stand.grupo}
                      </div>
                      <div className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[8px] font-black text-blue-400 uppercase">
                        Ver Detalles
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
