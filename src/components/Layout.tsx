import React from "react";
import { Beaker, Circle } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  hideFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, hideFooter = false }) => {
  return (
    <div className="min-h-screen w-full text-[var(--on-background)]">
      <header className="fixed top-0 w-full z-50 bg-white/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(123,97,255,0.08)] refractive-boundary">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shadow-sm">
              <Beaker size={18} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-headline font-bold text-lg text-[var(--primary)] tracking-tight">
                Feria de Ciencias
              </span>
              <span className="text-[10px] font-semibold text-[var(--on-surface-variant)] mt-1 uppercase tracking-[0.25em]">
                ESD-310
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-[var(--secondary)]">
            <Circle size={8} fill="currentColor" strokeWidth={0} className="animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--on-surface-variant)]">
              Activo
            </span>
          </div>
        </div>
      </header>

      {title && (
        <div className="sticky top-16 z-40 bg-white/30 backdrop-blur-md border-b border-white/20">
          <div className="max-w-md mx-auto px-6 py-3">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.35em] text-[var(--primary)]">
              {title}
            </h2>
          </div>
        </div>
      )}

      <main className="relative z-10 w-full max-w-md mx-auto min-h-screen pt-16">
        {children}
      </main>

      {!hideFooter && (
        <footer className="w-full py-2 text-center opacity-50 pb-28">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--on-surface-variant)]">
            Feria de Ciencias 2026 ESD-310
          </p>
        </footer>
      )}
    </div>
  );
};
