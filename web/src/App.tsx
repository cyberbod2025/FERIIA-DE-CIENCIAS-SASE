import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginView } from "./pages/LoginView";
import { TutorialView } from "./pages/TutorialView";
import { MapView } from "./pages/MapView";
import { StandDetailView } from "./pages/StandDetailView";
import { TriviaView } from "./pages/TriviaView";
import { RankingView } from "./pages/RankingView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/tutorial" element={<TutorialView />} />
        <Route path="/mapa" element={<MapView />} />
        <Route path="/stand/:id" element={<StandDetailView />} />
        <Route path="/trivia/:id" element={<TriviaView />} />
        <Route path="/ranking" element={<RankingView />} />
      </Routes>
    </Router>
  );
}

export default App;
