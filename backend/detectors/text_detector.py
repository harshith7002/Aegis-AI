from transformers import pipeline
from detectors.cred_detector import detect_credentials

# Small + fast model for demo
# Works offline after first download
clf = pipeline(
    "text-classification",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

PHISH_SIGNALS = [
    "urgent", "verify", "suspended", "locked", "confirm",
    "click", "login", "password", "otp", "bank", "security",
    "transaction", "fraud", "blocked", "account", "immediately"
]

HIGH_RISK_PHRASES = [
    "share your otp", "send otp", "forward otp",
    "verify immediately", "account locked", "account suspended",
    "click the link", "login now", "confirm your password",
    "your account will be closed"
]

def analyze_text(text: str):
    t = text.lower()
    reasons = []
    score = 0

    # -----------------------------
    # 1) High risk phrases (STRONG)
    # -----------------------------
    for phrase in HIGH_RISK_PHRASES:
        if phrase in t:
            score += 25
            reasons.append(f"High-risk scam phrase detected: '{phrase}'")
            break

    # -----------------------------
    # 2) Phishing keyword density
    # -----------------------------
    hits = sum(1 for w in PHISH_SIGNALS if w in t)
    if hits >= 3:
        score += 25
        reasons.append("Phishing keyword density detected")
    if hits >= 6:
        score += 20
        reasons.append("Very high phishing keyword density")

    # -----------------------------
    # 3) Suspicious links
    # -----------------------------
    if "http://" in t:
        score += 20
        reasons.append("Insecure link detected (http)")

    if "bit.ly" in t or "tinyurl" in t or "t.co/" in t:
        score += 15
        reasons.append("URL shortener detected")

    # -----------------------------
    # 4) OTP scam (make it HIGH)
    # -----------------------------
    otp_words = ["otp", "one time password", "verification code", "code"]
    share_words = ["share", "send", "forward", "reply"]

    if any(o in t for o in otp_words) and any(s in t for s in share_words):
        score += 60
        reasons.append("OTP sharing request detected (high severity)")

    # -----------------------------
    # 5) Bank impersonation language
    # -----------------------------
    bank_words = ["bank", "account", "security team", "customer", "transaction"]
    if any(w in t for w in bank_words):
        score += 15
        reasons.append("Bank/account impersonation language")

    # -----------------------------
    # 6) Transformer signal
    # -----------------------------
    out = clf(text[:512])[0]
    if out["label"] == "NEGATIVE":
        score += 15
        reasons.append("Transformer flagged suspicious intent")

    # -----------------------------
    # 7) Credential exposure
    # -----------------------------
    findings = detect_credentials(text)
    if findings:
        score += 35
        reasons.append("Credential exposure detected")

    # Final clamp
    score = min(100, score)

    # Tier mapping
    tier = "LOW"
    if score >= 75:
        tier = "HIGH"
    elif score >= 40:
        tier = "MEDIUM"

    # Threat label
    label = "Likely Safe"
    if any(o in t for o in otp_words) and any(s in t for s in share_words):
        label = "OTP Scam"
    elif score >= 50:
        label = "Phishing"

    return {
        "final_risk_score": score,
        "tier": tier,
        "fraud": {"top_label": label},
        "reasons": list(dict.fromkeys(reasons))[:7],
        "credentials": {"findings": findings},
    }
