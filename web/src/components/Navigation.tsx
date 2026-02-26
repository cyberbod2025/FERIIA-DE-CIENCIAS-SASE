import React from "react";
import { Star, Map as MapIcon, Trophy } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <Star />, label: "Inicio", path: "/tutorial" },
    { icon: <MapIcon />, label: "Mapa", path: "/mapa" },
    { icon: <Trophy />, label: "Ranking", path: "/ranking" },
  ];

  return (
    <nav
      style={{
        background: "rgba(10, 16, 53, 0.98)",
        borderTop: "1px solid rgba(255, 215, 0, 0.15)",
        padding: `12px 20px var(--safe-area-bottom)`,
        display: "flex",
        justifyContent: "space-around",
        backdropFilter: "blur(10px)",
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <span
              style={{
                color: isActive ? "var(--gold)" : "rgba(255, 255, 255, 0.35)",
                transform: isActive ? "scale(1.1)" : "scale(1)",
              }}
            >
              {item.icon}
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "var(--gold)" : "rgba(255, 255, 255, 0.35)",
              }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
};
