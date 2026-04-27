import React from "react";
import { Navigation } from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, showNav = false }) => {
  return (
    <div
      className="phone-frame"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      {/* Atmosférico sutil */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at 10% 0%, rgba(255,215,0,0.06) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(6,182,212,0.04) 0%, transparent 40%)",
        pointerEvents: "none",
        zIndex: 0
      }} />
      
      {title && (
        <div
          className="screen-label"
          style={{
            textAlign: "center",
            padding: "12px",
            background: "rgba(0, 0, 0, 0.3)",
            fontSize: "11px",
            color: "var(--primary)",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            borderBottom: "1px solid var(--border-light)",
            zIndex: 10,
            fontWeight: 800,
            backdropFilter: "blur(10px)"
          }}
        >
          {title}
        </div>
      )}
      <div
        className="status-bar"
        style={{
          padding: "16px 24px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "11px",
          fontWeight: 600,
          background: "transparent",
          zIndex: 1
        }}
      >
        <span
          style={{
            color: "var(--primary)",
            fontWeight: "800",
            letterSpacing: "0.2em",
          }}
        >
          FERIA DE CIENCIAS 2026 ESD-310
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 10px var(--accent)" }}></div>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px" }}>CORE V.4.0</span>
        </div>
      </div>
      
      <main
        className="content-scroll"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
          zIndex: 1
        }}
      >
        {children}
      </main>

      {showNav && (
        <div style={{ position: "relative", zIndex: 20 }}>
          <Navigation />
        </div>
      )}
    </div>
  );
};
