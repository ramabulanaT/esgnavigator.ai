import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  console.log('Health endpoint hit');
  res.json({
    status: "ok",
    message: "TIS-IntelliMat server running",
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/iso50001/template', (req, res) => {
  console.log('Template endpoint hit');
  res.json({
    success: true,
    template: {
      standard: "ISO 50001:2018",
      title: "Energy Management Systems Assessment"
    }
  });
});

const PORT = 3002;
const server = app.listen(PORT, '127.0.0.1', () => {
  const address = server.address();
  console.log('Server bound to:', address);
  console.log('Test with: curl.exe http://127.0.0.1:' + PORT + '/api/health');
});

server.on('error', (err) => {
  console.error('SERVER ERROR:', err);
  process.exit(1);
});
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node@latest"
    }
  }
}