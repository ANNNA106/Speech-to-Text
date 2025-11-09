// frontend/src/pages/LecturePage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchResult } from "../api.js";
import AccessibilityToolbar from "../components/AccessibilityToolbar.jsx";

function LecturePage() {
  const { jobId } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("LOADING");
  const [error, setError] = useState("");

  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [mode, setMode] = useState("both");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const res = await fetchResult(jobId);
        if (!isMounted) return;
        setData(res);
        setStatus(res.status);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message);
      }
    }

    load();

    // Optionally poll if you expect long processing
    const interval = setInterval(load, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [jobId]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (error) {
    return (
      <section className="lecture-page">
        <h1>Error</h1>
        <p>{error}</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="lecture-page">
        <h1>Loading...</h1>
      </section>
    );
  }

  return (
    <section className={`lecture-page theme-${theme}`}>
      <header>
        <h1>{data.title}</h1>
        <span className={`status-badge status-${data.status.toLowerCase()}`}>
          {data.status}
        </span>
      </header>

      {status !== "COMPLETED" && (
        <p className="info-text">
          Your lecture is being processed. This page will update automatically.
        </p>
      )}

      <AccessibilityToolbar
        fontSize={fontSize}
        setFontSize={setFontSize}
        lineHeight={lineHeight}
        setLineHeight={setLineHeight}
        mode={mode}
        setMode={setMode}
        theme={theme}
        setTheme={setTheme}
      />

      <div className="lecture-content">
        {mode !== "transcript" && (
          <section className="summary-section">
            <h2>Summary</h2>
            <p style={{ fontSize, lineHeight }}>{data.summary}</p>
          </section>
        )}

        {mode !== "summary" && (
          <section className="transcript-section">
            <h2>Transcript</h2>
            <div
              style={{
                fontSize,
                lineHeight,
                whiteSpace: "pre-wrap",
              }}
            >
              {data.transcript}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

export default LecturePage;
