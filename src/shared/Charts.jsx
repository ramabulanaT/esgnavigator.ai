/* src/shared/Charts.jsx */
import React from "react";

export function LineChart({ data = [], width = 360, height = 80 }) {
  const pad = 8;
  const vals = (data.length?data:[0]).map(v=>Number(v)||0);
  const max = Math.max(100, ...vals, 1), min = Math.min(0, ...vals);
  const xs = vals.map((_,i)=> pad + i * ((width - 2*pad)/Math.max(1, vals.length - 1)));
  const ys = vals.map(v => height - pad - ( (v - min) / Math.max(1, max - min) ) * (height - 2*pad));
  const pts = xs.map((x,i)=>`${Math.round(x)},${Math.round(ys[i])}`).join(" ");
  return (
    <svg width={width} height={height} role="img" aria-label="Trend">
      <polyline points={pts} fill="none" stroke="#111827" strokeWidth="2" />
      {xs.length>0 && <circle cx={xs.at(-1)} cy={ys.at(-1)} r="3" fill="#111827" />}
    </svg>
  );
}

export function BarChart({ data = [], width = 360, height = 100 }) {
  const pad = 8;
  const n = data.length || 1;
  const max = Math.max(1, ...data.map(d=>Number(d)||0));
  const bw = (width - 2*pad) / n;
  return (
    <svg width={width} height={height} role="img" aria-label="Distribution">
      {data.map((v,i)=>{
        const h = ((Number(v)||0) / max) * (height - 2*pad);
        const x = pad + i*bw, y = height - pad - h;
        return <rect key={i} x={x+2} y={y} width={bw-4} height={h} fill="#111827" />;
      })}
    </svg>
  );
}
