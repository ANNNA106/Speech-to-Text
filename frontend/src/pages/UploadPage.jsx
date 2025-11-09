// frontend/src/pages/UploadPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadLecture } from "../api.js";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an audio file.");
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadLecture(file);
      // Redirect to lecture page with job_id
      navigate(`/lecture/${res.job_id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="upload-page">
      <h1>Upload Lecture Recording</h1>
      <form onSubmit={handleSubmit} className="upload-form">
        <label>
          Select audio file:
          <input
            type="file"
            accept=".wav,.mp3,.m4a,.ogg"
            onChange={handleFileChange}
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button
          type="submit"
          className="primary-button"
          disabled={isUploading}
        >
          {isUploading ? "Processing..." : "Upload & Process"}
        </button>
      </form>

      <p className="hint">
        Supported formats: WAV, MP3, M4A, OGG. Longer files will take more time.
      </p>

      <p className="upload-hint">
        Recommended max length: <strong>~1 minute (60s)</strong>. If your machine
        or server has a GPU the backend can handle longer recordings, but on
        CPU-only hosts large files will be slow or may time out — consider
        splitting recordings into smaller chunks before upload.
      </p>
    </section>
  );
}

export default UploadPage;
