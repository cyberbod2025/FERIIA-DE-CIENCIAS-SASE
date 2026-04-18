import React from "react";
import { House, Map as MapIcon, Trophy } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <House size={20} />, label: "Progreso", path: "/" },
    { icon: <MapIcon size={20} />, label: "Mapa", path: "/mapa" },
    { icon: <Trophy size={20} />, label: "Ranking", path: "/ranking" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full rounded-t-[2rem] z-50 pb-safe bg-white/60 backdrop-blur-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-white/30">
      <div className="flex justify-around items-end px-4 pb-4 pt-3 w-full h-20 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center p-2 transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-br from-[var(--primary)] to-[var(--secondary-fixed-dim)] text-white rounded-full px-4 py-3 mb-1 scale-110 shadow-lg shadow-[var(--primary)]/30"
                  : "text-slate-400 hover:text-[var(--primary)]"
              }`}
            >
              {item.icon}
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${isActive ? "mt-1" : "mt-1 opacity-80"}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
