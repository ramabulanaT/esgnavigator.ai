export const config = { runtime: 'edge' };
export default async function handler() {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '').trim();
  return new Response(JSON.stringify({
    ok: true, service: 'esgnavigator-ai',
    env: process.env.NODE_ENV || 'production',
    apiUrl, ts: new Date().toISOString()
  }), { headers: { 'content-type': 'application/json; charset=utf-8' }});
}
