import tldextract
from rapidfuzz.distance import Levenshtein

TRUSTED_BRANDS = ["barclays", "paypal", "microsoft", "google", "apple"]
SUSPICIOUS_WORDS = ["secure", "verify", "login", "account", "update", "confirm"]

def analyze_url(url: str):
    reasons = []
    score = 0

    if url.startswith("http://"):
        score += 20
        reasons.append("URL uses insecure HTTP")

    ext = tldextract.extract(url)
    domain = ext.domain.lower()
    full_domain = f"{ext.domain}.{ext.suffix}"

    # suspicious keywords
    for w in SUSPICIOUS_WORDS:
        if w in url.lower():
            score += 10
            reasons.append(f"Contains suspicious keyword: {w}")
            break

    # hyphen domain
    if "-" in domain:
        score += 10
        reasons.append("Hyphenated domain pattern")

    # typosquat check
    for brand in TRUSTED_BRANDS:
        dist = Levenshtein.distance(domain, brand)
        if dist == 1:
            score += 45
            reasons.append(f"Possible typosquatting of '{brand}'")
            break

    score = min(100, score)

    tier = "LOW"
    if score >= 75:
        tier = "HIGH"
    elif score >= 40:
        tier = "MEDIUM"

    label = "Likely Safe"
    if score >= 45:
        label = "Spoofing"

    return {
        "domain": full_domain,
        "label": label,
        "final_risk_score": score,
        "tier": tier,
        "reasons": list(dict.fromkeys(reasons))[:7],
    }
