import { authenticatedFetch, BASE_URL } from "./api";

export interface LoginResponse {
    accessToken: string;
    refreshToken: string | null;
    tokenType: string | null;
    user: {
        id: number;
        email: string;
        roles: string[];
        fullName?: string;
        phone?: string;
        avatarUrl?: string;
        [key: string]: any;
    };
}

export interface RegisterResponse {
    id: number;
    email: string;
    fullName: string;
    roles: string[];
    [key: string]: any;
}

export interface UserType {
    id: number;
    email: string;
    fullName: string;
    roles: string[];
    [key: string]: any;
}

/**
 * Update user profile
 */
export const updateProfile = async (data: Partial<UserType>): Promise<UserType> => {
    const res = await authenticatedFetch("/users/me", {
        method: "PUT",
        body: JSON.stringify(data),
    });

    return res; // authenticatedFetch returns json
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
        body: "", // ❌ KHÔNG gửi body nữa, refresh token ở cookie, nhưng fetch POST cần body k trống trong 1 số trường hợp, nhưng ở đây curl để trống
    });

    if (!res.ok) {
        throw new Error("Failed to refresh token");
    }

    return res.json();
};

/**
 * Logout API - Xóa refresh token cookie
 */
export const logout = async (token?: string): Promise<void> => {
    try {
        const headers: Record<string, string> = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        await fetch(`${BASE_URL}/auth/logout`, {
            method: "POST",
            credentials: 'include', // Để cookie bị xóa
            headers,
            body: ""
        });
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

/**
 * Get current user info
 */
export const getMe = async (token?: string): Promise<any> => {
    // Note: This implementation assumes usage where token might be passed manually
    // But typically authenticatedFetch handles current token.
    // Preserving requested signature flexibility.

    if (token) {
        const res = await fetch(`${BASE_URL}/users/me`, {
            credentials: 'include',
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch user");
        }
        return res.json();
    } else {
        // Fallback to authenticatedFetch if no token passed explicitly
        return authenticatedFetch("/users/me");
    }
};
