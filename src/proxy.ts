import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export const config = {
  matcher: ["/admin/:path*", "/scanner/:path*"],
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.SESSION_SECRET;

  const isAdmin = secret
    ? await verifySessionToken(req.cookies.get("admin_session")?.value, "admin", secret)
    : false;
  const isStaff = secret
    ? await verifySessionToken(req.cookies.get("staff_session")?.value, "staff", secret)
    : false;

  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    if (isLoginPage) {
      if (isAdmin) return NextResponse.redirect(new URL("/admin", req.url));
      return NextResponse.next();
    }
    if (!isAdmin) return NextResponse.redirect(new URL("/admin/login", req.url));
    return NextResponse.next();
  }

  if (pathname.startsWith("/scanner")) {
    const isLoginPage = pathname === "/scanner/login";
    if (isLoginPage) {
      if (isAdmin || isStaff) return NextResponse.redirect(new URL("/scanner", req.url));
      return NextResponse.next();
    }
    if (!isAdmin && !isStaff) return NextResponse.redirect(new URL("/scanner/login", req.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}
