import React from 'react';
import { useNavigate } from 'react-router-dom';

export const BienvenidaProView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="font-body text-on-surface selection:bg-primary-container selection:text-white min-h-screen bg-transparent relative">
      <div className="fixed inset-0 grain-texture z-0 pointer-events-none"></div>
      
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white/10 dark:bg-slate-900/10 backdrop-blur-3xl border-b border-white/20">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-violet-500 text-2xl">blur_on</span>
          <h1 className="font-['Space_Grotesk'] tracking-[0.2em] uppercase text-2xl font-bold text-violet-600 drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">
            AETHERIS
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-violet-400 overflow-hidden shadow-lg">
            <img alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtIW9ow9saVLkj32BMFWd-ypWV2Ssc8BgluWVMqQsP_H9c6Gio0U2Cb-zqBvL1JXPxRwbd4BYaoC6oV-oQF3pnuc4K64Qkg1KBs4MqhH7JkMb81cyZpN5Lw1SUhC1HFBx5eBwJaNpY_dJjChHsi-lUWw_0btZZSxVNGNLkzyzFFkavyDM88iFAFRimqDYmj1xUwlLZtYM3JbWZv6F9jnQNga-440e9x6V5ELrzygAX4BokPsqBc1C1aa1haZRDpFfvNiILQgSQW4eS" />
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-32 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="glass-panel rounded-[2.5rem] p-6 md:p-10 mb-8 min-h-[618px]">
          <section className="flex flex-col md:flex-row gap-10 items-center mb-12">
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="relative w-48 h-48 rounded-full circular-progress flex items-center justify-center shadow-2xl">
                <div className="absolute inset-2 bg-white/40 backdrop-blur-md rounded-full flex flex-col items-center justify-center">
                  <span className="text-4xl font-headline font-bold text-primary">14/28</span>
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 mt-1">Módulos</span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <h2 className="text-xl font-headline font-semibold text-primary">Status de Observación</h2>
                <p className="text-sm text-slate-500 mt-1">¡Vas a la mitad del recorrido!</p>
              </div>
            </div>

            <div className="w-full md:w-2/3">
              <div className="relative overflow-hidden rounded-3xl group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/60 mix-blend-multiply z-10"></div>
                <img className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700" alt="" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSGxgwsll9PHp9NxVrKyNt85rZFhZcaxLYjIfLHSVGCesUQNNJ0KBZMIJXwvEAC8-SEarysol7iaO-Ie-0i02Tj4Xa0juhuQLsTKSJ8CQ1-9QQEEivjf7PrbCX6bHsl1NoSkIffwIJ2ViXP84UG-teX2ieDPn0-e4opFa0t-VHdKnlFKWMx1xtjg6eS7B_Tw5b14V6gOBA-KK6cRscVZfg3JeG8ceasekHSX-XkBUb9GfA9NtCgLn0zISUq-ZiUwPCzBhwAi1cDgh2" />
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Stand Recomendado</span>
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">bolt</span> Sin Filas
                    </span>
                  </div>
                  <h3 className="text-3xl font-headline font-bold text-white leading-tight">Stand 15: Física Cuántica</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-white/80 text-sm max-w-[60%]">Explora el entrelazamiento y la superposición en tiempo real.</p>
                    <button onClick={() => navigate('/stand/15')} className="liquid-button text-white font-headline font-bold py-3 px-8 rounded-full flex items-center gap-2 text-sm uppercase tracking-wider">
                      Ir Ahora
                      <span className="material-symbols-outlined text-lg">near_me</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
             {/* Map of modules grid */}
             <div className="flex items-end justify-between mb-8">
               <div>
                 <h3 className="text-2xl font-headline font-bold text-slate-800">Mapa de Módulos</h3>
                 <p className="text-slate-500 text-sm">Explora los 28 sectores de la feria científica</p>
               </div>
               <div className="flex gap-4">
                 <div className="flex items-center gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                   <span className="text-[10px] font-bold uppercase text-slate-400">Completado</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary-container)]"></div>
                   <span className="text-[10px] font-bold uppercase text-slate-400">Disponible</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                   <span className="text-[10px] font-bold uppercase text-slate-400">Saturado</span>
                 </div>
               </div>
             </div>
             
             <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-10 gap-3">
               {[1, 2].map(i => (
                 <div key={i} className="aspect-square glass-panel rounded-2xl flex items-center justify-center relative border-emerald-200 bg-emerald-50/20 group cursor-pointer hover:scale-105 transition-all w-full h-full">
                   <span className="text-sm font-headline font-bold text-emerald-600">{String(i).padStart(2, '0')}</span>
                   <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
                     <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                   </div>
                 </div>
               ))}
               <div className="aspect-square glass-panel rounded-2xl flex items-center justify-center relative border-red-200 bg-red-50/20 group cursor-pointer hover:scale-105 transition-all w-full h-full">
                 <span className="text-sm font-headline font-bold text-red-600">03</span>
                 <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg">
                   <span className="material-symbols-outlined text-[12px] font-bold">warning</span>
                 </div>
               </div>
               
               {[4,5,6,7,8].map(i => (
                 <div key={i} className="aspect-square glass-panel rounded-2xl flex items-center justify-center relative border-violet-200 bg-violet-50/20 hover:scale-105 transition-all cursor-pointer w-full h-full">
                    <span className="text-sm font-headline font-bold text-primary">{String(i).padStart(2, '0')}</span>
                 </div>
               ))}
               <div className="aspect-square glass-panel rounded-2xl flex items-center justify-center relative border-red-200 bg-red-50/20 hover:scale-105 transition-all cursor-pointer w-full h-full">
                   <span className="text-sm font-headline font-bold text-red-600">09</span>
               </div>
               {[10,11,12,13].map(i => (
                 <div key={i} className="aspect-square glass-panel rounded-2xl flex items-center justify-center relative border-violet-200 bg-violet-50/20 hover:scale-105 transition-all cursor-pointer w-full h-full">
                    <span className="text-sm font-headline font-bold text-primary">{String(i).padStart(2, '0')}</span>
                 </div>
               ))}
               <div className="aspect-square glass-panel rounded-2xl flex items-center justify-center relative border-emerald-200 bg-emerald-50/20 hover:scale-105 transition-all cursor-pointer w-full h-full">
                  <span className="text-sm font-headline font-bold text-emerald-600">14</span>
               </div>
               
               {/* 15 - Active */}
               <div className="aspect-square glass-panel rounded-2xl flex items-center justify-center relative ring-2 ring-primary border-transparent bg-white shadow-xl scale-110 z-10 w-full h-full cursor-pointer" onClick={() => navigate('/stand/15')}>
                  <span className="text-sm font-headline font-bold text-primary">15</span>
               </div>

               {[16,17,18,19,20,21,22,23,24,25,26,27,28].map(i => (
                 <div key={i} className="aspect-square glass-panel rounded-2xl flex items-center justify-center relative border-violet-200 bg-violet-50/20 hover:scale-105 transition-all cursor-pointer w-full h-full">
                    <span className="text-sm font-headline font-bold text-primary">{String(i).padStart(2, '0')}</span>
                 </div>
               ))}

             </div>
          </section>
        </div>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/10 backdrop-blur-2xl rounded-t-[2rem] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div onClick={() => navigate('/')} className="flex flex-col items-center justify-center bg-violet-500/20 text-violet-600 rounded-full px-4 py-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] cursor-pointer">
          <span className="material-symbols-outlined text-[24px]">dashboard</span>
          <span className="font-['Inter'] text-[10px] font-medium tracking-tight">Dashboard</span>
        </div>
        <div onClick={() => navigate('/login')} className="flex flex-col items-center justify-center text-slate-500/80 hover:text-cyan-400 transition-colors cursor-pointer w-16">
          <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
          <span className="font-['Inter'] text-[10px] font-medium tracking-tight mt-1">Scanner</span>
        </div>
        <div onClick={() => navigate('/ranking')} className="flex flex-col items-center justify-center text-slate-500/80 hover:text-cyan-400 transition-colors cursor-pointer w-16">
          <span className="material-symbols-outlined text-[24px]">military_tech</span>
          <span className="font-['Inter'] text-[10px] font-medium tracking-tight mt-1">Ranking</span>
        </div>
        <div onClick={() => navigate('/panel/login')} className="flex flex-col items-center justify-center text-slate-500/80 hover:text-cyan-400 transition-colors cursor-pointer w-16">
          <span className="material-symbols-outlined text-[24px]">school</span>
          <span className="font-['Inter'] text-[10px] font-medium tracking-tight mt-1">Teacher</span>
        </div>
      </nav>
    </div>
  );
};
