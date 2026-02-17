import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Sparkles,
  ScrollText,
  Layers,
  Cpu,
  ArrowRight,
  Radar,
  Network,
  BadgeCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import Card from "../components/card";
import "../styles/layout.css";

const PRODUCT = "SentinelAI"; // change if you picked another name

export default function About() {
  return (
    <div className="page">
      <div className="tool-header">
        <h2>
          <Shield size={22} style={{ marginRight: 8 }} />
          About {PRODUCT}
        </h2>
        <p>
          A multi-layer GenAI fraud detection suite designed for banking security
          teams. Offline-first, explainable, and ready for regulated workflows.
        </p>
      </div>

      <div className="aboutGrid">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Card title="What we built" subtitle="One platform, multiple defenses.">
            <ul className="aboutList">
              <li>
                <Sparkles size={16} />
                Detects <b>AI-generated phishing</b> emails and scam messages.
              </li>
              <li>
                <Lock size={16} />
                Detects <b>credential exposure</b> (passwords, tokens, OTPs,
                keys).
              </li>
              <li>
                <Layers size={16} />
                URL scanner for <b>spoofing / typosquatting</b> and phishing
                patterns.
              </li>
              <li>
                <Cpu size={16} />
                Voice deepfake scoring using <b>MFCC-based signals</b>.
              </li>
              <li>
                <ScrollText size={16} />
                Audit logs with risk tiers for <b>compliance workflows</b>.
              </li>
            </ul>

            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              <Link className="btn" to="/text">
                Launch Scanner <ArrowRight size={18} />
              </Link>

              <Link className="btn ghost" to="/logs">
                View Logs <ScrollText size={18} />
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <Card
            title="Privacy & Security"
            subtitle="Designed for regulated environments."
          >
            <div className="aboutBlocks">
              <div className="aboutMini">
                <h4>Offline-first</h4>
                <p className="muted">
                  All inference runs locally. No customer data leaves the
                  environment.
                </p>
              </div>

              <div className="aboutMini">
                <h4>Explainable</h4>
                <p className="muted">
                  Every score includes evidence signals and human-readable
                  reasons.
                </p>
              </div>

              <div className="aboutMini">
                <h4>Risk tiers</h4>
                <p className="muted">
                  Low/Medium/High scoring supports safe analyst workflows and
                  reduces false positives.
                </p>
              </div>

              <div className="aboutMini">
                <h4>Audit-ready</h4>
                <p className="muted">
                  Logs are stored locally with minimal metadata for compliance
                  and review.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* EXTRA SECTIONS */}
      <div className="aboutGrid" style={{ marginTop: 18 }}>
        {/* Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Card
            title="Architecture"
            subtitle="Multi-modal detection pipeline (offline)."
          >
            <div className="archGrid">
              <div className="archStep">
                <span className="iconCircle">
                  <Radar size={16} />
                </span>
                <div>
                  <b>Input</b>
                  <div className="muted">Text • URL • Voice</div>
                </div>
              </div>

              <div className="archStep">
                <span className="iconCircle">
                  <Network size={16} />
                </span>
                <div>
                  <b>Signals</b>
                  <div className="muted">
                    NLP intent • Heuristics • MFCC • Rules
                  </div>
                </div>
              </div>

              <div className="archStep">
                <span className="iconCircle">
                  <BadgeCheck size={16} />
                </span>
                <div>
                  <b>Output</b>
                  <div className="muted">
                    Risk score • Tier • Evidence • Recommendation
                  </div>
                </div>
              </div>
            </div>

            <p className="muted" style={{ marginTop: 14 }}>
              Each module produces an explainable score. Logs store only safe
              metadata (type, tier, score, reasons) to support compliance.
            </p>
          </Card>
        </motion.div>

        {/* Novelty */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <Card
            title="What makes this stand out"
            subtitle="Novelty beyond a basic phishing classifier."
          >
            <ul className="aboutList">
              <li>
                <Shield size={16} />
                <b>Multi-modal fraud suite</b> (Text + URL + Voice) in one
                workflow.
              </li>
              <li>
                <Lock size={16} />
                <b>Credential exposure detection</b> built directly into message
                scanning.
              </li>
              <li>
                <Sparkles size={16} />
                <b>Explainability-first</b>: every result includes evidence chips.
              </li>
              <li>
                <ScrollText size={16} />
                <b>Audit timeline</b> designed for SOC / fraud analyst use.
              </li>
              <li>
                <Layers size={16} />
                <b>Offline-ready deployment</b> aligned with banking security
                requirements.
              </li>
            </ul>

            <div className="ctaStrip">
              <div>
                <b>Try it now</b>
                <div className="muted">
                  Run a scan and see risk scoring + evidence instantly.
                </div>
              </div>

              <Link className="btn" to="/">
                Home <ArrowRight size={18} />
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
