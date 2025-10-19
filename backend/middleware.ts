import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// why: canonicalize to www.esgnavigator.ai; avoids split cookies/SEO
const PRIMARY_HOST = "www.esgnavigator.ai";

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
