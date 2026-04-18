import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Sparkles, MapPin, Trophy, ArrowRight } from "lucide-react";

export const BienvenidaView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Bienvenida">
      <div className="flex flex-col gap-8 px-8 py-12">
        <header className="text-center space-y-4">
          <div className="size-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-primary/10 border border-primary/5">
            <Sparkles size={40} className="text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-black text-on-background leading-tight">
              ¡Hola, Científico!
            </h1>
            <p className="text-sm text-on-surface-variant font-medium opacity-60">
              Bienvenido a la Feria de Ciencias 2026. Tu aventura comienza aquí.
            </p>
          </div>
        </header>

        <section className="space-y-4">
          <button
            onClick={() => navigate("/mapa")}
            className="w-full premium-card p-6 flex items-center gap-4 text-left group hover:bg-primary/5 transition-all"
          >
            <div className="size-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
              <MapPin size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-on-surface">Explorar Mapa</h3>
              <p className="text-[11px] text-on-surface-variant opacity-60">Encuentra todos los proyectos y stands</p>
            </div>
            <ArrowRight size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
          </button>

          <button
            onClick={() => navigate("/ranking")}
            className="w-full premium-card p-6 flex items-center gap-4 text-left group hover:bg-primary/5 transition-all"
          >
            <div className="size-12 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary">
              <Trophy size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-on-surface">Ver Ranking</h3>
              <p className="text-[11px] text-on-surface-variant opacity-60">Consulta tu posición y la de tu grupo</p>
            </div>
            <ArrowRight size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
          </button>
        </section>

        <footer className="pt-8">
           <div className="glass-panel p-6 rounded-3xl border-dashed border-primary/20 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Recordatorio</p>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Escanea los códigos QR en cada stand para registrar tu visita y ganar puntos.
              </p>
           </div>
        </footer>
      </div>
    </Layout>
  );
};
