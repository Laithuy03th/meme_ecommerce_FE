export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";


export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

// ================================================================
// REFRESH TOKEN LOCK — Chống Race Condition
// Khi nhiều request cùng bị 401, chỉ 1 request thực sự gọi /refresh.
// Các request còn lại xếp hàng chờ token mới.
// ================================================================
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};


const refreshToken = async (): Promise<{ accessToken: string; user?: any }> => {
    const res = await fetch(`${BASE_URL}/admin/auth/refresh`, {  // Admin-specific endpoint
        method: "POST",
        credentials: "include", // Sends "adminRefreshToken" cookie (NOT "refreshToken")
    });

    if (!res.ok) {
        throw new ApiError("Failed to refresh token", res.status);
    }

    return res.json();
};

// ================================================================
// Thực thi Refresh + cập nhật localStorage + xả hàng đợi
// ================================================================
const performRefreshToken = async (): Promise<string> => {
    // Nếu đang refresh, xếp hàng đợi token mới
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        });
    }

    isRefreshing = true;

    try {
        const refreshResponse = await refreshToken();

        if (!refreshResponse?.accessToken) {
            throw new ApiError("No access token returned from refresh", 401);
        }

        const newAccessToken = refreshResponse.accessToken;

        // Cập nhật localStorage
        localStorage.setItem("accessToken", newAccessToken);
        if (refreshResponse.user) {
            localStorage.setItem("user", JSON.stringify(refreshResponse.user));
        }

        // Xả hàng: cho tất cả request đang chờ dùng token mới
        processQueue(null, newAccessToken);
        return newAccessToken;

    } catch (error) {
        // Refresh thất bại: xả hàng với lỗi, buộc đăng nhập lại
        processQueue(error as Error, null);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
        }

        throw error;
    } finally {
        isRefreshing = false;
    }
};

const getToken = (): string | null => {
    if (typeof window === "undefined") {
        // Server-side: không thể đọc localStorage.
        // Middleware Next.js phải xử lý redirect trước khi vào đây.
        return null;
    }
    return localStorage.getItem("accessToken");
};

// ================================================================
// authenticatedFetch — Fetch với tự động retry khi hết token
// ================================================================
export const authenticatedFetch = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> => {
    const token = getToken();

    const buildHeaders = (t: string | null | undefined): Record<string, string> => ({
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
    });

    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

    const fetchOptions: RequestInit = {
        ...options,
        credentials: "include",
    };

    let res = await fetch(url, {
        ...fetchOptions,
        headers: buildHeaders(token),
    });

    // ================================================================
    //  Xử lý 401
    // ================================================================
    if (res.status === 401) {
        // Tránh vòng lặp vô tận: nếu chính endpoint /refresh bị 401 thì dừng
        if (endpoint.includes("/auth/refresh")) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
            throw new ApiError("Session expired", 401);
        }

        if (typeof window !== "undefined") {
            // Client-side: thực hiện refresh rồi retry
            try {
                const newToken = await performRefreshToken();

                // Retry request với token mới
                res = await fetch(url, {
                    ...fetchOptions,
                    headers: buildHeaders(newToken),
                });

                // FIX #5: Nếu retry vẫn 401 thì không loop nữa
                if (res.status === 401) {
                    throw new ApiError("Unauthorized after token refresh", 401);
                }
            } catch (error) {
                throw new ApiError("Session expired", 401);
            }
        } else {

            throw new ApiError("Session expired (server-side)", 401);
        }
    }

    if (res.status === 204) {
        return null as unknown as T;
    }

    if (!res.ok) {
        const text = await res.text();
        let errorMessage = `API Error: ${res.status} ${res.statusText}`;
        try {
            const json = JSON.parse(text);
            if (json.message) errorMessage = json.message;
        } catch (_) { /* ignore */ }
        throw new ApiError(errorMessage, res.status);
    }

    const text = await res.text();
    if (!text) {
        return null as unknown as T;
    }
    return JSON.parse(text);
};

// ================================================================
// Utility
// ================================================================
export function buildQueryString(params: Record<string, any>): string {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, String(value));
        }
    });
    return query.toString();
}
