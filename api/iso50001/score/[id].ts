import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id?: string };
  if (!id) return res.status(400).json({ error: "id required" });

  res.status(200).json({
    success: true,
    assessment: {
      id,
      org: "Demo Organization",
      score: 75,
      max_score: 100,
      completed_at: new Date().toISOString(),
      breakdown: {
        "Context & Governance": { score: 80, max: 100 },
        "Datacentre Energy Review": { score: 70, max: 100 },
        "Planning & Objectives": { score: 75, max: 100 }
      }
    }
  });
}
