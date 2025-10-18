import React from "react";

/** Minimal sparkline: values 0..100, width/height small, no bells & whistles */
export default function Sparkline({ data = [], width = 120, height = 32 }) {
  const vals = (Array.isArray(data) && data.length ? data : [0]).map(v => Math.max(0, Math.min(100, Number(v) || 0)));
  const pad = 2;
  const w = width, h = height, innerH = h - pad*2;
  const stepX = vals.length > 1 ? (w - pad*2) / (vals.length - 1) : 0;
  const toY = (v) => h - pad - (v/100) * innerH;
  const pts = vals.map((v, i) => [Math.round(pad + i*stepX), Math.round(toY(v))]);
  const pointsAttr = pts.map(([x,y]) => `${x},${y}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="7-day trend">
      <polyline points={pointsAttr} fill="none" stroke="#111827" strokeWidth="2" />
      {last && <circle cx={last[0]} cy={last[1]} r="2.5" fill="#111827" />}
    </svg>
  );
}
