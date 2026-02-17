import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield,
  Mail,
  Link2,
  Mic,
  ScrollText,
  Sparkles,
  Lock,
  Eye,
  ArrowRight,
} from "lucide-react";

import HeroIllustration from "../components/heroIllustration";
import "../styles/layout.css";

export default function Home() {
  return (
    <div className="page">
      {/* HERO */}
      <div className="heroGrid">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="badge">
            <Shield size={16} /> Barclays Hackathon Prototype
          </span>

          <h1 className="heroTitle">
            Stop GenAI Scams <span className="grad">Before They Hit</span>
          </h1>

          <p className="heroDesc">
            Fraud Shield detects AI-generated phishing, credential exposure, spoofed URLs,
            and deepfake voice scams — with risk scoring and human-readable explanations.
          </p>

          <div className="ctaRow">
            <Link className="btn" to="/text">
              Start Detecting <ArrowRight size={18} />
            </Link>

            <Link className="btn ghost" to="/about">
              Learn More
            </Link>
          </div>

          {/* Trust Row */}
          <div className="trustRow">
            <span>
              <Lock size={16} /> Offline-first
            </span>
            <span>
              <Eye size={16} /> Explainable
            </span>
            <span>
              <Sparkles size={16} /> GenAI-aware
            </span>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55 }}
          className="previewCard"
        >
          <HeroIllustration />
        </motion.div>
      </div>

      {/* FEATURES */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="section"
      >
        <h2 className="sectionTitle">Why this matters for banks</h2>
        <p className="muted">
          GenAI makes scams faster, more convincing, and harder to detect.
          Fraud Shield provides a multi-layer detection system.
        </p>

        <div className="featureGrid">
          <Feature
            icon={<Mail size={18} />}
            title="AI Phishing Detection"
            text="Detects phishing, social engineering, and manipulation language."
          />
          <Feature
            icon={<Lock size={18} />}
            title="Credential Exposure"
            text="Finds leaked passwords, tokens, OTPs, and sensitive identifiers."
          />
          <Feature
            icon={<Link2 size={18} />}
            title="URL Spoofing Checks"
            text="Flags suspicious domains, typosquatting, and phishing structures."
          />
          <Feature
            icon={<Mic size={18} />}
            title="Deepfake Voice Signals"
            text="MFCC-based pipeline for synthetic voice probability."
          />
        </div>
      </motion.div>

      {/* MODULES STRIP */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="modulesStrip"
      >
        <div className="modulePill">
          <Mail size={16} /> Text Fraud
        </div>
        <div className="modulePill">
          <Link2 size={16} /> URL Spoofing
        </div>
        <div className="modulePill">
          <Mic size={16} /> Voice Deepfake
        </div>
        <div className="modulePill">
          <ScrollText size={16} /> Logs & Audit
        </div>
      </motion.div>

      {/* CTA BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="ctaBanner"
      >
        <div>
          <h2>Ready to test a scam?</h2>
          <p className="muted">
            Try the built-in demo samples and see risk scoring instantly.
          </p>
        </div>

        <Link className="btn" to="/text">
          Launch Scanner <ArrowRight size={18} />
        </Link>
      </motion.div>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="featureCard"
    >
      <div className="featureIcon">{icon}</div>
      <h3>{title}</h3>
      <p className="muted">{text}</p>
    </motion.div>
  );
}
