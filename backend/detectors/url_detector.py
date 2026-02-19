import re
import tldextract
from rapidfuzz.distance import Levenshtein

TRUSTED_BRANDS = ["barclays", "paypal", "microsoft", "google", "apple", "amazon"]
SUSPICIOUS_WORDS = [
    "secure", "verify", "login", "account", "update", "confirm",
    "wallet", "support", "help", "reset", "password", "signin"
]

def looks_like_ip(host: str):
    return bool(re.match(r"^\d{1,3}(\.\d{1,3}){3}$", host))

def analyze_url(url: str):
    reasons = []
    score = 0
    u = url.lower().strip()

    # -------------------------
    # 1) Protocol risk
    # -------------------------
    if u.startswith("http://"):
        score += 25
        reasons.append("URL uses insecure HTTP")
    elif u.startswith("https://"):
        score += 5  # still risk if phishing

    # -------------------------
    # 2) Extract domain
    # -------------------------
    ext = tldextract.extract(u)
    sub = ext.subdomain.lower()
    domain = ext.domain.lower()
    suffix = ext.suffix.lower()
    full_domain = f"{domain}.{suffix}" if suffix else domain
    host_full = ".".join([x for x in [sub, domain, suffix] if x])

    # -------------------------
    # 3) IP address instead of domain
    # -------------------------
    if looks_like_ip(domain) or looks_like_ip(host_full):
        score += 45
        reasons.append("Uses raw IP address instead of domain")

    # -------------------------
    # 4) Suspicious keywords (NO BREAK now)
    # -------------------------
    keyword_hits = 0
    for w in SUSPICIOUS_WORDS:
        if w in u:
            keyword_hits += 1

    if keyword_hits > 0:
        score += min(25, keyword_hits * 8)
        reasons.append(f"Suspicious keywords in URL ({keyword_hits})")

    # -------------------------
    # 5) Hyphen & long domain tricks
    # -------------------------
    if "-" in domain:
        score += 12
        reasons.append("Hyphenated domain pattern")

    if len(domain) >= 18:
        score += 10
        reasons.append("Unusually long domain name")

    # -------------------------
    # 6) Too many subdomains trick
    # -------------------------
    if sub:
        sub_parts = sub.split(".")
        if len(sub_parts) >= 2:
            score += 15
            reasons.append("Multiple subdomains (possible hiding technique)")

    # -------------------------
    # 7) Brand spoofing checks
    # -------------------------
    # A) Brand in subdomain (classic phishing)
    for brand in TRUSTED_BRANDS:
        if brand in sub:
            score += 35
            reasons.append(f"Brand name '{brand}' appears in subdomain")
            break

    # B) Domain typosquat (distance <= 2 is better)
    for brand in TRUSTED_BRANDS:
        dist = Levenshtein.distance(domain, brand)

        if dist == 1:
            score += 55
            reasons.append(f"Very likely typosquatting of '{brand}'")
            break
        elif dist == 2:
            score += 40
            reasons.append(f"Possible typosquatting of '{brand}'")
            break

        # C) Brand contained inside domain with extra junk
        if brand in domain and domain != brand:
            score += 30
            reasons.append(f"Brand '{brand}' embedded inside domain")
            break

    # -------------------------
    # 8) Suspicious path patterns
    # -------------------------
    if any(x in u for x in ["/login", "/signin", "/verify", "/reset", "/update"]):
        score += 15
        reasons.append("Suspicious login/verify path detected")

    # -------------------------
    # 9) URL shorteners
    # -------------------------
    if any(x in u for x in ["bit.ly", "tinyurl", "t.co", "goo.gl"]):
        score += 30
        reasons.append("URL shortener detected")

    # -------------------------
    # 10) Final boosts (make HIGH actually happen)
    # -------------------------
    if ("login" in u or "verify" in u) and ("secure" in u or "account" in u):
        score = max(score, 75)

    if "http://" in u and keyword_hits >= 2:
        score = max(score, 80)

    score = min(100, score)

    # -------------------------
    # Tier mapping
    # -------------------------
    if score >= 75:
        tier = "HIGH"
    elif score >= 40:
        tier = "MEDIUM"
    else:
        tier = "LOW"

    # Label mapping
    if score >= 75:
        label = "Phishing URL"
    elif score >= 40:
        label = "Spoofing / Suspicious"
    else:
        label = "Likely Safe"

    return {
        "domain": full_domain,
        "label": label,
        "final_risk_score": score,
        "tier": tier,
        "reasons": list(dict.fromkeys(reasons))[:7],
    }
