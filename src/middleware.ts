import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const allowed = process.env.APP_DOMAIN;
  if (allowed && req.nextUrl.pathname.startsWith("/api/")) {
    const host = req.headers.get("host") ?? "";
    const isVercel = host.endsWith(".vercel.app");
    const isAllowed = host === allowed || isVercel;

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
