import React, { useState } from "react";

type ModuleId =
  | "financial"
  | "security"
  | "healthSafety"
  | "environmental"
  | "energy"
  | "governance";

type ModuleInfo = {
  id: ModuleId;
  title: string;
  icon: string;
  frameworks: string[];
  color: string;
  description: string;
};

const moduleData: Record<ModuleId, { score: number; status: string; lastUpdate: string }> = {
  financial: { score: 88, status: "Compliant", lastUpdate: "2024-09-26" },
  security: { score: 92, status: "Certified", lastUpdate: "2024-09-25" },
  healthSafety: { score: 95, status: "Excellent", lastUpdate: "2024-09-26" },
  environmental: { score: 85, status: "Good", lastUpdate: "2024-09-26" },
  energy: { score: 90, status: "Optimized", lastUpdate: "2024-09-26" },
  governance: { score: 87, status: "Strong", lastUpdate: "2024-09-25" },
};

const modules: ModuleInfo[] = [
  {
    id: "financial",
    title: "Financial Reporting",
    icon: "📊",
    frameworks: ["IFRS S1", "IFRS S2", "ISSB"],
    color: "#2E86C1",
    description: "Sustainability & Climate Financial Disclosure",
  },
  {
    id: "security",
    title: "Security & Info Security",
    icon: "🔒",
    frameworks: ["ISO 27001", "SOC 2"],
    color: "#A569BD",
    description: "Information Security Management Systems",
  },
  {
    id: "healthSafety",
    title: "Health & Safety",
    icon: "⛑️",
    frameworks: ["ISO 45001"],
    color: "#F39C12",
    description: "Occupational Health & Safety Management",
  },
  {
    id: "environmental",
    title: "Environmental Management",
    icon: "🌱",
    frameworks: ["ISO 14001"],
    color: "#27AE60",
    description: "Environmental Management Systems",
  },
  {
    id: "energy",
    title: "Energy Management",
    icon: "⚡",
    frameworks: ["ISO 50001"],
    color: "#E67E22",
    description: "Energy Management Systems & Efficiency",
  },
  {
    id: "governance",
    title: "Governance",
    icon: "🏛️",
    frameworks: ["King IV", "SOX (where applicable)"],
    color: "#34495E",
    description: "Corporate Governance, risk and controls",
  },
];

export default function ExecutiveDashboardPage() {
  const [selectedModule, setSelectedModule] = useState<ModuleId | null>(null);
  const selected = selectedModule ? modules.find((m) => m.id === selectedModule)! : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #0b0b0f, #0f0f14)",
        color: "#e5e7eb",
        fontFamily:
          "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div>
            <h1 style={{ margin: 0, color: "#34d399" }}>Executive Dashboard</h1>
            <p style={{ margin: "6px 0", color: "#9ca3af" }}>
              ESG | ISO 50001 | Security | H&S | Environment | Governance
            </p>
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>
            Build: <b>Vercel</b> • Routing: <b>SPA</b>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {modules.map((m) => {
              const kpi = moduleData[m.id];
              const isActive = selectedModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedModule(m.id)}
                  style={{
                    textAlign: "left",
                    border: `1px solid ${isActive ? m.color : "#27272a"}`,
                    background: isActive ? "rgba(52, 211, 153, 0.07)" : "rgba(24,24,27,0.6)",
                    borderRadius: 12,
                    padding: 14,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 24 }}>{m.icon}</div>
                  <div style={{ marginTop: 6, fontWeight: 600 }}>{m.title}</div>
                  <div style={{ marginTop: 6, fontSize: 12, color: "#a1a1aa" }}>
                    {m.description}
                  </div>
                  <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap", fontSize: 11 }}>
                    {m.frameworks.map((f) => (
                      <span
                        key={f}
                        style={{
                          border: "1px solid #3f3f46",
                          padding: "2px 6px",
                          borderRadius: 8,
                          color: "#cbd5e1",
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: m.color }}>Score: {kpi.score}</span>
                    <span>Status: {kpi.status}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div
            style={{
              border: "1px solid #27272a",
              borderRadius: 12,
              background: "rgba(24,24,27,0.6)",
              padding: 14,
              minHeight: 220,
            }}
          >
            <h3 style={{ marginTop: 0, color: "#34d399" }}>
              {selected ? selected.title : "Select a module"}
            </h3>
            {!selected && (
              <p style={{ color: "#a1a1aa", fontSize: 14 }}>
                Click a tile to view KPIs, frameworks, and the latest update.
              </p>
            )}
            {selected && (
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                <div>
                  <b>Description:</b> {selected.description}
                </div>
                <div style={{ marginTop: 6 }}>
                  <b>Frameworks:</b> {selected.frameworks.join(", ")}
                </div>
                <div style={{ marginTop: 6 }}>
                  <b>Score / Status:</b> {moduleData[selected.id].score} / {moduleData[selected.id].status}
                </div>
                <div style={{ marginTop: 6 }}>
                  <b>Last Update:</b> {moduleData[selected.id].lastUpdate}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
