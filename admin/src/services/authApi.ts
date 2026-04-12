import { authenticatedFetch, BASE_URL } from "./api";

// ================================================================
// TYPES
// ================================================================
export interface LoginResponse {
    accessToken: string;
    refreshToken: string | null; // Luôn null trong response (BE giấu vào HttpOnly Cookie)
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


// ================================================================
// LOGIN — POST /api/v1/auth/login
// credentials: 'include' bắt buộc để trình duyệt nhận HttpOnly Cookie
// ================================================================
export const loginFullResponse = async (
    data: { email: string; password: string }
): Promise<Response> => {
    return fetch(`${BASE_URL}/admin/auth/login`, {  // Admin-specific endpoint
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
};

export const login = async (
    data: { email: string; password: string }
): Promise<LoginResponse> => {
    const res = await loginFullResponse(data);

    if (!res.ok) {
        let errorMessage = "Login failed";
        try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
        } catch (_) {}
        throw new Error(errorMessage);
    }

    return res.json();
};


// ================================================================
// REGISTER — POST /api/v1/auth/register
// ================================================================
export const register = async (data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
}): Promise<RegisterResponse> => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        let errorMessage = "Registration failed";
        try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
        } catch (_) {}
        throw new Error(errorMessage);
    }

    return res.json();
};


// ================================================================
// REFRESH TOKEN — POST /api/v1/auth/refresh
// BE tự lấy Refresh Token từ Cookie, FE chỉ cần credentials:'include'
// Trả về LoginResponse mới với accessToken mới
// (Dùng nội bộ trong api.ts — hàm này chỉ để tái sử dụng nếu cần)
// ================================================================
export const refreshAccessToken = async (): Promise<LoginResponse> => {
    const res = await fetch(`${BASE_URL}/admin/auth/refresh`, {  // Admin-specific endpoint
        method: "POST",
        credentials: "include", // Sends "adminRefreshToken" cookie (NOT "refreshToken")
    });

    if (!res.ok) {
        throw new Error("Admin refresh token expired. Please login again.");
    }

    return res.json();
};


// ================================================================
// LOGOUT — POST /api/v1/auth/logout
// BE tự lấy Refresh Token từ Cookie để xóa, FE chỉ gửi Access Token
// credentials:'include' bắt buộc để cookie được gửi lên và bị xóa
// FIX #8: Thêm Content-Type, bỏ body rỗng
// ================================================================
export const logout = async (accessToken?: string): Promise<void> => {
    try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        await fetch(`${BASE_URL}/admin/auth/logout`, {  // Admin-specific endpoint
            method: "POST",
            credentials: "include", // Sends "adminRefreshToken" cookie to BE for deletion
            headers,
        });
    } catch (error) {
        console.error("Admin logout request failed (ignored):", error);
    }
};


// ================================================================
// GET ME — GET /api/v1/users/me
// FIX #7: Bỏ param token?, authenticatedFetch tự xử lý token
// ================================================================
export const getMe = async (): Promise<UserType> => {
    return authenticatedFetch("/users/me");
};


// ================================================================
// UPDATE PROFILE — PUT /api/v1/users/me
// ================================================================
export const updateProfile = async (data: Partial<UserType>): Promise<UserType> => {
    return authenticatedFetch("/users/me", {
        method: "PUT",
        body: JSON.stringify(data),
    });
};
