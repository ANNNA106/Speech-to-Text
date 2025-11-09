# backend/app.py
import os
import uuid
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

from config import Config
from database import init_db, create_job, get_job, update_result
from asr_pipeline import run_asr_pipeline

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)  # allow frontend (React) to call this API

    # Make sure DB exists
    init_db()

    # Allowed audio extensions
    ALLOWED_EXTENSIONS = {"wav", "mp3", "m4a", "ogg"}

    def allowed_file(filename):
        return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

    @app.route("/api/upload", methods=["POST"])
    def upload_lecture():
        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        if file and allowed_file(file.filename):
            original_name = secure_filename(file.filename)
            job_id = str(uuid.uuid4())
            upload_folder = app.config["UPLOAD_FOLDER"]
            audio_path = os.path.join(upload_folder, f"{job_id}_{original_name}")
            file.save(audio_path)

            # Create DB record with status PROCESSING
            create_job(job_id, original_name, audio_path)

            # For now, process synchronously (simple)
            try:
                transcript, summary = run_asr_pipeline(audio_path)
                update_result(job_id, transcript, summary, status="COMPLETED")
            except Exception as e:
                update_result(job_id, "", f"Processing failed: {e}", status="FAILED")

            return jsonify({"job_id": job_id})

        return jsonify({"error": "Unsupported file type"}), 400

    @app.route("/api/result/<job_id>", methods=["GET"])
    def get_result(job_id):
        row = get_job(job_id)
        if row is None:
            return jsonify({"error": "Job not found"}), 404

        return jsonify({
            "job_id": row["id"],
            "title": row["original_name"],
            "status": row["status"],
            "transcript": row["transcript_text"],
            "summary": row["summary_text"],
            "created_at": row["created_at"],
        })

    # Optional: separate status endpoint (not strictly needed if /result already returns status)
    @app.route("/api/status/<job_id>", methods=["GET"])
    def get_status(job_id):
        row = get_job(job_id)
        if row is None:
            return jsonify({"error": "Job not found"}), 404
        return jsonify({"job_id": row["id"], "status": row["status"]})

    return app

if __name__ == "__main__":
    app = create_app()
    # host=0.0.0.0 allows access from other devices on LAN (optional)
    app.run(host="127.0.0.1", port=5000, debug=True)
