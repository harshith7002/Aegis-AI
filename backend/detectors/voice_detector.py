import numpy as np
import librosa
import soundfile as sf
import io

def analyze_voice(audio_bytes: bytes, filename="audio.wav"):
    reasons = []
    score = 0

    # Load audio
    y, sr = sf.read(io.BytesIO(audio_bytes))
    if y.ndim > 1:
        y = y.mean(axis=1)

    duration = len(y) / sr

    # MFCC features
    mfcc = librosa.feature.mfcc(y=y.astype(float), sr=sr, n_mfcc=20)
    mfcc_var = np.var(mfcc, axis=1)
    var_mean = float(np.mean(mfcc_var))

    # Heuristic deepfake signals
    if var_mean < 15:
        score += 55
        reasons.append("Low MFCC variance (synthetic voice indicator)")

    if sr < 16000:
        score += 10
        reasons.append("Low sample rate recording")

    if duration < 2.0:
        score += 10
        reasons.append("Very short sample (low confidence)")

    score = min(100, score)

    tier = "LOW"
    if score >= 75:
        tier = "HIGH"
    elif score >= 40:
        tier = "MEDIUM"

    return {
        "final_risk_score": score,
        "tier": tier,
        "reasons": reasons,
        "meta": {
            "filename": filename,
            "sample_rate": sr,
            "duration_sec": round(duration, 2),
            "mfcc_var_mean": round(var_mean, 3),
        },
    }
