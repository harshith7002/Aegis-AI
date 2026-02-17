import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Link2,
  ShieldAlert,
  Sparkles,
  Copy,
  ArrowRight,
  RefreshCcw,
  Download,
  Globe,
  Lock,
  AlertTriangle,
} from "lucide-react";

import Card from "../components/card";
import RiskMeter from "../components/riskmeter";
import "../styles/layout.css";

const API = "http://127.0.0.1:8000";

const DEMO_URLS = [
  "https://www.barclays.co.uk",
  "http://barclays-secure-verification.com/login",
  "https://paypaI.com.security-checking.info/login",
  "https://microsoft-support-alerts.com/verify",
];

function parseUrl(url) {
  try {
    const u = new URL(url);
    return {
      ok: true,
      protocol: u.protocol.replace(":", ""),
      host: u.hostname,
      path: u.pathname + u.search,
      full: u.href,
    };
  } catch {
    return { ok: false };
  }
}

export default function UrlPage() {
  const [url, setUrl] = useState("");
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    if (!url.trim()) return alert("Paste a URL first.");
    setLoading(true);
    setRes(null);

    try {
      const r = await fetch(`${API}/analyze/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await r.json();
      setRes(data);
    } catch {
      alert("Backend not running. Start FastAPI first.");
    }

    setLoading(false);
  }

  function reset() {
    setUrl("");
    setRes(null);
    setLoading(false);
  }

  function copyUrl() {
    navigator.clipboard.writeText(url);
  }

  function exportJson() {
    if (!res) return;
    const blob = new Blob([JSON.stringify(res, null, 2)], {
      type: "application/json",
    });
    const link = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = link;
    a.download = "sentinelai_url_report.json";
    a.click();
    URL.revokeObjectURL(link);
  }

  const parsed = useMemo(() => parseUrl(url), [url]);

  const riskScore = res?.final_risk_score ?? 0;
  const reasons = res?.reasons ?? [];
  const domain = res?.domain ?? parsed?.host ?? "—";

  const confidence = res
    ? Math.min(0.95, riskScore / 100 + 0.15).toFixed(2)
    : "—";

  const tier = useMemo(() => {
    if (!res) return "—";
    if (riskScore >= 75) return "HIGH";
    if (riskScore >= 40) return "MEDIUM";
    return "LOW";
  }, [res, riskScore]);

  return (
    <div className="page">
      {/* Header */}
      <div className="tool-header">
        <h2>
          <Link2 size={22} style={{ marginRight: 8 }} />
          URL Phishing / Spoofing Detection
        </h2>
        <p>
          Detect typosquatting, suspicious domains, and phishing URL structures —
          with explainable risk scoring.
        </p>
      </div>

      <div className="grid2">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Card
            title="URL Input"
            subtitle="Paste a link from email, SMS, or browser."
            right={
              <span className="pill">
                <Sparkles size={14} /> Spoof-aware
              </span>
            }
          >
            <input
              className="urlInput"
              placeholder="https://example.com/login"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <div className="demoRow">
              {DEMO_URLS.map((u) => (
                <button key={u} className="chipBtn" onClick={() => setUrl(u)}>
                  {u.includes("barclays.co.uk")
                    ? "Legit Bank"
                    : u.includes("paypa")
                    ? "Typosquat"
                    : "Phishing"}
                </button>
              ))}
            </div>

            {/* Safe preview */}
            <div className="urlPreview">
              <div className="blockTitle">
                <span className="iconCircle">
                  <Globe size={16} />
                </span>
                Safe Preview (no visiting)
              </div>

              {!parsed.ok ? (
                <p className="muted" style={{ marginTop: 10 }}>
                  Enter a valid URL to preview domain + structure.
                </p>
              ) : (
                <div className="previewGrid">
                  <div className="miniBox">
                    <span className="miniLabel">Protocol</span>
                    <span className="miniValue">
                      {parsed.protocol === "https" ? (
                        <>
                          <Lock size={14} /> https
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={14} /> http
                        </>
                      )}
                    </span>
                  </div>

                  <div className="miniBox">
                    <span className="miniLabel">Domain</span>
                    <span className="miniValue">{parsed.host}</span>
                  </div>

                  <div className="miniBox full">
                    <span className="miniLabel">Path</span>
                    <span className="miniValue">{parsed.path}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="actionsRow">
              <button className="btn" onClick={analyze} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze"}
                <ArrowRight size={18} />
              </button>

              <button className="btn ghost" onClick={reset}>
                <RefreshCcw size={16} /> Reset
              </button>

              <button className="btn ghost" onClick={copyUrl}>
                <Copy size={16} /> Copy
              </button>

              <button className="btn ghost" onClick={exportJson} disabled={!res}>
                <Download size={16} /> Export
              </button>
            </div>
          </Card>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          className="resultsSticky"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <Card
            title="Detection Results"
            subtitle="Domain reputation + spoof indicators + evidence."
            right={
              res ? (
                <div className="tierWrap">
                  <span className={`tier ${tier.toLowerCase()}`}>{tier}</span>
                  <span className="muted" style={{ fontSize: 12 }}>
                    conf {confidence}
                  </span>
                </div>
              ) : null
            }
          >
            {loading ? (
              <SkeletonResults />
            ) : !res ? (
              <div className="emptyState">
                <ShieldAlert size={42} />
                <h3>No analysis yet</h3>
                <p className="muted">
                  Run detection to view risk score, spoof indicators, and evidence.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <RiskMeter score={riskScore} />

                <div className="resultBlock">
                  <div className="blockTitle">
                    <span className="iconCircle">
                      <Globe size={16} />
                    </span>
                    Domain Summary
                  </div>

                  <div className="previewGrid" style={{ marginTop: 12 }}>
                    <div className="miniBox">
                      <span className="miniLabel">Domain</span>
                      <span className="miniValue">{domain}</span>
                    </div>

                    <div className="miniBox">
                      <span className="miniLabel">Protocol</span>
                      <span className="miniValue">
                        {parsed.ok ? parsed.protocol : "—"}
                      </span>
                    </div>

                    <div className="miniBox full">
                      <span className="miniLabel">Full URL</span>
                      <span className="miniValue">
                        {parsed.ok ? parsed.full : url}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="resultBlock">
                  <div className="blockTitle">
                    <span className="iconCircle">
                      <Sparkles size={16} />
                    </span>
                    Evidence
                  </div>

                  <div className="chips">
                    {reasons.length === 0 ? (
                      <span className="muted">
                        No strong spoof signals detected.
                      </span>
                    ) : (
                      reasons.map((r, i) => (
                        <span className="chip" key={i}>
                          {r}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="resultBlock">
                  <div className="blockTitle">
                    <span className="iconCircle">
                      <ShieldAlert size={16} />
                    </span>
                    Recommendation
                  </div>

                  <p className="muted" style={{ marginTop: 10 }}>
                    {tier === "HIGH"
                      ? "Do not open this link. Block the domain and alert the user."
                      : tier === "MEDIUM"
                      ? "Use caution. Verify sender identity and domain authenticity."
                      : "Low risk detected. Still verify context if unexpected."}
                  </p>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- Skeleton ---------- */
function SkeletonResults() {
  return (
    <div className="skeletonWrap">
      <div className="skLine w60" />
      <div className="skLine w90" />
      <div className="skLine w80" />
      <div className="skCard" />
      <div className="skCard" />
      <div className="skCard" />
    </div>
  );
}
