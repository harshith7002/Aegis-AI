from transformers import pipeline
from detectors.cred_detector import detect_credentials

# Small + fast model for demo
# (works offline after first install)
clf = pipeline(
    "text-classification",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

PHISH_SIGNALS = [
    "urgent", "verify", "suspended", "locked", "confirm",
    "click", "login", "password", "otp", "bank", "security"
]

def analyze_text(text: str):
    t = text.lower()
    reasons = []
    score = 0

    # phishing keywords density
    hits = sum(1 for w in PHISH_SIGNALS if w in t)
    if hits >= 4:
        score += 35
        reasons.append("High phishing keyword density")

    # suspicious links
    if "http://" in t:
        score += 15
        reasons.append("Insecure link detected (http)")

    if "bit.ly" in t or "tinyurl" in t:
        score += 12
        reasons.append("URL shortener detected")

    # OTP request intent
    if "otp" in t and ("share" in t or "send" in t):
        score += 25
        reasons.append("OTP sharing request detected")

    # Transformer signal (acts as extra signal)
    out = clf(text[:512])[0]
    if out["label"] == "NEGATIVE":
        score += 12
        reasons.append("Transformer flagged suspicious intent")

    # Credential exposure
    findings = detect_credentials(text)
    if findings:
        score += 25
        reasons.append("Credential exposure detected")

    score = min(100, score)

    tier = "LOW"
    if score >= 75:
        tier = "HIGH"
    elif score >= 40:
        tier = "MEDIUM"

    label = "Likely Safe"
    if score >= 50:
        label = "Phishing"

    return {
        "final_risk_score": score,
        "tier": tier,
        "fraud": {"top_label": label},
        "reasons": list(dict.fromkeys(reasons))[:7],
        "credentials": {"findings": findings},
    }
