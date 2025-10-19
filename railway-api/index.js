import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

const ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// wildcard support: *.vercel.app
const allow = (origin) => {
  if (!origin) return true;              // server-to-server / curl
  if (ORIGINS.includes('*')) return true;
  if (ORIGINS.includes(origin)) return true;
  for (const pat of ORIGINS) {
    if (pat.startsWith('*.') && origin.endsWith(pat.slice(1))) return true;
  }
  return false;
};

app.use(express.json());
app.use(cors({
  origin: (origin, cb) => allow(origin) ? cb(null, true) : cb(new Error(`CORS blocked: ${origin}`)),
  methods: ['GET','POST','OPTIONS'],
  credentials: true
}));
app.options('*', cors());

// health + info
app.get('/', (_req, res) => res.json({ ok: true, service: 'railway-api', ts: new Date().toISOString() }));
app.get(['/health','/api/health','/v1/health'], (_req, res) =>
  res.json({ ok: true, status: 'healthy', ts: new Date().toISOString() })
);
app.get('/api/version', (_req, res) =>

app.post(/api/internal/echo, (req, res) => {
  // Why: end-to-end JSON + CORS proof
  res.set(x-echo, ok);
  res.json({ ok: true, received: req.body, ts: new Date().toISOString() });
});


app.post(/api/internal/echo, (req, res) => {
  // Why: end-to-end JSON + CORS proof
  res.set(x-echo, ok);
  res.json({ ok: true, received: req.body, ts: new Date().toISOString() });
});


app.post(/api/internal/echo, (req, res) => {
  // Why: end-to-end JSON + CORS proof
  res.set(x-echo, ok);
  res.json({ ok: true, received: req.body, ts: new Date().toISOString() });
});

  res.json({ name: 'esg-railway-api', version: process.env.API_VERSION || 'v1', node: process.version, env: process.env.NODE_ENV || 'production' })
);

app.listen(PORT, '0.0.0.0', () => console.log(`Railway API listening on 0.0.0.0:${PORT}`));
