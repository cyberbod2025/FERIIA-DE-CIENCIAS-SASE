import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getStudentSession } from "../lib/studentSession";
import { supabase } from "../lib/supabase";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: "student" | "teacher";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      if (role === "student") {
        const session = getStudentSession();
        // Verificación básica de sesión de alumno
        setIsAuthenticated(!!session.studentId && !!session.sessionToken);
      } else {
        // Verificación de sesión de Supabase para maestros
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      }
      setLoading(false);
    };

    checkAuth();

    // Escuchar cambios de auth para maestros
    if (role === "teacher") {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session);
      });
      return () => subscription.unsubscribe();
    }
  }, [role]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#05070a]">
        <div className="relative size-12">
          <div className="absolute inset-0 rounded-full border-2 border-white/5"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectPath = role === "teacher" ? "/panel/login" : "/";
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
