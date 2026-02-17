import re

PATTERNS = {
    "Email": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
    "Password": r"(password\s*[:=]\s*[^\s]{6,})",
    "OTP": r"\b(otp\s*[:=]?\s*\d{4,8})\b|\b\d{6}\b",
    "JWT Token": r"eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+",
    "AWS Key": r"(AKIA[0-9A-Z]{16})",
    "API Token": r"(token\s*[:=]\s*[A-Za-z0-9_\-]{16,})",
}

def detect_credentials(text: str):
    findings = []

    for name, pat in PATTERNS.items():
        matches = re.findall(pat, text, flags=re.IGNORECASE)
        if matches:
            findings.append({
                "type": name,
                "count": len(matches)
            })

    return findings
