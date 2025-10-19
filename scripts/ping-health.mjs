/**
 * Usage:
 *   WEB_ALIAS=esgnavigator-ai.vercel.app node scripts/ping-health.mjs
 *   WEB_ALIAS=... SLACK_WEBHOOK_URL=... node scripts/ping-health.mjs
 */
const WEB_ALIAS = process.env.WEB_ALIAS || 'esgnavigator-ai.vercel.app';
const WEB = `https://${WEB_ALIAS}`;
const SLACK = process.env.SLACK_WEBHOOK_URL || '';

const postSlack = async (title, text, good=false) => {
  if (!SLACK) return;
  const color = good ? '#16a34a' : '#dc2626';
  const payload = {
    attachments: [{
      color,
      blocks: [
        { type: 'header', text: { type: 'plain_text', text: title } },
        { type: 'section', text: { type: 'mrkdwn', text } }
      ]
    }]
  };
  await fetch(SLACK, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
    .catch(()=>{});
};

const getJSON = async (url) => {
  const res = await fetch(url, { method: 'GET', cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
};

(async () => {
  const status = await getJSON(`${WEB}/api/internal/status`);
  const healthOK = status?.api?.health?.some?.(h => h.ok) ?? false;
  const allow = status?.api?.cors?.allowOrigin || '';
  const webOrigin = status?.web?.origin || WEB;
  const corsOK = allow === '*' || (allow && allow.includes(webOrigin));
  const ok = !!(healthOK && corsOK);

  const lines = [
    `*Web*: ${WEB}`,
    `*API*: ${status?.api?.base || '(unset)'}`,
    `*Health*: ${healthOK ? 'OK' : 'FAIL'}`,
    `*CORS*: ${corsOK ? `OK (Allow: ${allow})` : `FAIL (Allow: ${allow||'(none)'})`}`,
    `*TS*: ${new Date().toISOString()}`
  ];
  if (!ok) await postSlack('❌ ESG Navigator Health', lines.join('\n'), false);
  else await postSlack('✅ ESG Navigator Health', lines.join('\n'), true);

  if (!ok) process.exit(1);
  console.log('OK');
})().catch(err => { console.error(err.message); process.exit(2); });
