from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import uuid

from detectors.text_detector import analyze_text
from detectors.url_detector import analyze_url
from detectors.voice_detector import analyze_voice
from storage.logs import add_log, get_logs

app = FastAPI(title="SentinelAI Backend", version="1.0")

# CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextReq(BaseModel):
    text: str

class UrlReq(BaseModel):
    url: str

@app.get("/")
def root():
    return {"status": "ok", "service": "SentinelAI Backend"}

@app.post("/analyze/text")
def scan_text(req: TextReq):
    result = analyze_text(req.text)

    log = {
        "id": str(uuid.uuid4()),
        "type": "text",
        "label": result["fraud"]["top_label"],
        "score": result["final_risk_score"],
        "tier": result["tier"],
        "time": datetime.now().strftime("%b %d • %H:%M"),
        "summary": ", ".join(result["reasons"][:3]) if result["reasons"] else "No strong signals",
    }
    add_log(log)

    return result

@app.post("/analyze/url")
def scan_url(req: UrlReq):
    result = analyze_url(req.url)

    log = {
        "id": str(uuid.uuid4()),
        "type": "url",
        "label": result["label"],
        "score": result["final_risk_score"],
        "tier": result["tier"],
        "time": datetime.now().strftime("%b %d • %H:%M"),
        "summary": ", ".join(result["reasons"][:3]) if result["reasons"] else "No strong signals",
    }
    add_log(log)

    return result

@app.post("/analyze/voice")
async def scan_voice(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    result = analyze_voice(audio_bytes, filename=file.filename)

    log = {
        "id": str(uuid.uuid4()),
        "type": "voice",
        "label": "Deepfake",
        "score": result["final_risk_score"],
        "tier": result["tier"],
        "time": datetime.now().strftime("%b %d • %H:%M"),
        "summary": ", ".join(result["reasons"][:3]) if result["reasons"] else "No strong signals",
    }
    add_log(log)

    return result

@app.get("/logs")
def logs():
    return get_logs()
