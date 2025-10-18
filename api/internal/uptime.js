export const config = { runtime: 'edge' };

export default async function handler() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const body = JSON.stringify({
    ok: true,
    service: 'esgnavigator-ai',
    env: 'production',
    apiUrl,
    ts: new Date().toISOString()
  });
  return new Response(body, {
    headers: { 'content-type': 'application/json; charset=utf-8' },
    status: 200
  });
}
