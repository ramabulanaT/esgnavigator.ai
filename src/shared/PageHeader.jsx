import React from "react";
export default function PageHeader({ title, actions }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #e5e7eb",marginBottom:12}}>
      <h2 style={{margin:0,fontSize:22}}>{title}</h2>
      <div style={{display:"flex",gap:8}}>{actions}</div>
    </div>
  );
}
