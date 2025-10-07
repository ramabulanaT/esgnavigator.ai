import React from "react";
export default function ProgressBar({ value=0, target=100 }) {
  const v = Math.max(0, Math.min(100, Number(value)||0));
  const color = v >= 80 ? "#16a34a" : v >= 60 ? "#f59e0b" : "#dc2626";
  return (
    <div style={{background:"#f1f5f9", borderRadius:10, height:10, overflow:"hidden", border:"1px solid #e5e7eb"}}>
      <div style={{width:`${v}%`, height:"100%", background:color, transition:"width .3s ease"}} />
    </div>
  );
}
