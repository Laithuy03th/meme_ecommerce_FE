import { LoginResponse, RegisterResponse } from "@/types";
import { BASE_URL } from "./base";

export const login = async (data: { email: string; password: string }): Promise<LoginResponse> => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
    }

    return res.json();
};

export const register = async (data: { email: string; password: string; fullName: string; phone?: string }): Promise<RegisterResponse> => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
    }

    return res.json();
};

export const refreshToken = async (refreshToken: string): Promise<LoginResponse> => {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
        throw new Error("Failed to refresh token");
    }

    return res.json();
};

export const logout = async (token: string): Promise<void> => {
    try {
        await fetch(`${BASE_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error("Logout failed:", error);
    }
};
