import { createRemoteJWKSet, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const supabaseJwks = createRemoteJWKSet(
  new URL(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/auth/v1/.well-known/jwks.json`,
  ),
);

export const config = {
  matcher: ["/api/:path*"],
};

export async function middleware(req: NextRequest) {
  const { headers, nextUrl } = req;
  const origin = req.nextUrl.origin;
  const pathname = nextUrl.pathname;


  if (pathname === "/api/signup") {
    return NextResponse.next();
  }
  if (pathname === "/api/send-class-reminders") {
    return NextResponse.next();
  }
  if (pathname === "/api/package-expiry-reminder") {
    return NextResponse.next();
  }

  if (pathname === "/api/maya/webhook") {
    return NextResponse.next();
  }

  if (pathname === "/api/request-password-reset") {
    return NextResponse.next();
  }
  if (pathname === "/api/verify-otp") {
    return NextResponse.next();
  }
  if (pathname === "/api/validate-reset-token") {
    return NextResponse.next();
  }
  if (pathname === "/api/reset-password-with-token") {
    return NextResponse.next();
  }
  if (pathname === "/api/admin/revoke-all-sessions") {
    return NextResponse.next();
  }

  const authHeader = headers.get("authorization");

  const data = Object.fromEntries(new URL(req.url).searchParams.entries());
  if (data.type === "about") {
    return NextResponse.next();
  }

  if (data.type === "reset-link") {
    return NextResponse.next();
  }

  // Origin check before any auth work
  // if (origin !== process.env.SYSTEM_ORIGIN_TEST!) {
  // if (origin !== process.env.SYSTEM_ORIGIN_TEMP!) {
  if (origin !== process.env.SYSTEM_ORIGIN!) {
    return NextResponse.json({ error: "Unauthorized Origin" }, { status: 401 });
  }

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized Token" }, { status: 401 });
  }

  const token = authHeader.slice(7);

  // Prefer local JWT verification via JWKS (no network call per request; works with asymmetric signing keys).
  // Falls back to Auth server when project still uses legacy JWT secret only (JWKS empty).
  try {
    await jwtVerify(token, supabaseJwks);
    return NextResponse.next();
  } catch {
    // JWKS verification failed (e.g. legacy project, invalid/expired token). Fall back to Auth server.
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/auth/v1/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
        },
      );
      if (!res.ok) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      return NextResponse.next();
    } catch {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 },
      );
    }
  }
}
