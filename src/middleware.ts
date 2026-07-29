import { NextRequest, NextResponse } from "next/server";

const TEAM_SCOPE = "amplitudemoduladas-projects";

export function middleware(req: NextRequest) {
  const allowedDomain = process.env.APP_DOMAIN;
  const host = req.headers.get("host") ?? "";

  if (allowedDomain && req.nextUrl.pathname.startsWith("/api/")) {
    const isProduction = host === allowedDomain;
    const isOurPreview = host.endsWith(`-${TEAM_SCOPE}.vercel.app`);
    const isAllowed = isProduction || isOurPreview;

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Acesso bloqueado: domínio não autorizado" },
        { status: 403 }
      );
    }
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
