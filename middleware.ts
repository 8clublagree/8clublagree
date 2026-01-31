import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/api/:path*"],
};

// In-memory token validation cache (short TTL) to reduce Supabase /auth/v1/user calls
const TOKEN_CACHE_TTL_MS = 60_000; // 1 min
const tokenCache = new Map<string, number>();

function isTokenCachedValid(token: string): boolean {
  const expires = tokenCache.get(token);
  if (expires == null) return false;
  if (Date.now() >= expires) {
    tokenCache.delete(token);
    return false;
  }
  return true;
}

function setTokenCached(token: string): void {
  tokenCache.set(token, Date.now() + TOKEN_CACHE_TTL_MS);
}



export async function middleware(req: NextRequest) {
  const { headers, nextUrl } = req;
  const origin = req.nextUrl.origin;
  const pathname = nextUrl.pathname;


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
  if (origin !== process.env.SYSTEM_ORIGIN!) {
    return NextResponse.json({ error: "Unauthorized Origin" }, { status: 401 });
  }

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized Token" }, { status: 401 });
  }

  const token = authHeader.slice(7); // "Bearer ".length — avoid replace allocation

  // Use cache to avoid Supabase call on every request (cost + latency)
  if (!isTokenCachedValid(token)) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL!!}/auth/v1/user`,
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
    setTokenCached(token);
  }

  return NextResponse.next();
}
