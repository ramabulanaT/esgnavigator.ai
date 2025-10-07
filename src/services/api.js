export const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

export async function fetchStatus() {
  const r = await fetch(`${API_BASE}/ping`);
  if (!r.ok) throw new Error(`Status ${r.status}`);
  return r.json();
}

export async function fetchSummary(ticker) {
  const url = new URL(`${API_BASE}/data/summary`);
  if (ticker) url.searchParams.set("ticker", ticker);
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Summary ${r.status}`);
  const j = await r.json();
  const root = j?.data ?? j ?? {};
  const n = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  return {
    scope1KtCO2e: n(root.scope1KtCO2e ?? root.scope1 ?? root.scope1_ktco2e),
    scope2KtCO2e: n(root.scope2KtCO2e ?? root.scope2 ?? root.scope2_ktco2e),
    ltifr:        n(root.ltifr ?? root.LTIFR ?? root.ltif_rate),
    auditOpen:    n(root.auditOpen ?? root.audit_flags_open ?? root.issuesOpen ?? 0),
    scope1Delta:  n(root.scope1Delta ?? root.scope1_delta ?? 0),
    scope2Delta:  n(root.scope2Delta ?? root.scope2_delta ?? 0),
    ltifrDelta:   n(root.ltifrDelta  ?? root.ltifr_delta  ?? 0),
    auditDelta:   n(root.auditDelta  ?? root.audit_delta  ?? 0),
  };
}

export async function fetchSeries(ticker) {
  const url = new URL(`${API_BASE}/data/series`);
  if (ticker) url.searchParams.set("ticker", ticker);
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Series ${r.status}`);
  return r.json();
}

export async function fetchBenchmarks(keys=[]) {
  const url = new URL(`${API_BASE}/envizi/benchmarks`);
  if (keys.length) url.searchParams.set("keys", keys.join(","));
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Benchmarks ${r.status}`);
  return r.json();
}

export async function fetchPaymentsSummary() {
  const r = await fetch(`${API_BASE}/payments/summary`);
  if (!r.ok) throw new Error(`Payments summary ${r.status}`);
  return r.json();
}

export async function fetchTransactions() {
  const r = await fetch(`${API_BASE}/transactions`);
  if (!r.ok) throw new Error(`Transactions ${r.status}`);
  return r.json();
}
