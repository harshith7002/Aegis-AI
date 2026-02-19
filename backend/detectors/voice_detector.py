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

    # Convert to float
    y = y.astype(float)

    duration = len(y) / sr

    # ----------------------------
    # 1) Basic checks
    # ----------------------------
    if duration < 1.5:
        score += 15
        reasons.append("Very short sample (low confidence)")

    if sr < 16000:
        score += 15
        reasons.append("Low sample rate recording (often compressed calls)")

    # ----------------------------
    # 2) MFCC Features
    # ----------------------------
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
    mfcc_var = np.var(mfcc, axis=1)
    var_mean = float(np.mean(mfcc_var))

    if var_mean < 12:
        score += 65
        reasons.append("Extremely low MFCC variance (strong synthetic indicator)")
    elif var_mean < 18:
        score += 45
        reasons.append("Low MFCC variance (possible synthetic voice)")

    # ----------------------------
    # 3) Spectral features
    # ----------------------------
    centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
    centroid_mean = float(np.mean(centroid))

    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    rolloff_mean = float(np.mean(rolloff))

    if centroid_mean < 1200:
        score += 15
        reasons.append("Unnaturally low spectral centroid (flat voice profile)")

    if rolloff_mean < 2500:
        score += 15
        reasons.append("Low spectral rolloff (compressed / synthetic-like audio)")

    # ----------------------------
    # 4) Zero Crossing Rate
    # ----------------------------
    zcr = librosa.feature.zero_crossing_rate(y)
    zcr_mean = float(np.mean(zcr))

    if zcr_mean < 0.03:
        score += 15
        reasons.append("Low zero-crossing rate (over-smoothed voice)")
    elif zcr_mean > 0.18:
        score += 12
        reasons.append("High zero-crossing rate (possible artifacts / noise)")

    # ----------------------------
    # 5) RMS energy stability
    # ----------------------------
    rms = librosa.feature.rms(y=y)[0]
    rms_std = float(np.std(rms))

    if rms_std < 0.01:
        score += 20
        reasons.append("Unnaturally stable energy (robotic consistency)")

    # ----------------------------
    # 6) Final boosting rules (important)
    # ----------------------------
    # If multiple synthetic signals stack up, push to HIGH.
    strong_signals = 0
    if var_mean < 18:
        strong_signals += 1
    if rms_std < 0.01:
        strong_signals += 1
    if zcr_mean < 0.03:
        strong_signals += 1
    if centroid_mean < 1200:
        strong_signals += 1

    if strong_signals >= 3:
        score = max(score, 80)
        reasons.append("Multiple synthetic voice indicators stacked")

    score = min(100, score)

    # ----------------------------
    # Tier mapping
    # ----------------------------
    if score >= 75:
        tier = "HIGH"
    elif score >= 40:
        tier = "MEDIUM"
    else:
        tier = "LOW"

    return {
        "final_risk_score": score,
        "tier": tier,
        "reasons": list(dict.fromkeys(reasons))[:7],
        "meta": {
            "filename": filename,
            "sample_rate": int(sr),
            "duration_sec": round(duration, 2),
            "mfcc_var_mean": round(var_mean, 3),
            "spectral_centroid_mean": round(centroid_mean, 2),
            "spectral_rolloff_mean": round(rolloff_mean, 2),
            "zcr_mean": round(zcr_mean, 4),
            "rms_std": round(rms_std, 6),
        },
    }
