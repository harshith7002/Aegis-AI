import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Sparkles,
  ShieldAlert,
  KeyRound,
  Copy,
  ArrowRight,
  RefreshCcw,
  Download,
} from "lucide-react";

import RiskMeter from "../components/riskmeter";
import Card from "../components/card";
import "../styles/layout.css";

const API = "http://127.0.0.1:8000";

const DEMOS = [
  {
    title: "Bank Phishing",
    text: `Dear Customer,\n\nYour Barclays account has been temporarily suspended due to unusual activity.\nPlease verify your details immediately to avoid permanent closure.\n\nVerify now: http://barclays-secure-verification.com/login\n\nRegards,\nSecurity Team`,
  },
  {
    title: "OTP Scam",
    text: `Hi, this is your bank.\nWe detected a suspicious transaction.\nPlease share the OTP you received to cancel it.\n\nURGENT: Respond within 5 minutes.`,
  },
  {
    title: "Credential Leak",
    text: `Hey team,\nHere are the credentials for the staging server:\n\nusername: admin\npassword: Admin@12345\n\nPlease don’t share externally.`,
  },
];

export default function TextPage() {
  const [text, setText] = useState("");
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    if (!text.trim()) return alert("Paste something first.");
    setLoading(true);
    setRes(null);

    try {
      const r = await fetch(`${API}/analyze/text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await r.json();
      setRes(data);
    } catch (e) {
      alert("Backend not running. Start FastAPI first.");
    }

    setLoading(false);
  }

  function reset() {
    setText("");
    setRes(null);
    setLoading(false);
  }

  function copyInput() {
    navigator.clipboard.writeText(text);
  }

  function exportJson() {
    if (!res) return;
    const blob = new Blob([JSON.stringify(res, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sentinelai_text_report.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const riskScore = res?.final_risk_score ?? 0;
  const topLabel = res?.fraud?.top_label ?? "—";
  const reasons = res?.reasons ?? [];
  const credFindings = res?.credentials?.findings ?? [];

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
          <Mail size={22} style={{ marginRight: 8 }} />
          Text / Email Fraud Detection
        </h2>
        <p>
          Detect phishing + credential harvesting + GenAI scam patterns with
          explainable risk scoring.
        </p>
      </div>

      <div className="grid2">
        {/* LEFT: INPUT */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Card
            title="Input"
            subtitle="Paste an email, SMS, or chat message."
            right={
              <span className="pill">
                <Sparkles size={14} /> GenAI-aware
              </span>
            }
          >
            <textarea
              className="bigText"
              placeholder="Paste email here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="demoRow">
              {DEMOS.map((d) => (
                <button
                  key={d.title}
                  className="chipBtn"
                  onClick={() => setText(d.text)}
                >
                  {d.title}
                </button>
              ))}
            </div>

            <div className="actionsRow">
              <button className="btn" onClick={analyze} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze"}
                <ArrowRight size={18} />
              </button>

              <button className="btn ghost" onClick={reset}>
                <RefreshCcw size={16} /> Reset
              </button>

              <button className="btn ghost" onClick={copyInput}>
                <Copy size={16} /> Copy
              </button>

              <button className="btn ghost" onClick={exportJson} disabled={!res}>
                <Download size={16} /> Export
              </button>
            </div>
          </Card>
        </motion.div>

        {/* RIGHT: RESULTS */}
        <motion.div
          className="resultsSticky"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <Card
            title="Detection Results"
            subtitle="Risk score + intent classification + evidence."
            right={
              res ? (
                <span className={`tier ${tier.toLowerCase()}`}>{tier}</span>
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
                  Run detection to view risk score, threat category, and
                  evidence.
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
                      <ShieldAlert size={16} />
                    </span>
                    Threat Category
                  </div>

                  <div className="rowBetween">
                    <span className="pill big">{topLabel}</span>
                    <span className="muted">
                      {riskScore}% risk • confidence {confidence}
                    </span>
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
                        No strong scam signals detected.
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
                      <KeyRound size={16} />
                    </span>
                    Credential Exposure
                  </div>

                  {credFindings.length === 0 ? (
                    <p className="muted">No exposed credentials detected.</p>
                  ) : (
                    <div className="chips">
                      {credFindings.map((f, i) => (
                        <span className="chip danger" key={i}>
                          {f.type} — {f.count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- Skeleton Loading UI ---------- */
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
