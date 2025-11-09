// frontend/src/api.js
export const API_BASE_URL = "http://127.0.0.1:5000"; // Flask backend

export async function uploadLecture(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Upload failed");
  }
  return res.json(); // { job_id }
}

export async function fetchResult(jobId) {
  const res = await fetch(`${API_BASE_URL}/api/result/${jobId}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to get result");
  }
  return res.json();
}
