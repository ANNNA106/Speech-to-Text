# backend/asr_pipeline.py

def run_asr_pipeline(audio_path: str):
    """
    For now this is a dummy function.

    Later:
    - Load audio
    - Denoise / segment
    - Run ASR model to get transcript
    - Post-process (punctuation, corrections)
    - Run summarization model on transcript
    """
    # TODO: replace with real ASR + NLP
    dummy_transcript = (
        "This is a placeholder transcript for the uploaded lecture. "
        "Replace this with output from your ASR model."
    )

    dummy_summary = (
        "This is a short summary of the lecture. "
        "Replace this with your summarization model output."
    )

    return dummy_transcript, dummy_summary
