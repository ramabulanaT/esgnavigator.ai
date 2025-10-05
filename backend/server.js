import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "TIS-IntelliMat server running",
    timestamp: new Date().toISOString(),
  });
});

// --- CSM Enrollment -> (optionally) HubSpot ---
app.post("/api/csm/enroll", async (req, res) => {
  const payload = req.body || {};
  console.log("Enrollment received:", payload);

  // If you want to forward to HubSpot, do it here with process.env.HUBSPOT_API_KEY
  // For now, just echo back success:
  res.json({ success: true, received: payload });
});

// --- ISO 50001 sample endpoints (mock) ---
app.get("/api/iso50001/template", (_req, res) => {
  res.json({ success: true, template: { title: "ISO 50001 Template (mock)" } });
});

app.get("/api/iso50001/score/:id", (req, res) => {
  res.json({ success: true, id: req.params.id, score: 75 });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║   TIS-IntelliMat Backend Server Running       ║
║   Port: ${port}                                   ║
║   Status: ✓ Ready                              ║
╚═══════════════════════════════════════════════╝
`);
});
