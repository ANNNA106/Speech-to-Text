# backend/config.py
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Folder where uploaded audio is stored
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    # SQLite DB inside instance/
    INSTANCE_FOLDER = os.path.join(BASE_DIR, "instance")
    os.makedirs(INSTANCE_FOLDER, exist_ok=True)
    DB_PATH = os.path.join(INSTANCE_FOLDER, "lectures.db")

    # Max upload size (e.g., 200 MB)
    MAX_CONTENT_LENGTH = 200 * 1024 * 1024

    # In production set something stronger
    SECRET_KEY = "dev-secret-key"
