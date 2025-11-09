// frontend/src/pages/LecturePage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { fetchResult } from "../api.js";
import AccessibilityToolbar from "../components/AccessibilityToolbar.jsx";

function LecturePage() {
  const { jobId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [mode, setMode] = useState("both");
  const [theme, setTheme] = useState("light");
  const [message, setMessage] = useState("");

  // polling control
  const pollingRef = useRef({ cancelled: false, delay: 2000 });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    let mounted = true;
    pollingRef.current.cancelled = false;
    pollingRef.current.delay = 2000; // start at 2s

    async function poll() {
      if (!mounted || pollingRef.current.cancelled) return;
      try {
        const res = await fetchResult(jobId);
        if (!mounted) return;
        setData(res);
        // stop polling when finished (COMPLETED or FAILED)
        const s = (res.status || "").toUpperCase();
        if (s === "COMPLETED" || s === "FAILED") {
          pollingRef.current.cancelled = true;
          return;
        }
        // schedule next poll with exponential backoff (cap at 30s)
        const nextDelay = Math.min(Math.round(pollingRef.current.delay * 1.6), 30000);
        pollingRef.current.delay = nextDelay;
        setTimeout(poll, nextDelay);
      } catch (err) {
        if (!mounted) return;
        // transient error: backoff and retry
        const nextDelay = Math.min(Math.round(pollingRef.current.delay * 1.6), 30000);
        pollingRef.current.delay = nextDelay;
        setError(err.message || "Failed to load status");
        setTimeout(poll, nextDelay);
      }
    }

    // initial immediate load
    poll();

    return () => {
      mounted = false;
      pollingRef.current.cancelled = true;
    };
  }, [jobId]);

  function showMessage(msg, ms = 2500) {
    setMessage(msg);
    setTimeout(() => setMessage(""), ms);
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      showMessage("Copied to clipboard");
    } catch (err) {
      showMessage("Copy failed");
    }
  }

  function downloadTxt(filename, contents) {
    const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMessage("Download started");
  }

  async function shareLecture() {
    const shareUrl = window.location.href;
    const title = data?.title || "Lecture";
    const text = data?.summary || "";
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        showMessage("Shared successfully");
        return;
      } catch (err) {
        // fallthrough to clipboard fallback
      }
    }
    // fallback: copy link
    try {
      await copyToClipboard(shareUrl);
      showMessage("Link copied to clipboard");
    } catch (err) {
      showMessage("Share failed");
    }
  }

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
        <h1>Loading…</h1>
        <p className="info-text">Waiting for server response...</p>
      </section>
    );
  }

  const status = (data.status || "").toUpperCase();
  const summaryText = data.summary || "";
  const transcriptText = data.transcript || "";

  return (
    <section className={`lecture-page theme-${theme}`}>
      <header>
        <h1>{data.title || "Lecture"}</h1>
        <div className="header-actions">
          <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
          <div className="action-buttons">
            <button
              className="btn"
              onClick={() => copyToClipboard(summaryText)}
              title="Copy summary to clipboard"
            >
              Copy summary
            </button>
            <button
              className="btn"
              onClick={() => downloadTxt(`${data.title || 'lecture'}.txt`, `Title: ${data.title || ''}\n\nSummary:\n${summaryText}\n\nTranscript:\n${transcriptText}`)}
              title="Download transcript + summary as .txt"
            >
              Download .txt
            </button>
            <button className="btn" onClick={shareLecture} title="Share link to this lecture">
              Share
            </button>
          </div>
        </div>
      </header>

      {status !== "COMPLETED" && (
        <p className="info-text">Your lecture is being processed. This page will update automatically.</p>
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
            <p style={{ fontSize, lineHeight, whiteSpace: "pre-wrap" }}>{summaryText}</p>
          </section>
        )}

        {mode !== "summary" && (
          <section className="transcript-section">
            <h2>Transcript</h2>
            <div style={{ fontSize, lineHeight, whiteSpace: "pre-wrap" }}>{transcriptText}</div>
          </section>
        )}
      </div>

      {message && <div className="toast-message">{message}</div>}
    </section>
  );
}

export default LecturePage;
