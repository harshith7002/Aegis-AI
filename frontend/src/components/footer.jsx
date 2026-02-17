import { Github, ShieldCheck } from "lucide-react";
import "../styles/layout.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h3>
            <ShieldCheck size={18} /> Fraud Shield
          </h3>
          <p>
            Built for Barclays Hackathon — Detecting GenAI fraud across text, URLs,
            and voice.
          </p>
        </div>

        <div className="footer-right">
          
          <span className="muted">© 2026 Aegis AI</span>
        </div>
      </div>
    </footer>
  );
}
