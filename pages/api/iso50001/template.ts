import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    success: true,
    template: {
      standard: "ISO 50001:2018",
      title: "Energy Management Systems Assessment",
      sections: [
        { id: "A", title: "Context & Governance", questions: [{ id: 1, question: "Energy policy documented?", type: "yes_no", weight: 5 }]},
        { id: "B", title: "Datacentre Energy Review", questions: [{ id: 5, question: "Current PUE & trend?", type: "numeric", unit: "ratio", weight: 5 }]},
        { id: "C", title: "Planning & Objectives", questions: [{ id: 10, question: "EnPIs defined?", type: "yes_no", weight: 5 }]}
      ]
    }
  });
}
