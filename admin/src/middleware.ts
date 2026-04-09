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

    // Đã chưa gọi đăng nhập thành công và không ở /login
    if (!refreshToken && !isLoginPage) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Xóa việc ép redirect về / ở middleware, vì refresh có thể đã hết hạn 
    // khiến client và server bị mismatch trạng thái, gây ra infinite loop loading.

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
