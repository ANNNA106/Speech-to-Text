// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import UploadPage from "./pages/UploadPage.jsx";
import LecturePage from "./pages/LecturePage.jsx";
import Contributors from "./pages/Contributors.jsx";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="logo">
          LectureAssist
        </Link>
        <nav>
          <Link to="/upload">Upload</Link>
          <Link to="/contributors" style={{ marginLeft: 12 }}>Contributors</Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/lecture/:jobId" element={<LecturePage />} />
          <Route path="/contributors" element={<Contributors />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
