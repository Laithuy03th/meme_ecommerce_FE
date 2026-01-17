import { LoginResponse, RegisterResponse, UserType } from "@/types";
import { BASE_URL, authenticatedFetch } from "./base";

/**
 * Update user profile
 */
export const updateProfile = async (data: Partial<UserType>): Promise<UserType> => {
    const res = await authenticatedFetch("/users/me", {
        method: "PUT",
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to update profile");
    }

    return res.json();
};


/**
 * Login API - Refresh token sẽ được set vào HttpOnly Cookie tự động
 * Frontend chỉ nhận accessToken và user trong response
 */
export const login = async (data: { email: string; password: string }): Promise<LoginResponse> => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        credentials: 'include', // Quan trọng: để browser nhận/gửi cookie
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
        credentials: 'include', // ✅ For future cookie support
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

/**
 * Refresh Token API - Đọc refresh token từ HttpOnly Cookie
 * KHÔNG cần gửi refresh token trong body nữa
 */
export const refreshToken = async (): Promise<LoginResponse> => {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: 'include', // ✅ Quan trọng: browser tự gửi cookie
        headers: {
            "Content-Type": "application/json",
        },
        // ❌ KHÔNG gửi body nữa, refresh token ở cookie
    });

    if (!res.ok) {
        throw new Error("Failed to refresh token");
    }

    return res.json();
};

/**
 * Logout API - Xóa refresh token cookie
 */
export const logout = async (token: string): Promise<void> => {
    try {
        await fetch(`${BASE_URL}/auth/logout`, {
            method: "POST",
            credentials: 'include', // Để cookie bị xóa
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

/**
 * Get current user info
 */
export const getMe = async (token?: string): Promise<any> => {
    if (!token) {
        throw new Error("Token required for getMe");
    }

    const res = await fetch(`${BASE_URL}/users/me`, {
        credentials: 'include', //  Consistency
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user");
    }

    return res.json();
};

export const forgotPassword = async (email: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        credentials: 'include', // ✅ Consistency
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) {
        throw new Error("Failed to send reset email");
    }
};

export const changePassword = async (data: { oldPassword: string; newPassword: string }, token: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "POST",
        credentials: 'include', // ✅ Consistency
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to change password");
    }
};
