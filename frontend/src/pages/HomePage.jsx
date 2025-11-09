// frontend/src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="home-page">
      <h1>Accessible Lecture Notes Assistant</h1>
      <p>
        Upload lecture recordings and get clean transcripts and summaries with
        accessibility-friendly reading options.
      </p>
      <Link to="/upload" className="primary-button">
        Get Started – Upload a Lecture
      </Link>

      <div className="home-steps">
        <div>
          <h3>1. Upload</h3>
          <p>Select a recorded lecture in common audio formats.</p>
        </div>
        <div>
          <h3>2. Process</h3>
          <p>We transcribe and summarize the content using AI.</p>
        </div>
        <div>
          <h3>3. Read</h3>
          <p>Adjust font, spacing, and theme to your comfort.</p>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
