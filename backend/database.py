# backend/database.py
import sqlite3
from datetime import datetime
from config import Config

DB_PATH = Config.DB_PATH

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # so we can access by column name
    return conn

def init_db():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS lecture_jobs (
            id TEXT PRIMARY KEY,
            original_name TEXT,
            audio_path TEXT,
            transcript_text TEXT,
            summary_text TEXT,
            status TEXT,
            created_at TEXT
        );
        """
    )
    conn.commit()
    conn.close()

def create_job(job_id, original_name, audio_path):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO lecture_jobs (id, original_name, audio_path, transcript_text,
                                  summary_text, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            job_id,
            original_name,
            audio_path,
            "",
            "",
            "PROCESSING",
            datetime.utcnow().isoformat()
        ),
    )
    conn.commit()
    conn.close()

def update_result(job_id, transcript_text, summary_text, status="COMPLETED"):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        UPDATE lecture_jobs
        SET transcript_text = ?, summary_text = ?, status = ?
        WHERE id = ?
        """,
        (transcript_text, summary_text, status, job_id),
    )
    conn.commit()
    conn.close()

def get_job(job_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM lecture_jobs WHERE id = ?", (job_id,))
    row = cur.fetchone()
    conn.close()
    return row
