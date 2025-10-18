import { useEffect, useState } from "react"
import { fetchPaymentsSummary, fetchTransactions } from "./services/api";

export default function Payments() {
  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [s, t] = await Promise.all([fetchPaymentsSummary(), fetchTransactions()]);
        setSummary(s);
        setRows(Array.isArray(t) ? t : []);
      } catch (e) {
        console.error("Payments load failed", e);
        setErr("Failed to load payments; please check the backend.");
      }
    })();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Payments</h1>

      {err && <div className="rounded bg-yellow-50 border border-yellow-200 p-3 text-sm">{err}</div>}

      {summary && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Total payments" value={`ZAR ${Number(summary.total||0).toLocaleString()}`} />
          <Card title="Count" value={summary.count ?? 0} />
          <Card title="Confirmed" value={`ZAR ${Number(summary.byStatus?.confirmed||0).toLocaleString()}`} />
          <Card title="Pending" value={`ZAR ${Number(summary.byStatus?.pending||0).toLocaleString()}`} />
        </div>
      )}

      <section>
        <h2 className="text-lg font-medium mb-2">Transactions</h2>
        <div className="overflow-auto rounded border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <Th>ID</Th><Th>Plan</Th><Th>Amount</Th><Th>Currency</Th><Th>Method</Th><Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr className="border-t" key={i}>
                  <Td>{r.id}</Td>
                  <Td>{r.planName}</Td>
                  <Td>{Number(r.amount||0).toLocaleString()}</Td>
                  <Td>{r.currency}</Td>
                  <Td className="uppercase">{r.paymentMethod}</Td>
                  <Td className="capitalize">{r.status}</Td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><Td colSpan={6}>No transactions</Td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
const Th = (p) => <th className="text-left p-2 font-medium">{p.children}</th>;
const Td = (p) => <td className="p-2">{p.children}</td>;
