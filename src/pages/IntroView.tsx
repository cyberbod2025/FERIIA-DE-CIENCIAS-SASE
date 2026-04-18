import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ScienceCore } from "../components/ScienceCore";

export const IntroView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex flex-col font-body selection:bg-primary-container selection:text-on-primary-container overflow-hidden">
      
      {/* FONDO MESH ESTRUCTURAL */}
      <div className="mesh-gradient" />
      <div className="fixed top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER HUD */}
      <header className="fixed top-0 w-full z-50 bg-stone-50/10 backdrop-blur-3xl border-b border-white/20 shadow-sm flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">science</span>
          <span className="text-lg font-bold text-primary font-headline tracking-tight uppercase">DIURNA 310</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center border border-white/40 overflow-hidden shadow-sm">
          <img 
            alt="Escudo" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrRmLlveuJEcOnSEYR-eC5IhDVZb0JQq5oIT8YC-pJRgR9NOF5iwMK2_qu90asjrQXyTsfguBs42fXBluSjnXu4NAWY_-EQz-h0ueZudvabV3ZH0cJ1uUAVxNh0o1HgBPXyFagVqQMfurvpEQCCCxKwJHloocir2gspLrA4gRSUfkkedCE8a53lY9-PeQezuC_0JY3otQCYJc0jfZD3BjVNkgHQ2TLxTCM_qhkgJwXTvCC6Cbgzp4LOIHUSuV3dOXvN3fMhxt832go" 
          />
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 md:p-8 pt-24 pb-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel max-w-6xl w-full rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-12 items-center"
        >
          {/* Acento decorativo interno */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-tertiary/10 rounded-full blur-3xl" />

          {/* COLUMNA IZQUIERDA: CONTENIDO */}
          <div className="flex-1 space-y-8 text-center md:text-left relative z-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/30 text-primary font-bold text-[10px] tracking-[0.2em] uppercase border border-white/40 backdrop-blur-md">
              <span className="material-symbols-outlined text-[18px] mr-2">school</span>
              SECUNDARIA DIURNA 310
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-headline font-bold text-on-surface leading-[1.1] tracking-tight uppercase">
                Bienvenido a la <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Feria de Ciencias</span>
              </h1>
              <p className="text-on-surface-variant text-base md:text-lg font-light leading-relaxed max-w-xl uppercase opacity-70">
                Explora 28 módulos, escanea códigos QR para validar tu visita, resuelve trivias científicas y compite en el ranking de líderes científicos.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
              <button 
                onClick={() => navigate("/login")}
                className="px-10 py-5 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                Comenzar
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className="px-8 py-5 rounded-2xl bg-white/20 backdrop-blur-md text-on-surface-variant font-black text-[10px] uppercase tracking-widest border border-white/30 hover:bg-white/40 transition-all">
                Ver Módulos
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA: BENTO GRID VISUAL */}
          <div className="flex-1 w-full grid grid-cols-2 gap-4 relative z-10">
            <div className="col-span-2 relative h-52 rounded-3xl overflow-hidden shadow-inner border border-white/20">
              <img 
                alt="Science Lab" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqnF0qqPH6l9mnKkgepYP9V-QiO940sy8RE3Hv5C3e-nEL-kQNKGFD2_WjGsYaZ7MSQnO4KW7ebyf788p1dPhDIOoUNFZvFtrr3Y6agfsKr0oHNkaM0hNYi7_Hdsd5I3kNk563Y5ysea7jJO7qG43-jkKTk90Yw4AKJArZ_yBVNGgAEC7FPBpPS1UibxU-01mYsOCYCzrHssUctfNJ8Xi7wHSt7r056qeIo6H2WCZgqV2O2HPcU_r8XTLtu1UNmINx3Rr0K0_VQ4-C" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <ScienceCore size={200} showAccessories={false} />
              </div>
            </div>

            <div className="aspect-square glass-panel rounded-3xl flex flex-col items-center justify-center p-4 border border-white/30 shadow-sm group hover:bg-white/40 transition-all cursor-help">
              <span className="material-symbols-outlined text-4xl text-primary mb-2 transition-transform group-hover:scale-110">qr_code_2</span>
              <span className="text-[10px] font-black text-on-surface uppercase tracking-widest">Validar QR</span>
            </div>

            <div className="aspect-square glass-panel rounded-3xl flex flex-col items-center justify-center p-4 border border-white/30 shadow-sm group hover:bg-white/40 transition-all cursor-help">
              <span className="material-symbols-outlined text-4xl text-secondary mb-2 transition-transform group-hover:scale-110">emoji_events</span>
              <span className="text-[10px] font-black text-on-surface uppercase tracking-widest">Ranking</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* FOOTER ESPACIADO */}
      <footer className="h-16 w-full flex items-center justify-center px-6">
        <p className="text-[10px] text-outline/40 font-black uppercase tracking-[0.4em]">© 2026 Escuela Secundaria Diurna 310 • Presidentes de México</p>
      </footer>
    </div>
  );
};
