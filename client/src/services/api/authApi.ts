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

export const getMe = async (token?: string): Promise<any> => {
    // If token is provided, use it (for initial verification), otherwise use authenticatedFetch if we were to use it here.
    // But since this is often used during initialization where we might want to manually pass the token:
    // However, to avoid circular dependency if we use authenticatedFetch here (which uses authStore), 
    // we should stick to manual fetch if we are passing token, or use authenticatedFetch if we assume store is set.
    // In AuthInitializer, we have the token.

    // Let's use manual fetch to be safe and simple for initialization check.
    // Wait, AuthInitializer imports getMe.

    // Actually, let's just use authenticatedFetch and let it handle the token from store? 
    // No, AuthInitializer is setting up the store.

    // So we need a version that takes a token.
    if (!token) {
        // Fallback to trying to get from store or just error?
        // For now, let's assume token is passed or we throw.
        throw new Error("Token required for getMe");
    }

    const res = await fetch(`${BASE_URL}/users/me`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user");
    }

    return res.json();
};
