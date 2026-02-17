import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navWrap">
      <div className="navInner">
        {/* Brand */}
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <div className="brandIcon">
            <Shield size={20} />
          </div>
          <div className="brandText">
            <h1>Aegis AI</h1>
            <p>GenAI Scam Detection Platform</p>
          </div>
        </Link>

        {/* Desktop links */}
        <nav className="navLinks">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/text">Text</NavLink>
          <NavLink to="/url">URL</NavLink>
          <NavLink to="/voice">Voice</NavLink>
          <NavLink to="/logs">Logs</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        {/* Right side */}
        <div className="navRight">
          <Link to="/text" className="navCTA">
            Launch Scanner <ArrowRight size={16} />
          </Link>

          {/* Mobile toggle */}
          <button className="menuBtn" onClick={() => setOpen((s) => !s)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobileMenu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            <NavLink to="/" onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/text" onClick={() => setOpen(false)}>
              Text Detection
            </NavLink>
            <NavLink to="/url" onClick={() => setOpen(false)}>
              URL Detection
            </NavLink>
            <NavLink to="/voice" onClick={() => setOpen(false)}>
              Voice Detection
            </NavLink>
            <NavLink to="/logs" onClick={() => setOpen(false)}>
              Logs
            </NavLink>
            <NavLink to="/about" onClick={() => setOpen(false)}>
              About
            </NavLink>

            <Link
              to="/text"
              className="mobileCTA"
              onClick={() => setOpen(false)}
            >
              Launch Scanner <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
