import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// why: canonicalize to www.esgnavigator.ai; avoids split cookies/SEO
const PRIMARY_HOST = "www.esgnavigator.ai";

const DEFAULT_FLIP_ISO = "2025-10-26T00:00:00Z";
function redirectCode(): 307 | 308 { const mode=(process.env.REDIRECT_MODE||"").toLowerCase(); if(mode==="permanent")return 308; if(mode==="temporary")return 307; const flipIso=process.env.REDIRECT_FLIP_TS||DEFAULT_FLIP_ISO; const t=Date.parse(flipIso); const f=Number.isNaN(t)?Date.parse(DEFAULT_FLIP_ISO):t; return Date.now()>=f?308:307;}
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  if (host === PRIMARY_HOST || host.endsWith(".vercel.app")) return NextResponse.next();
  if (host === "esgnavigator.ai") {
    const url = req.nextUrl.clone();
    url.host = PRIMARY_HOST;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/:path*"] };
