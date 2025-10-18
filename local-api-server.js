import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    message: "TIS-IntelliMat server running",
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/iso50001.template', (req, res) => {
  res.json({
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
});

app.listen(3001, () => console.log('API server running on http://localhost:3001'));