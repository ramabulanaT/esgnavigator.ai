/* seeds/seed-demo.js */
async function main() {
  const base = process.env.API || "http://localhost:3001";
  const r = await fetch(`${base}/api/demo/seed`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ force: true }) });
  if (!r.ok) throw new Error(`Seed failed: ${r.status}`);
  const j = await r.json();
  console.log("[seed] done:", j);
}
main().catch(e => { console.error(e); process.exit(1); });
