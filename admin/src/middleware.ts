import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Middleware chạy trên Edge runtime — KHÔNG có localStorage.
    // Dùng "refreshToken" cookie (HttpOnly, được BE set khi login thành công).
    // Access Token nằm trong localStorage -> Middleware KHÔNG đọc được.
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const { pathname } = request.nextUrl;

    const isLoginPage = pathname === "/login";
    const isPublicPath =
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname === "/favicon.ico";

    // Bỏ qua static files và API routes
    if (isPublicPath) {
        return NextResponse.next();
    }

    // Chưa có refresh token → chưa đăng nhập → redirect về /login
    if (!refreshToken && !isLoginPage) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Đã đăng nhập mà vào trang /login → redirect về dashboard
    if (refreshToken && isLoginPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Bảo vệ tất cả routes trừ:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
