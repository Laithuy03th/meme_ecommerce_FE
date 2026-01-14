"use server";

import { login } from "@/services/authApi";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { success: false, message: "Email and password are required" };
    }

    try {
        const response = await login({ email, password });
        const data = await response.json();

        // Check if user is ADMIN
        const roles = data.user.roles;
        if (!roles.includes("ADMIN")) {
            return { success: false, message: "Access denied. Admin only." };
        }

        const cookieStore = await cookies();

        // Set accessToken from body
        cookieStore.set("adminAccessToken", data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 15, // 15 minutes as per user requirement
        });

        // Forward cookies from backend (especially refreshToken)
        let setCookieHeader: string[] = [];

        // Attempt to use getSetCookie if available (Node 18+)
        if (typeof (response.headers as any).getSetCookie === 'function') {
            setCookieHeader = (response.headers as any).getSetCookie();
        } else {
            // Fallback for older environments
            const headerVal = response.headers.get("set-cookie");
            if (headerVal) {
                // Warning: This simple split might fail for dates with commas. 
                // But getSetCookie should cover most Next.js runtime cases.
                setCookieHeader = [headerVal];
            }
        }

        if (setCookieHeader && setCookieHeader.length > 0) {
            setCookieHeader.forEach(cookieStr => {
                // Basic parsing to extract name and value
                // A cookie string looks like: refreshToken=abc12345; Path=/; HttpOnly; Max-Age=...
                const firstSemi = cookieStr.indexOf(';');
                let nameValue = cookieStr;
                if (firstSemi > -1) {
                    nameValue = cookieStr.substring(0, firstSemi);
                }

                const [name, ...valueParts] = nameValue.split('=');
                const value = valueParts.join('='); // Rejoin in case value has =

                if (name && name.trim() === 'refreshToken') {
                    // We found the refresh token. 
                    // Ideally we should parse other attributes like Max-Age to match backend
                    // But for now hardcoding safe defaults to match the "7 days" assumption
                    // or just letting it session-based if we don't set maxAge.
                    // Let's stick to the user's requirement of persistent refresh token
                    cookieStore.set(name.trim(), value, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        path: "/",
                        maxAge: 60 * 60 * 24 * 7, // 7 days hardcoded as in previous logic
                    });
                }
            });
        }

        // Set user info (optional, for client-side access if needed, but better to fetch /me)
        // cookieStore.set("user", JSON.stringify(response.user), { ... });

        return { success: true, user: data.user };

    } catch (error: any) {
        return { success: false, message: error.message || "Login failed" };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("adminAccessToken");
    cookieStore.delete("refreshToken");
    redirect("/login");
}
