import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

const app = express();
const TRUST_PROXY = (process.env.TRUST_PROXY ?? '1').trim();
app.set('trust proxy', /^\d+$/.test(TRUST_PROXY) ? parseInt(TRUST_PROXY,10) : TRUST_PROXY);

const ENABLE_HELMET_CSP = (process.env.ENABLE_HELMET_CSP ?? 'false').toLowerCase() === 'true';
app.use(helmet({ contentSecurityPolicy: ENABLE_HELMET_CSP ? undefined : false }));
app.use(express.json({ limit: process.env.JSON_LIMIT ?? '512kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const baseOrigins = (process.env.CORS_ORIGINS ?? '').split(',').map(s=>s.trim()).filter(Boolean);
const allowPreview = (process.env.ALLOW_VERCEL_PREVIEW ?? 'true').toLowerCase() === 'true';
const previewRe = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;
const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (baseOrigins.includes(origin)) return cb(null, true);
    if (allowPreview && previewRe.test(origin)) return cb(null, true);
    return cb(new Error('CORS: origin not allowed'), false);
  },
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const enableRL = (process.env.ENABLE_RATE_LIMIT ?? 'true').toLowerCase() === 'true';
if (enableRL) {
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '60000', 10);
  const max = parseInt(process.env.RATE_LIMIT_MAX_PER_WINDOW ?? '120', 10);
  app.use(rateLimit({ windowMs, max, standardHeaders: true, legacyHeaders: false }));
}

app.get('/api/healthz', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ ok: true, service: 'esgnavigator-backend', env: process.env.NODE_ENV || 'production', ts: new Date().toISOString() });
});

app.use((req, res) => res.status(404).json({ ok:false, error:'NOT_FOUND', path:req.path }));
app.use((err, req, res, _n) => res.status(err.status || 500).json({ ok:false, error: err.message || 'Internal Error', ts:new Date().toISOString() }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`[backend] listening on :${PORT}`));
