import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnLogin = req.nextUrl.pathname === "/login"

    // if (isOnLogin && isLoggedIn) {
    //     return Response.redirect(new URL("/", req.nextUrl.origin))
    // }

    // if (!isLoggedIn && !isOnLogin) {
    //     return Response.redirect(new URL("/login", req.nextUrl.origin))
    // }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
