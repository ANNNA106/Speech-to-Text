# backend/asr_pipeline.py
import os
import textwrap
import torch

import whisper
from transformers import pipeline

# -------------------------
# 1. Load models once
# -------------------------

# Whisper ASR model
# Options: "tiny", "base", "small", "medium", "large"
# Start with "small" or "base" for speed
WHISPER_MODEL_NAME = "small"

print(f"[ASR] Loading Whisper model: {WHISPER_MODEL_NAME} ...")
whisper_model = whisper.load_model(WHISPER_MODEL_NAME)

# Summarization model
# "facebook/bart-large-cnn" is a good general summarizer for English
SUMMARIZER_MODEL_NAME = "facebook/bart-large-cnn"

print(f"[NLP] Loading summarizer model: {SUMMARIZER_MODEL_NAME} ...")
summarizer = pipeline(
    "summarization",
    model=SUMMARIZER_MODEL_NAME,
    tokenizer=SUMMARIZER_MODEL_NAME,
    device="cuda:0" if torch.cuda.is_available() else -1,
)

# -------------------------
# 2. Helper functions
# -------------------------

def transcribe_audio(audio_path: str) -> str:
    """
    Run Whisper ASR on the given audio file and return the transcript text.
    """
    print(f"[ASR] Transcribing: {audio_path}")
    # Whisper handles resampling and most formats via ffmpeg internally
    result = whisper_model.transcribe(audio_path, language="en")  # or None for autodetect
    transcript = result.get("text", "").strip()
    print(f"[ASR] Transcript length: {len(transcript)} characters")
    return transcript


def clean_transcript(text: str) -> str:
    """
    Basic cleanup for transcript. Whisper already outputs punctuation, so we mainly
    normalize whitespace.
    """
    # Remove extra spaces/newlines
    cleaned = " ".join(text.split())
    return cleaned


def chunk_text(text: str, max_chars: int = 1500):
    """
    Split long text into chunks of at most max_chars, trying to break on sentence boundaries.
    """
    paragraphs = text.split(". ")
    chunks = []
    current = ""

    for p in paragraphs:
        # Add back the period we split on (except maybe last)
        if current and len(current) + len(p) + 2 > max_chars:
            chunks.append(current.strip())
            current = p + ". "
        else:
            current += p + ". "

    if current.strip():
        chunks.append(current.strip())

    return chunks


def summarize_long_text(text: str, max_chars_per_chunk: int = 1500) -> str:
    """
    Summarize long text by:
    - Splitting into chunks
    - Summarizing each chunk
    - Optionally summarizing the concatenated chunk summaries
    """
    text = text.strip()
    if not text:
        return ""

    chunks = chunk_text(text, max_chars=max_chars_per_chunk)
    print(f"[NLP] Summarizing transcript in {len(chunks)} chunk(s)")

    chunk_summaries = []

    for i, chunk in enumerate(chunks):
        # BART works best with <= 1024 tokens; here we control by characters
        # You can tune min_length/max_length based on your lecture style
        print(f"[NLP] Summarizing chunk {i+1}/{len(chunks)} (len={len(chunk)})")
        out = summarizer(
            chunk,
            max_length=200,
            min_length=60,
            do_sample=False,
            truncation=True,
        )
        summary_text = out[0]["summary_text"].strip()
        chunk_summaries.append(summary_text)

    if len(chunk_summaries) == 1:
        return chunk_summaries[0]

    # Second-level summary: summarize the concatenated chunk summaries
    combined = " ".join(chunk_summaries)
    print(f"[NLP] Summarizing combined summary (len={len(combined)})")
    final_out = summarizer(
        combined,
        max_length=250,
        min_length=80,
        do_sample=False,
        truncation=True,
    )
    final_summary = final_out[0]["summary_text"].strip()
    return final_summary


# -------------------------
# 3. Main pipeline function
# -------------------------

def run_asr_pipeline(audio_path: str):
    """
    End-to-end pipeline:
    - Transcribe audio with Whisper
    - Clean transcript
    - Summarize with transformer
    Return (transcript, summary)
    """
    # 1. ASR
    raw_transcript = transcribe_audio(audio_path)

    # 2. Cleanup
    transcript = clean_transcript(raw_transcript)

    # 3. Summarize
    summary = summarize_long_text(transcript)

    return transcript, summary
