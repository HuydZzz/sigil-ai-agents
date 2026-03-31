import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════
// SIGIL — AI Agent Hub on Initia
// Hackathon: INITIATE Season 1
// Track: AI | Revenue Model: Per-agent transaction fees
// ═══════════════════════════════════════════════════════════

// ── SVG Logo Components (4 logos from brand kit) ──────────

const NexusLogo = ({ size = 40, color = "#E8DCC8" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <rect x="18" y="18" width="64" height="64" rx="2" stroke={color} strokeWidth="2.5" transform="rotate(45 50 50)" />
    <rect x="26" y="26" width="48" height="48" rx="1" stroke={color} strokeWidth="2" transform="rotate(45 50 50)" />
    <circle cx="50" cy="50" r="10" stroke={color} strokeWidth="2.5" fill="none" />
    <circle cx="50" cy="50" r="4" fill={color} />
  </svg>
);

const ArchitectLogo = ({ size = 36, color = "#7BDDBB" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {[0, 1, 2, 3].map((i) => (
      <polygon key={i} points="50,10 93,35 93,65 50,90 7,65 7,35" fill="none" stroke={color}
        strokeWidth="2" transform={`scale(${1 - i * 0.2}) translate(${i * 12.5} ${i * 12.5})`} />
    ))}
    <path d="M50 55 L50 35 L42 48 Z" fill={color} opacity="0.6" />
  </svg>
);

const OracleLogo = ({ size = 36, color = "#F0C866" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {[0, 1, 2, 3].map((i) => (
      <ellipse key={i} cx={50 - i * 6} cy={50 + i * 4} rx={38 - i * 8} ry={38 - i * 6}
        stroke={color} strokeWidth="2.2" fill="none" />
    ))}
    <circle cx="30" cy="62" r="6" fill={color} />
  </svg>
);

const SentinelLogo = ({ size = 36, color = "#E87B5B" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="32" stroke={color} strokeWidth="2.2" />
    <circle cx="50" cy="50" r="18" stroke={color} strokeWidth="2" />
    <line x1="50" y1="12" x2="50" y2="88" stroke={color} strokeWidth="2" />
    <line x1="12" y1="50" x2="88" y2="50" stroke={color} strokeWidth="2" />
  </svg>
);

// ── Mock Data ─────────────────────────────────────────────

const AGENTS = [
  {
    id: 1, name: "Yield Weaver", type: "architect", creator: "satoshi.init",
    desc: "Auto-compounds yield across Initia DeFi pools. Rebalances every 4h based on APY shifts.",
    apy: "18.4", users: 847, txns: "12.3K", fee: "0.5%", status: "live",
    pnl: [2.1, 3.4, 1.8, 4.2, 3.9, 5.1, 4.7, 6.3, 5.8, 7.2, 6.9, 8.1]
  },
  {
    id: 2, name: "Trend Prophet", type: "oracle", creator: "alice.init",
    desc: "Analyzes on-chain + social sentiment to predict price movements with 72% accuracy.",
    apy: "—", users: 1203, txns: "8.7K", fee: "1%", status: "live",
    pnl: [1.0, 1.5, 2.1, 1.8, 3.2, 2.9, 4.1, 3.7, 4.8, 5.2, 4.9, 5.6]
  },
  {
    id: 3, name: "Shield Protocol", type: "sentinel", creator: "vitalik.init",
    desc: "Monitors your portfolio 24/7. Auto-hedges on whale movements and liquidation risks.",
    apy: "—", users: 634, txns: "5.1K", fee: "0.8%", status: "live",
    pnl: [0.5, 0.8, 1.2, 0.9, 1.5, 1.8, 2.1, 1.7, 2.4, 2.8, 3.1, 2.9]
  },
  {
    id: 4, name: "Momentum Alpha", type: "architect", creator: "whale.init",
    desc: "Trades momentum breakouts on INIT pairs. Uses ML pattern recognition for entry signals.",
    apy: "24.1", users: 412, txns: "19.8K", fee: "1.5%", status: "live",
    pnl: [3.2, 5.1, 4.3, 7.8, 6.2, 9.1, 8.4, 11.2, 10.1, 13.4, 12.8, 14.2]
  },
  {
    id: 5, name: "Sentiment Radar", type: "oracle", creator: "data.init",
    desc: "Scans X, Discord, and on-chain data to surface emerging narratives before they trend.",
    apy: "—", users: 956, txns: "3.2K", fee: "0.3%", status: "live",
    pnl: [0.8, 1.2, 1.9, 2.4, 3.1, 2.8, 3.9, 4.2, 4.8, 5.1, 5.7, 6.2]
  },
  {
    id: 6, name: "Liquidation Guard", type: "sentinel", creator: "safe.init",
    desc: "Watches lending positions across Initia rollups. Auto-repays before liquidation hits.",
    apy: "—", users: 289, txns: "1.8K", fee: "0.2%", status: "beta",
    pnl: [0.2, 0.4, 0.7, 1.0, 1.3, 1.5, 1.8, 2.1, 2.4, 2.7, 3.0, 3.2]
  },
];

const STATS = [
  { label: "Total agents", value: "127", delta: "+12 this week" },
  { label: "Active users", value: "4,331", delta: "+18% MoM" },
  { label: "Transactions", value: "50.9K", delta: "Last 30d" },
  { label: "Revenue captured", value: "$23.4K", delta: "Via gas fees" },
];

const typeConfig = {
  architect: { label: "ARCHITECT", color: "#7BDDBB", bg: "rgba(123,221,187,0.08)", Logo: ArchitectLogo },
  oracle: { label: "ORACLE", color: "#F0C866", bg: "rgba(240,200,102,0.08)", Logo: OracleLogo },
  sentinel: { label: "SENTINEL", color: "#E87B5B", bg: "rgba(232,123,91,0.08)", Logo: SentinelLogo },
};

// ── Sparkline Component ───────────────────────────────────

const Sparkline = ({ data, color, width = 120, height = 32 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) =>
    `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`
  ).join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * width} cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
        r="2.5" fill={color} />
    </svg>
  );
};

// ── Animated Counter ──────────────────────────────────────

const AnimCounter = ({ value, delay = 0 }) => {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    const timer = setTimeout(() => {
      const num = parseFloat(value.replace(/[^0-9.]/g, ""));
      if (isNaN(num)) { setDisplay(value); return; }
      const prefix = value.match(/^[^0-9]*/)?.[0] || "";
      const suffix = value.match(/[^0-9.]*$/)?.[0] || "";
      const hasComma = value.includes(",");
      let frame = 0;
      const total = 30;
      const interval = setInterval(() => {
        frame++;
        const progress = 1 - Math.pow(1 - frame / total, 3);
        const current = num * progress;
        let formatted = hasComma ? Math.round(current).toLocaleString() : current < 100 ? current.toFixed(1) : Math.round(current).toString();
        setDisplay(`${prefix}${formatted}${suffix}`);
        if (frame >= total) clearInterval(interval);
      }, 25);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return <span>{display}</span>;
};

// ── Main App ──────────────────────────────────────────────

export default function SigilMarketplace() {
  const [filter, setFilter] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [bridgeOpen, setBridgeOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const scrollRef = useRef(null);

  const filtered = filter === "all" ? AGENTS : AGENTS.filter(a => a.type === filter);

  const toast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleConnect = () => {
    setConnected(true);
    toast("Connected via InterwovenKit");
  };

  const handleAutoSign = () => {
    setSessionActive(!sessionActive);
    toast(sessionActive ? "Auto-sign session ended" : "Auto-sign session active — agents can execute txns");
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0A0B0D", color: "#E8DCC8",
      fontFamily: "'DM Sans', 'Satoshi', sans-serif", overflow: "hidden",
      position: "relative",
    }}>
      {/* Noise texture overlay */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.03, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* Geometric grid background */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.04, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(232,220,200,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(232,220,200,0.3) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* ─── NAV ─── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px", borderBottom: "1px solid rgba(232,220,200,0.08)",
        backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,11,13,0.85)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <NexusLogo size={32} />
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            SIGIL
          </span>
          <span style={{
            fontSize: 10, padding: "2px 8px", borderRadius: 4,
            background: "rgba(123,221,187,0.15)", color: "#7BDDBB",
            fontWeight: 600, letterSpacing: "0.08em",
          }}>ON INITIA</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {connected && (
            <button onClick={handleAutoSign} style={{
              background: sessionActive ? "rgba(123,221,187,0.15)" : "rgba(232,220,200,0.06)",
              border: `1px solid ${sessionActive ? "rgba(123,221,187,0.4)" : "rgba(232,220,200,0.12)"}`,
              color: sessionActive ? "#7BDDBB" : "#E8DCC8", borderRadius: 8,
              padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 500,
              display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: sessionActive ? "#7BDDBB" : "#666",
                boxShadow: sessionActive ? "0 0 8px #7BDDBB" : "none",
              }} />
              {sessionActive ? "Session active" : "Auto-sign"}
            </button>
          )}
          <button onClick={() => setBridgeOpen(true)} style={{
            background: "rgba(232,220,200,0.06)", border: "1px solid rgba(232,220,200,0.12)",
            color: "#E8DCC8", borderRadius: 8, padding: "8px 16px",
            cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.2s",
          }}>
            Bridge
          </button>
          <button onClick={handleConnect} style={{
            background: connected ? "rgba(123,221,187,0.12)" : "linear-gradient(135deg, #7BDDBB 0%, #5BC4A0 100%)",
            border: "none", color: connected ? "#7BDDBB" : "#0A0B0D",
            borderRadius: 8, padding: "8px 20px", cursor: "pointer",
            fontSize: 13, fontWeight: 600, transition: "all 0.2s",
            ...(connected ? { border: "1px solid rgba(123,221,187,0.3)" } : {}),
          }}>
            {connected ? "demo.init" : "Connect wallet"}
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{
        padding: "64px 32px 48px", textAlign: "center", position: "relative",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 400, height: 400, borderRadius: "50%", opacity: 0.06,
          background: "radial-gradient(circle, #7BDDBB 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 32, opacity: 0.5 }}>
          <ArchitectLogo size={28} color="#7BDDBB" />
          <OracleLogo size={28} color="#F0C866" />
          <SentinelLogo size={28} color="#E87B5B" />
          <NexusLogo size={28} color="#E8DCC8" />
        </div>
        <h1 style={{
          fontSize: 48, fontWeight: 800, margin: "0 0 16px", letterSpacing: "-0.02em",
          lineHeight: 1.1,
          background: "linear-gradient(135deg, #E8DCC8 30%, #7BDDBB 70%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          AI agents that trade,<br />predict & protect
        </h1>
        <p style={{
          fontSize: 17, color: "rgba(232,220,200,0.55)", maxWidth: 520,
          margin: "0 auto 36px", lineHeight: 1.6,
        }}>
          Deploy, rent, and compose autonomous AI agents on your own Initia appchain.
          Every transaction is revenue you keep.
        </p>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12,
          maxWidth: 680, margin: "0 auto",
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              background: "rgba(232,220,200,0.03)", border: "1px solid rgba(232,220,200,0.08)",
              borderRadius: 12, padding: "20px 16px", textAlign: "left",
            }}>
              <div style={{ fontSize: 11, color: "rgba(232,220,200,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
                <AnimCounter value={s.value} delay={i * 150} />
              </div>
              <div style={{ fontSize: 11, color: "rgba(123,221,187,0.7)" }}>{s.delta}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FILTER TABS ─── */}
      <section style={{ padding: "0 32px 24px" }}>
        <div style={{
          display: "flex", gap: 8, borderBottom: "1px solid rgba(232,220,200,0.08)",
          paddingBottom: 16,
        }}>
          {[
            { key: "all", label: "All agents", icon: null },
            { key: "architect", label: "Architect", icon: <ArchitectLogo size={16} color="#7BDDBB" /> },
            { key: "oracle", label: "Oracle", icon: <OracleLogo size={16} color="#F0C866" /> },
            { key: "sentinel", label: "Sentinel", icon: <SentinelLogo size={16} color="#E87B5B" /> },
          ].map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: filter === tab.key ? "rgba(232,220,200,0.08)" : "transparent",
              border: `1px solid ${filter === tab.key ? "rgba(232,220,200,0.15)" : "transparent"}`,
              color: filter === tab.key ? "#E8DCC8" : "rgba(232,220,200,0.4)",
              borderRadius: 8, padding: "8px 16px", cursor: "pointer",
              fontSize: 13, fontWeight: 500, transition: "all 0.2s",
            }}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* ─── AGENT GRID ─── */}
      <section style={{ padding: "0 32px 48px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}>
          {filtered.map((agent, idx) => {
            const cfg = typeConfig[agent.type];
            return (
              <div key={agent.id} onClick={() => setSelectedAgent(agent)} style={{
                background: "rgba(232,220,200,0.02)",
                border: "1px solid rgba(232,220,200,0.08)",
                borderRadius: 16, padding: 24, cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
                animation: `fadeInUp 0.5s ease ${idx * 80}ms both`,
                position: "relative", overflow: "hidden",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${cfg.color}40`;
                e.currentTarget.style.background = cfg.bg;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(232,220,200,0.08)";
                e.currentTarget.style.background = "rgba(232,220,200,0.02)";
                e.currentTarget.style.transform = "translateY(0)";
              }}>
                {/* Type badge */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginBottom: 16,
                }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <cfg.Logo size={24} color={cfg.color} />
                    <span style={{
                      fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
                      color: cfg.color, textTransform: "uppercase",
                    }}>{cfg.label}</span>
                  </div>
                  <span style={{
                    fontSize: 10, padding: "3px 10px", borderRadius: 20,
                    background: agent.status === "live" ? "rgba(123,221,187,0.12)" : "rgba(240,200,102,0.12)",
                    color: agent.status === "live" ? "#7BDDBB" : "#F0C866",
                    fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em",
                  }}>{agent.status}</span>
                </div>

                {/* Name + creator */}
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>{agent.name}</h3>
                <div style={{ fontSize: 12, color: "rgba(232,220,200,0.4)", marginBottom: 12 }}>
                  by <span style={{ color: cfg.color }}>{agent.creator}</span>
                </div>

                {/* Description */}
                <p style={{
                  fontSize: 13, color: "rgba(232,220,200,0.5)", lineHeight: 1.5,
                  margin: "0 0 16px",
                }}>{agent.desc}</p>

                {/* Sparkline */}
                <div style={{ marginBottom: 16 }}>
                  <Sparkline data={agent.pnl} color={cfg.color} width={280} height={36} />
                </div>

                {/* Stats row */}
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8,
                  borderTop: "1px solid rgba(232,220,200,0.06)", paddingTop: 12,
                }}>
                  {[
                    { label: "APY", value: agent.apy === "—" ? "—" : `${agent.apy}%` },
                    { label: "Users", value: agent.users.toLocaleString() },
                    { label: "Txns", value: agent.txns },
                    { label: "Fee", value: agent.fee },
                  ].map((stat, si) => (
                    <div key={si} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "rgba(232,220,200,0.3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {stat.label}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── INITIA INTEGRATION SECTION ─── */}
      <section style={{
        padding: "48px 32px", borderTop: "1px solid rgba(232,220,200,0.06)",
        background: "rgba(232,220,200,0.01)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px" }}>
            Powered by Initia
          </h2>
          <p style={{ fontSize: 14, color: "rgba(232,220,200,0.45)" }}>
            Three native features that make SIGIL possible
          </p>
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
          maxWidth: 800, margin: "0 auto",
        }}>
          {[
            {
              title: "Auto-signing sessions",
              desc: "Agents execute transactions without per-txn approval. Enable once, let AI work 24/7.",
              color: "#7BDDBB", tag: "SESSION UX",
            },
            {
              title: "Interwoven Bridge",
              desc: "Users deposit from any chain — ETH, Cosmos, rollups. No manual bridging needed.",
              color: "#F0C866", tag: "CROSS-CHAIN",
            },
            {
              title: ".init usernames",
              desc: "Social identity for agent creators. Leaderboards, reputation, and agent attribution.",
              color: "#E87B5B", tag: "IDENTITY",
            },
          ].map((feature, i) => (
            <div key={i} style={{
              background: "rgba(232,220,200,0.02)",
              border: "1px solid rgba(232,220,200,0.08)",
              borderRadius: 16, padding: 24,
              borderTop: `2px solid ${feature.color}30`,
            }}>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
                color: feature.color, display: "block", marginBottom: 12,
              }}>{feature.tag}</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>{feature.title}</h3>
              <p style={{ fontSize: 13, color: "rgba(232,220,200,0.45)", lineHeight: 1.5, margin: 0 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── REVENUE MODEL SECTION ─── */}
      <section style={{
        padding: "48px 32px", borderTop: "1px solid rgba(232,220,200,0.06)",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>
            Revenue model
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { icon: "⟡", label: "Gas fees", value: "Every agent txn", sub: "100% retained by appchain" },
              { icon: "◈", label: "Agent subscriptions", value: "0.5-2% AUM/mo", sub: "Premium agent access" },
              { icon: "◎", label: "Creation fees", value: "50 INIT", sub: "To publish an agent" },
            ].map((r, i) => (
              <div key={i} style={{
                background: "rgba(123,221,187,0.04)",
                border: "1px solid rgba(123,221,187,0.1)",
                borderRadius: 12, padding: 20, textAlign: "center",
              }}>
                <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.6 }}>{r.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{r.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#7BDDBB", marginBottom: 4 }}>{r.value}</div>
                <div style={{ fontSize: 11, color: "rgba(232,220,200,0.4)" }}>{r.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AGENT DETAIL MODAL ─── */}
      {selectedAgent && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 200, padding: 32,
        }} onClick={() => setSelectedAgent(null)}>
          <div style={{
            background: "#12131A", border: "1px solid rgba(232,220,200,0.1)",
            borderRadius: 20, padding: 32, maxWidth: 520, width: "100%",
            position: "relative",
          }} onClick={e => e.stopPropagation()}>
            {(() => {
              const cfg = typeConfig[selectedAgent.type];
              return (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <cfg.Logo size={32} color={cfg.color} />
                    <div>
                      <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{selectedAgent.name}</h2>
                      <span style={{ fontSize: 12, color: cfg.color }}>{selectedAgent.creator}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: "rgba(232,220,200,0.55)", lineHeight: 1.6, marginBottom: 24 }}>
                    {selectedAgent.desc}
                  </p>
                  <Sparkline data={selectedAgent.pnl} color={cfg.color} width={456} height={60} />
                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12,
                    margin: "24px 0", padding: "16px 0",
                    borderTop: "1px solid rgba(232,220,200,0.08)",
                    borderBottom: "1px solid rgba(232,220,200,0.08)",
                  }}>
                    {[
                      { label: "APY", value: selectedAgent.apy === "—" ? "—" : `${selectedAgent.apy}%` },
                      { label: "Users", value: selectedAgent.users.toLocaleString() },
                      { label: "Transactions", value: selectedAgent.txns },
                      { label: "Fee", value: selectedAgent.fee },
                    ].map((stat, i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: "rgba(232,220,200,0.35)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          {stat.label}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={() => {
                      if (!connected) { toast("Connect wallet first"); return; }
                      if (!sessionActive) { toast("Enable auto-sign session first"); return; }
                      toast(`Subscribed to ${selectedAgent.name}! Agent is now active.`);
                      setSelectedAgent(null);
                    }} style={{
                      flex: 1, padding: "14px 20px", borderRadius: 12, border: "none",
                      background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}CC)`,
                      color: "#0A0B0D", fontSize: 14, fontWeight: 700, cursor: "pointer",
                      transition: "transform 0.15s",
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
                    onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
                      Activate agent
                    </button>
                    <button onClick={() => setSelectedAgent(null)} style={{
                      padding: "14px 20px", borderRadius: 12,
                      background: "rgba(232,220,200,0.06)",
                      border: "1px solid rgba(232,220,200,0.12)",
                      color: "#E8DCC8", fontSize: 14, fontWeight: 500, cursor: "pointer",
                    }}>
                      Close
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ─── BRIDGE MODAL ─── */}
      {bridgeOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 200, padding: 32,
        }} onClick={() => setBridgeOpen(false)}>
          <div style={{
            background: "#12131A", border: "1px solid rgba(232,220,200,0.1)",
            borderRadius: 20, padding: 32, maxWidth: 420, width: "100%",
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>
              Interwoven Bridge
            </h2>
            <p style={{ fontSize: 13, color: "rgba(232,220,200,0.45)", marginBottom: 24 }}>
              Deposit from any chain to fund your agents
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: "rgba(232,220,200,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                From chain
              </label>
              <select style={{
                width: "100%", marginTop: 6, padding: "12px 16px", borderRadius: 10,
                background: "rgba(232,220,200,0.04)", border: "1px solid rgba(232,220,200,0.1)",
                color: "#E8DCC8", fontSize: 14, appearance: "none", cursor: "pointer",
              }}>
                <option>Ethereum Mainnet</option>
                <option>Cosmos Hub</option>
                <option>Initia L1</option>
                <option>Arbitrum</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: "rgba(232,220,200,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Asset
              </label>
              <select style={{
                width: "100%", marginTop: 6, padding: "12px 16px", borderRadius: 10,
                background: "rgba(232,220,200,0.04)", border: "1px solid rgba(232,220,200,0.1)",
                color: "#E8DCC8", fontSize: 14, appearance: "none", cursor: "pointer",
              }}>
                <option>USDC</option>
                <option>INIT</option>
                <option>ETH</option>
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 11, color: "rgba(232,220,200,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Amount
              </label>
              <input type="number" placeholder="0.00" style={{
                width: "100%", marginTop: 6, padding: "12px 16px", borderRadius: 10,
                background: "rgba(232,220,200,0.04)", border: "1px solid rgba(232,220,200,0.1)",
                color: "#E8DCC8", fontSize: 18, fontWeight: 600, outline: "none",
                boxSizing: "border-box",
              }} />
            </div>

            <button onClick={() => {
              toast("Bridge deposit initiated via Interwoven Bridge");
              setBridgeOpen(false);
            }} style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #F0C866, #E8B84D)",
              color: "#0A0B0D", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>
              Bridge to SIGIL chain
            </button>
          </div>
        </div>
      )}

      {/* ─── TOAST ─── */}
      {showToast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "#1A1B22", border: "1px solid rgba(123,221,187,0.2)",
          borderRadius: 12, padding: "12px 24px", zIndex: 300,
          display: "flex", alignItems: "center", gap: 8,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          animation: "fadeInUp 0.3s ease",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#7BDDBB", boxShadow: "0 0 6px #7BDDBB",
          }} />
          <span style={{ fontSize: 13, fontWeight: 500 }}>{toastMsg}</span>
        </div>
      )}

      {/* ─── FOOTER ─── */}
      <footer style={{
        padding: "32px", borderTop: "1px solid rgba(232,220,200,0.06)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <NexusLogo size={20} />
          <span style={{ fontSize: 12, color: "rgba(232,220,200,0.3)" }}>
            SIGIL — Built on Initia for INITIATE Hackathon S1
          </span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {["Docs", "GitHub", "Discord"].map(l => (
            <span key={l} style={{ fontSize: 12, color: "rgba(232,220,200,0.3)", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        button:hover { opacity: 0.9; }
        select:focus, input:focus { border-color: rgba(123,221,187,0.3) !important; outline: none; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(232,220,200,0.1); border-radius: 3px; }
        * { box-sizing: border-box; margin: 0; }
      `}</style>
    </div>
  );
}
