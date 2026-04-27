import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useSearchParams } from "react-router-dom";
import CryptoJS from "crypto-js";

// Lazy loading de vistas para optimización
const LoginView = lazy(() => import("./pages/LoginView").then(m => ({ default: m.LoginView })));
const TeacherLoginView = lazy(() => import("./pages/TeacherLoginView").then(m => ({ default: m.TeacherLoginView })));
const TeacherPanelView = lazy(() => import("./pages/TeacherPanelView").then(m => ({ default: m.TeacherPanelView })));
const TutorialView = lazy(() => import("./pages/TutorialView").then(m => ({ default: m.TutorialView })));
const MapView = lazy(() => import("./pages/MapView").then(m => ({ default: m.MapView })));
const StandDetailView = lazy(() => import("./pages/StandDetailView").then(m => ({ default: m.StandDetailView })));
const StandView = lazy(() => import("./pages/StandView").then(m => ({ default: m.StandView })));
const TriviaView = lazy(() => import("./pages/TriviaView").then(m => ({ default: m.TriviaView })));
const RankingView = lazy(() => import("./pages/RankingView").then(m => ({ default: m.RankingView })));

// Componente de carga elegante
const ViewLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#05070a]">
    <div className="relative size-12">
      <div className="absolute inset-0 rounded-full border-2 border-white/5"></div>
      <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
    </div>
  </div>
);

import { ProtectedRoute } from "./components/ProtectedRoute";

function HandoffHandler() {
  const [searchParams] = useSearchParams();
  const saseToken = searchParams.get("sase_token");

  useEffect(() => {
    if (!saseToken) return;

    const handleHandoff = async () => {
      try {
        const [payloadB64, signature] = saseToken.split(".");
        if (!payloadB64 || !signature) return;

        // Verificar HMAC (Opcional en cliente si confiamos en el origin, pero idealmente se verifica)
        // Nota: VITE_SASE_SHARED_SECRET debe estar configurado
        const secret = import.meta.env.VITE_SASE_SHARED_SECRET;
        if (secret) {
          const expectedSignature = CryptoJS.HmacSHA256(payloadB64, secret)
            .toString(CryptoJS.enc.Base64)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/g, "");

          if (expectedSignature !== signature) {
            console.error("Handoff: Firma inválida");
            return;
          }
        }

        const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
        console.log("Handoff detectado:", payload.name);

        // Si el usuario es de SASE, intentamos autenticarlo en Supabase o mockear la sesión
        // Para este prototipo, si el email existe, intentamos recuperar el perfil
        // En una implementación real, SASE enviaría un access_token de Supabase si comparten DB,
        // o Feria tendría un endpoint de intercambio.
        
        // Mock de sesión docente si el rol es teacher
        if (payload.role === "teacher") {
          // Guardamos info en localStorage para que ProtectedRoute lo vea o usamos Supabase
          // Si comparten Supabase, podríamos usar auth.setSession
        }
      } catch (err) {
        console.error("Handoff error:", err);
      }
    };

    handleHandoff();
  }, [saseToken]);

  return null;
}

function App() {
  return (
    <Router>
      <HandoffHandler />
      <Suspense fallback={<ViewLoader />}>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<LoginView />} />
          <Route path="/panel/login" element={<TeacherLoginView />} />

          {/* Rutas de Alumnos */}
          <Route path="/tutorial" element={<ProtectedRoute role="student"><TutorialView /></ProtectedRoute>} />
          <Route path="/mapa" element={<ProtectedRoute><MapView /></ProtectedRoute>} />
          <Route path="/stand" element={<ProtectedRoute><StandView /></ProtectedRoute>} />
          <Route path="/stand/:id" element={<ProtectedRoute><StandDetailView /></ProtectedRoute>} />
          <Route path="/trivia/:id" element={<ProtectedRoute role="student"><TriviaView /></ProtectedRoute>} />
          <Route path="/ranking" element={<ProtectedRoute role="student"><RankingView /></ProtectedRoute>} />

          {/* Rutas de Maestros */}
          <Route path="/panel" element={<ProtectedRoute role="teacher"><TeacherPanelView /></ProtectedRoute>} />
          <Route path="/docente" element={<ProtectedRoute role="teacher"><TeacherPanelView /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
