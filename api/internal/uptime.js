export const config = { runtime: 'edge' };

export default async function handler() {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/\/$/, '');
  const body = JSON.stringify({
    ok: true,
    service: 'esgnavigator-ai',
    env: process.env.NODE_ENV || 'production',
    apiUrl,
    ts: new Date().toISOString()
  }, null, 2);
  return new Response(body, {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}
