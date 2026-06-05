import { auth } from "@/auth"

export default auth((req) => {
  // This middleware ensures that the session is refreshed and available
  // It also allows you to protect routes easily in the future
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
}
