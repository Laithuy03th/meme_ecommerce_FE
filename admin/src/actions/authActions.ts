"use server";

import { loginFullResponse } from "@/services/authApi";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { success: false, message: "Email and password are required" };
    }

    try {
        const response = await loginFullResponse({ email, password });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
        }

        const data = await response.json();

        
        const roles = data.user.roles;
        if (!roles.includes("ADMIN")) {
            return { success: false, message: "Access denied. Admin only." };
        }

        const cookieStore = await cookies();

        cookieStore.set("adminAccessToken", data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 15, 
        });

        let setCookieHeader: string[] = [];

        if (typeof (response.headers as any).getSetCookie === 'function') {
            setCookieHeader = (response.headers as any).getSetCookie();
        } else {
            const headerVal = response.headers.get("set-cookie");
            if (headerVal) {
                setCookieHeader = [headerVal];
            }
        }

        if (setCookieHeader && setCookieHeader.length > 0) {
            setCookieHeader.forEach(cookieStr => {
                const firstSemi = cookieStr.indexOf(';');
                let nameValue = cookieStr;
                if (firstSemi > -1) {
                    nameValue = cookieStr.substring(0, firstSemi);
                }

                const [name, ...valueParts] = nameValue.split('=');
                const value = valueParts.join('=');

                if (name && name.trim() === 'refreshToken') {
                    
                    cookieStore.set(name.trim(), value, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        path: "/",
                        maxAge: 60 * 60 * 24 * 7, 
                    });
                }
            });
        }


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
