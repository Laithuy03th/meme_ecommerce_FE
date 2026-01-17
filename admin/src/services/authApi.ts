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
export const loginFullResponse = async (data: { email: string; password: string }): Promise<Response> => {
    return fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
};

export const login = async (data: { email: string; password: string }): Promise<LoginResponse> => {
    const res = await loginFullResponse(data);

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

// refreshToken is now handled internally in api.ts to avoid circular dependency

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
