import { NextResponse, type NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// In-memory rate limiter (Edge-compatible, no Redis required)
// Works well at Vercel's Edge layer where instances stay warm.
// Each entry: { count: number, resetAt: timestamp }
// ---------------------------------------------------------------------------
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    // New window — reset counter
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (entry.count >= maxRequests) {
    return true; // blocked
  }

  entry.count++;
  return false;
}

// Periodically clean up expired entries to prevent unbounded memory growth
function maybePurgeExpired() {
  if (Math.random() > 0.02) return; // run ~2% of the time
  const now = Date.now();
  for (const [key, val] of rateLimitStore.entries()) {
    if (now > val.resetAt) rateLimitStore.delete(key);
  }
}

// ---------------------------------------------------------------------------
// Rate limit rules per endpoint
// ---------------------------------------------------------------------------
const RATE_LIMITS: Record<string, { max: number; windowMs: number; label: string }> = {
  "/api/register": { max: 5,  windowMs: 15 * 60 * 1000, label: "5 per 15 min"  },  // prevent registration spam
  "/api/orders":   { max: 10, windowMs: 60 * 60 * 1000, label: "10 per hour"   },  // prevent order flooding
  "/api/upload":   { max: 20, windowMs: 60 * 60 * 1000, label: "20 per hour"   },  // prevent Cloudinary abuse
  "/api/verify":   { max: 10, windowMs: 15 * 60 * 1000, label: "10 per 15 min" },  // prevent OTP brute-force
};

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.nextUrl.hostname;
  const proto = req.headers.get("x-forwarded-proto") || "";

  // --- 1. Enforce HTTPS and www (skip on localhost) ---
  const isLocalhost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".local");

  if (!isLocalhost) {
    const needsWww = hostname === "itechlk.com";
    const needsHttps = proto === "http";

    if (needsWww || needsHttps) {
      const secureUrl = new URL(
        req.nextUrl.pathname + req.nextUrl.search,
        "https://www.itechlk.com"
      );
      return NextResponse.redirect(secureUrl, 301);
    }
  }

  // --- 2. Rate limiting for sensitive API routes ---
  const rule = RATE_LIMITS[pathname];
  if (rule && req.method === "POST") {
    maybePurgeExpired();

    // Extract client IP — Vercel sets x-forwarded-for
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const key = `${ip}:${pathname}`;

    if (isRateLimited(key, rule.max, rule.windowMs)) {
      console.warn(`[RateLimit] Blocked ${ip} on ${pathname} (limit: ${rule.label})`);
      return NextResponse.json(
        { error: `Too many requests. Limit: ${rule.label}. Please try again later.` },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(rule.windowMs / 1000)),
            "X-RateLimit-Limit": String(rule.max),
          },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes EXCEPT static files
    "/((?!_next/static|_next/image|favicon.ico|assets).*)",
  ],
};
