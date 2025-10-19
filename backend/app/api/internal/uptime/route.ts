import { NextResponse } from "next/server";
export const runtime = "node"; // why: consistent behavior w/ node libs

export async function GET() {
  const body = {
    ok: true,
    service: process.env.SERVICE_NAME ?? "esgnavigator-ai",
    env: process.env.VERCEL_ENV ?? "production",
    apiUrl: process.env.API_URL ?? "https://<your-app>.up.railway.app",
    ts: new Date().toISOString()
  };
  return new NextResponse(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
