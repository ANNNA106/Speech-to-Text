# Speech-to-Text

# Accessible Lecture Transcription & Summarization Website

> A complete web application that converts uploaded **lecture audio** into clean **transcripts and summaries** using AI.  
> Built for **DES646 – AI/ML for Designers** practical project.

---

## Overview

This project combines an **AI-powered backend** (Flask + Whisper + Hugging Face Transformers) with an **accessible frontend** (React + Vite).  
Users can upload recorded lectures and receive readable, summarized notes optimized for accessibility.

---

## Features

- Upload lecture recordings (`.wav`, `.mp3`, `.m4a`, `.ogg`)
- Automatic **speech-to-text** via OpenAI Whisper  
- Automatic **summarization** via BART (Hugging Face Transformers)
- Accessibility tools — adjustable font size, line spacing, and high-contrast themes
- Download transcript / summary
- Simple, responsive UI built in React + Vite

---

## Tech Stack

| Layer | Tools |
|-------|-------|
| **Frontend** | React 18, Vite 7, React Router DOM |
| **Backend** | Flask, Flask-CORS, SQLite |
| **AI Models** | OpenAI Whisper, Hugging Face BART |
| **Audio Processing** | ffmpeg |
| **Languages** | Python 3.10+, JavaScript (ES6+) |

---

## Prerequisites

| Tool | Minimum Version | Notes |
|------|-----------------|-------|
| **Node.js** | ≥ 20.19 | required by Vite 7 |
| **Python** | ≥ 3.10 | 3.11 recommended |
| **Git** | latest | to clone repo |
| **ffmpeg** | any recent build | must be installed and added to PATH |
| *(optional)* nvm | — | manage Node versions easily |

---

## Installation Guide (From Scratch)

### Clone the Repository
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
````

Project tree should look like:

```
backend/
frontend/
```

---

### Install ffmpeg (Mandatory)

#### Windows (Manual Installation)

1. **Download** ffmpeg from [gyan.dev ffmpeg builds](https://www.gyan.dev/ffmpeg/builds/).
2. **Extract** the ZIP file to a permanent folder, for example:

   ```
   C:\ffmpeg\
   ```

   Inside it, you should see:

   ```
   C:\ffmpeg\bin\ffmpeg.exe
   ```
3. **Add to PATH**

   * Press **Win + R** → type `sysdm.cpl` → hit **Enter**
   * Go to **Advanced → Environment Variables**
   * Under **System Variables**, find and select `Path`
   * Click **Edit → New**
   * Paste:

     ```
     C:\ffmpeg\bin
     ```
   * Click **OK → OK → OK** to save.
4. **Restart** all terminals (important!)
5. **Verify installation:**

   ```bash
   ffmpeg -version
   ```

   If you see version info, ffmpeg is correctly installed.

#### macOS

```bash
brew install ffmpeg
```

#### Linux (Debian/Ubuntu)

```bash
sudo apt update && sudo apt install ffmpeg
```

If `ffmpeg -version` prints version info, you’re ready to proceed.

---

### Set Up Backend

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate           # Windows
# source .venv/bin/activate        # macOS/Linux
pip install -r requirements.txt
```

#### Example `requirements.txt`

```
flask
flask-cors
openai-whisper
torch
transformers
ffmpeg-python
sentencepiece
accelerate
```

---

### Run the Backend

```bash
python app.py
```

You should see:

```
[ASR] Loading Whisper model: small ...
[NLP] Loading summarizer model: facebook/bart-large-cnn ...
 * Running on http://127.0.0.1:5000
```

Keep this terminal open while running the frontend.

---

### Set Up Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite prints:

```
VITE v7.x ready in 2 s
➜ Local: http://localhost:5173/
```

Visit that URL in your browser.

---

## Usage

1. Open **[http://localhost:5173/](http://localhost:5173/)**
2. Click **Upload Lecture**
3. Select an audio file (`.wav`, `.mp3`, `.m4a`, `.ogg`)
4. Wait for processing (Whisper + Summarizer)
5. Read the transcript and summary
6. Adjust accessibility settings (font, spacing, theme)

---

## Project Structure

```
project-root/
├── backend/
│   ├── app.py                # Flask API
│   ├── asr_pipeline.py       # Whisper + summarization logic
│   ├── database.py           # SQLite helpers
│   ├── config.py             # paths and constants
│   ├── requirements.txt
│   └── instance/lectures.db  # auto-created database
└── frontend/
    ├── src/
    │   ├── api.js
    │   ├── App.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── UploadPage.jsx
    │   │   └── LecturePage.jsx
    │   └── components/
    │       └── AccessibilityToolbar.jsx
    ├── package.json
    └── vite.config.js
```

---

## Configuration (`backend/asr_pipeline.py`)

| Variable                | Default                     | Description                                      |
| ----------------------- | --------------------------- | ------------------------------------------------ |
| `WHISPER_MODEL_NAME`    | `"small"`                   | Use `"tiny"` or `"base"` for faster CPU runs     |
| `SUMMARIZER_MODEL_NAME` | `"facebook/bart-large-cnn"` | Change to any Hugging Face summarizer            |
| `language`              | `"en"`                      | Language hint for Whisper (`None` = auto-detect) |

---
## Testing

Quick functional test:

```bash
cd backend
.\.venv\Scripts\activate
python app.py
```

In browser:

1. Upload a 10–20 second audio clip.
2. Backend log should show:

   ```
   [ASR] Transcribing...
   [ASR] Transcript length: XXXX characters
   [NLP] Summarizing transcript...
   ```
3. Transcript and summary appear on the website.

---

## Deployment (Advanced)

| Environment                   | How                                                                        |
| ----------------------------- | -------------------------------------------------------------------------- |
| **Local**                     | Run Flask (port 5000) + Vite (`npm run build`)                             |
| **Render / Railway / Heroku** | Deploy Flask backend as web service; serve `frontend/dist` as static files |
| **Docker**                    | Create multi-stage Dockerfile (frontend build + backend runtime)           |

---

## Credits

* **Speech-to-Text:** [OpenAI Whisper](https://github.com/openai/whisper)
* **Summarization:** [Hugging Face Transformers](https://huggingface.co/)
* **Frontend:** React + Vite
* **Backend:** Flask
* Project by the **DES646 – AI/ML for Designers** Team:

Ananya Baghel (220136)\
Shriya Garg (221038)\
Anya Rajan (220191)\
Divit Shah (220995)\
Kanika Chaturvedi (220497)



