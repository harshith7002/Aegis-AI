import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScrollText,
  Filter,
  RefreshCcw,
  ShieldAlert,
  Mail,
  Link2,
  Mic,
  Search,
  Download,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

import Card from "../components/card";
import "../styles/layout.css";

const API = "http://127.0.0.1:8000";

const MOCK = [
  {
    id: "1",
    type: "text",
    label: "Phishing",
    score: 82,
    tier: "HIGH",
    time: "Today • 14:02",
    summary: "Urgency language + suspicious URL + credential request",
  },
  {
    id: "2",
    type: "url",
    label: "Spoofing",
    score: 67,
    tier: "MEDIUM",
    time: "Today • 13:41",
    summary: "Typosquat domain + http protocol",
  },
  {
    id: "3",
    type: "voice",
    label: "Deepfake",
    score: 28,
    tier: "LOW",
    time: "Today • 12:18",
    summary: "No strong MFCC anomalies detected",
  },
];

function iconForType(t) {
  if (t === "text") return <Mail size={16} />;
  if (t === "url") return <Link2 size={16} />;
  return <Mic size={16} />;
}

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filterTier, setFilterTier] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [query, setQuery] = useState("");

  const [autoRefresh, setAutoRefresh] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`${API}/logs`);
      const data = await r.json();
      setLogs(Array.isArray(data) ? data : MOCK);
    } catch {
      setLogs(MOCK);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // Auto refresh every 6s (optional)
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(load, 6000);
    return () => clearInterval(id);
  }, [autoRefresh]);

  function exportLogs() {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], {
      type: "application/json",
    });
    const link = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = link;
    a.download = "sentinelai_audit_logs.json";
    a.click();
    URL.revokeObjectURL(link);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return logs.filter((l) => {
      const okTier = filterTier === "ALL" ? true : l.tier === filterTier;
      const okType = filterType === "ALL" ? true : l.type === filterType;

      const okQuery =
        !q ||
        l.label?.toLowerCase().includes(q) ||
        l.summary?.toLowerCase().includes(q) ||
        l.type?.toLowerCase().includes(q) ||
        l.tier?.toLowerCase().includes(q);

      return okTier && okType && okQuery;
    });
  }, [logs, filterTier, filterType, query]);

  return (
    <div className="page">
      <div className="tool-header">
        <h2>
          <ScrollText size={22} style={{ marginRight: 8 }} />
          Audit Logs
        </h2>
        <p>
          Review detection history across Text, URL, and Voice modules. Designed
          for compliance and analyst workflows.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card
          title="Detection Timeline"
          subtitle="Filter by tier, module, and keywords. Export for audit review."
          right={
            <div className="logsRightActions">
              <button
                className="btn ghost"
                onClick={() => setAutoRefresh((v) => !v)}
                title="Auto refresh"
              >
                {autoRefresh ? (
                  <>
                    <ToggleRight size={18} /> Auto
                  </>
                ) : (
                  <>
                    <ToggleLeft size={18} /> Auto
                  </>
                )}
              </button>

              <button
                className="btn ghost"
                onClick={exportLogs}
                disabled={filtered.length === 0}
              >
                <Download size={16} /> Export
              </button>

              <button className="btn ghost" onClick={load} disabled={loading}>
                <RefreshCcw size={16} /> {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          }
        >
          {/* Filters */}
          <div className="filtersRow">
            <div className="filterPill">
              <Filter size={16} />
              <span className="muted">Tier</span>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div className="filterPill">
              <Filter size={16} />
              <span className="muted">Module</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="text">Text</option>
                <option value="url">URL</option>
                <option value="voice">Voice</option>
              </select>
            </div>

            <div className="searchPill">
              <Search size={16} />
              <input
                placeholder="Search label, summary, tier..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="statsPill">
              <ShieldAlert size={16} />
              <b>{filtered.length}</b>
              <span className="muted">events</span>
            </div>
          </div>

          {/* Table */}
          <div className="logsTable">
            <div className="logsHead">
              <span>Event</span>
              <span>Type</span>
              <span>Risk</span>
              <span>Time</span>
            </div>

            {loading ? (
              <LogsSkeleton />
            ) : filtered.length === 0 ? (
              <div className="emptyState" style={{ marginTop: 16 }}>
                <ShieldAlert size={42} />
                <h3>No logs found</h3>
                <p className="muted">
                  Try changing filters or run a scan in any module.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {filtered.map((l) => (
                  <motion.div
                    key={l.id}
                    className="logsRow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="logsEvent">
                      <span className="typeIcon">{iconForType(l.type)}</span>
                      <div>
                        <b>{l.label}</b>
                        <div className="muted">{l.summary}</div>
                      </div>
                    </div>

                    <span className="muted">{l.type.toUpperCase()}</span>

                    <span className={`tier ${l.tier.toLowerCase()}`}>
                      {l.score}% • {l.tier}
                    </span>

                    <span className="muted">{l.time}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

/* ---------- Skeleton ---------- */
function LogsSkeleton() {
  return (
    <div style={{ marginTop: 10 }}>
      <div className="skCard" />
      <div className="skCard" />
      <div className="skCard" />
      <div className="skCard" />
    </div>
  );
}
