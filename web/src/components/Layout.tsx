import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div
      className="phone-frame"
      style={{ display: "flex", flexDirection: "column" }}
    >
      {title && (
        <div
          className="screen-label"
          style={{
            textAlign: "center",
            padding: "8px",
            background: "rgba(255, 215, 0, 0.08)",
            fontSize: "10px",
            color: "rgba(255, 215, 0, 0.6)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
      )}
      <div
        className="status-bar"
        style={{
          padding: "12px 24px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "11px",
          fontWeight: 600,
          background: "var(--deep-blue)",
        }}
      >
        <span>09:41</span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          ✨ Circo 310 &nbsp;&nbsp;🔋 95%
        </span>
      </div>
      <div
        className="content-scroll"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};
