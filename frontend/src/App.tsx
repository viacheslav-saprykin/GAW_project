import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import CreateTrackForm from "./components/CreateTrackForm";
import GenresPage from "./pages/GenresPage";
import TracksPage from "./pages/TracksPage";
import EditTrackPage from "./pages/EditTrackPage";  // Додаємо імпорт для сторінки редагування

import './app.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Music Tracks Manager</h1>

      {/* 🔗 Навігаційне меню */}
      <nav>
        <Link to="/genres" style={{ marginRight: "10px" }}>Genres</Link>
        <Link to="/create" style={{ marginRight: "10px" }}>Create Track</Link>
        <Link to="/tracks">All Tracks</Link>
      </nav>

      <hr />

      {/* 🧭 Роутінг */}
      <Routes>
        <Route path="/genres" element={<GenresPage />} />
        <Route path="/create" element={<CreateTrackForm />} />
        <Route path="/tracks" element={<TracksPage />} />
        <Route path="/edit/:id" element={<EditTrackPage />} />
      </Routes>
    </div>
  );
};

export default App;
