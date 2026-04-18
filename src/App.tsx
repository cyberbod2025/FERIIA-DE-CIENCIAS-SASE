import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Lazy loading de vistas para optimización
const IntroView = lazy(() => import("./pages/IntroView").then(m => ({ default: m.IntroView })));
const BienvenidaProView = lazy(() => import("./pages/BienvenidaProView").then(m => ({ default: m.BienvenidaProView })));
const LoginView = lazy(() => import("./pages/LoginView").then(m => ({ default: m.LoginView })));
const TeacherLoginView = lazy(() => import("./pages/TeacherLoginView").then(m => ({ default: m.TeacherLoginView })));
const TeacherPanelView = lazy(() => import("./pages/TeacherPanelView").then(m => ({ default: m.TeacherPanelView })));
const TutorialView = lazy(() => import("./pages/TutorialView").then(m => ({ default: m.TutorialView })));
const MapView = lazy(() => import("./pages/MapView").then(m => ({ default: m.MapView })));
const StandDetailView = lazy(() => import("./pages/StandDetailView").then(m => ({ default: m.StandDetailView })));
const TriviaView = lazy(() => import("./pages/TriviaView").then(m => ({ default: m.TriviaView })));
const RankingView = lazy(() => import("./pages/RankingView").then(m => ({ default: m.RankingView })));

// Componente de carga elegante
const ViewLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[var(--background)]">
    <div className="relative size-12">
      <div className="absolute inset-0 rounded-full border-2 border-[var(--primary)] opacity-10"></div>
      <div className="absolute inset-0 rounded-full border-t-2 border-[var(--primary)] animate-spin"></div>
    </div>
  </div>
);

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<ViewLoader />}>
        <Routes>
          <Route path="/" element={<IntroView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/dashboard" element={<BienvenidaProView />} />
          <Route path="/panel/login" element={<TeacherLoginView />} />
          <Route path="/panel" element={<TeacherPanelView />} />
          <Route path="/tutorial" element={<TutorialView />} />
          <Route path="/mapa" element={<MapView />} />
          <Route path="/stand/:id" element={<StandDetailView />} />
          <Route path="/trivia/:id" element={<TriviaView />} />
          <Route path="/ranking" element={<RankingView />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
