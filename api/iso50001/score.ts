import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  res.status(200).json({
    success: true,
    companyId: id,
    score: 75,
    message: "Score endpoint working"
  });
}