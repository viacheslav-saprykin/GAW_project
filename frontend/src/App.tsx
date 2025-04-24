// App.tsx
import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import GenresPage from "./pages/GenresPage";
import TracksPage from "./pages/TracksPage";
import EditTrackPage from "./pages/EditTrackForm";  // Додаємо імпорт для сторінки редагування

import './app.css';  // Відновлюємо імпорт стилів

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Music Tracks Manager</h1>

      {/* 🔗 Навігаційне меню */}
      <nav>
        <Link to="/genres" style={{ marginRight: "10px" }}>Genres</Link>
        <Link to="/tracks" style={{ marginRight: "10px" }}>All Tracks</Link>
      </nav>

      <hr />

      {/* 🧭 Роутінг */}
      <Routes>
        <Route path="/" element={<Navigate to="/tracks" replace />} />
        <Route path="/genres" element={<GenresPage />} />
        <Route path="/tracks" element={<TracksPage />} />
        <Route path="/edit/:id" element={<EditTrackPage />} />
      </Routes>
    </div>
  );
};

export default App;
