export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 900 700"
      width="100%"
      height="100%"
      style={{ borderRadius: "26px" }}
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient id="g2" x1="0" x2="1">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.95" />
        </linearGradient>

        <filter id="blur">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      {/* Outer background */}
      <rect width="900" height="700" rx="40" fill="rgba(13,20,38,0.86)" />

      {/* Subtle glows (reduced opacity) */}
      <circle
        cx="160"
        cy="140"
        r="160"
        fill="url(#g1)"
        filter="url(#blur)"
        opacity="0.18"
      />
      <circle
        cx="760"
        cy="590"
        r="200"
        fill="url(#g1)"
        filter="url(#blur)"
        opacity="0.14"
      />

      {/* Main dashboard container */}
      <rect
        x="105"
        y="120"
        width="690"
        height="460"
        rx="30"
        fill="rgba(0,0,0,0.30)"
        stroke="rgba(255,255,255,0.10)"
      />

      {/* Top bar */}
      <rect
        x="135"
        y="150"
        width="630"
        height="60"
        rx="18"
        fill="rgba(255,255,255,0.045)"
        stroke="rgba(255,255,255,0.06)"
      />
      <circle cx="165" cy="180" r="9" fill="rgba(255,255,255,0.18)" />
      <circle cx="195" cy="180" r="9" fill="rgba(255,255,255,0.14)" />
      <circle cx="225" cy="180" r="9" fill="rgba(255,255,255,0.10)" />

      {/* Title */}
      <text x="270" y="186" fill="rgba(255,255,255,0.82)" fontSize="15">
        Fraud Shield — Risk Report
      </text>

      {/* Risk Score */}
      <text x="145" y="265" fill="rgba(255,255,255,0.62)" fontSize="16">
        Risk Score
      </text>
      <text
        x="695"
        y="265"
        fill="#EF4444"
        fontSize="22"
        fontWeight="800"
      >
        82%
      </text>

      {/* Risk bar */}
      <rect
        x="145"
        y="285"
        width="610"
        height="14"
        rx="999"
        fill="rgba(255,255,255,0.09)"
      />
      <rect x="145" y="285" width="500" height="14" rx="999" fill="url(#g2)" />

      {/* Evidence chips */}
      {[
        "Urgency language",
        "Credential request intent",
        "Suspicious domain",
        "AI writing patterns",
      ].map((t, i) => (
        <g key={i}>
          <rect
            x={145 + (i % 2) * 320}
            y={335 + Math.floor(i / 2) * 70}
            width="295"
            height="46"
            rx="999"
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.09)"
          />
          <text
            x={172 + (i % 2) * 320}
            y={365 + Math.floor(i / 2) * 70}
            fill="rgba(255,255,255,0.78)"
            fontSize="14"
          >
            ⚠ {t}
          </text>
        </g>
      ))}

      {/* Mini logs preview */}
      <rect
        x="145"
        y="495"
        width="610"
        height="62"
        rx="18"
        fill="rgba(255,255,255,0.035)"
        stroke="rgba(255,255,255,0.07)"
      />
      <text x="170" y="525" fill="rgba(255,255,255,0.65)" fontSize="13">
        Logs: 24 detections • 6 high risk • 12 medium • 6 low
      </text>
      <text x="170" y="548" fill="rgba(255,255,255,0.45)" fontSize="12">
        Last scan: 14 seconds ago • Model: Local Transformer + MFCC
      </text>
    </svg>
  );
}
