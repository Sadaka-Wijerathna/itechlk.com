import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const hostname = req.nextUrl.hostname;
  const proto = req.headers.get("x-forwarded-proto") || "";
  
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".local");
  
  if (!isLocalhost) {
    if (hostname === "itechlk.com" || proto === "http") {
      const secureUrl = new URL(req.nextUrl.pathname + req.nextUrl.search, "https://www.itechlk.com");
      return NextResponse.redirect(secureUrl, 301);
    }
  }
  
  // This middleware ensures that the session is refreshed and available
  // It also allows you to protect routes easily in the future
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
}
