export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// Helper to throw error with status
export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

// JWT Decode Helper
const decodeJwt = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        if (typeof window !== 'undefined') {
            return JSON.parse(window.atob(base64));
        } else {
            return JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
        }
    } catch (e) {
        return null;
    }
};

const isTokenExpired = (token: string): boolean => {
    const decoded = decodeJwt(token);
    if (!decoded || !decoded.exp) return true;
    // Buffer 10s to be safe
    return Date.now() >= decoded.exp * 1000 - 10000;
};

// Concurrency handling for refresh token
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

/**
 * ✅ Updated: Refresh token using HttpOnly Cookie
 */
const performRefreshToken = async (store: any): Promise<string> => {
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        });
    }

    isRefreshing = true;

    try {
        // ✅ Gọi refresh API (sử dụng HttpOnly Cookie)
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
            credentials: 'include', // ✅ Quan trọng
            headers: { "Content-Type": "application/json" },
            // ❌ Không gửi body nữa
        });

        if (!refreshRes.ok) throw new Error("Refresh failed");

        const refreshResponse = await refreshRes.json();

        // ✅ Update store (không có refreshToken nữa)
        store.updateTokens(refreshResponse.user, refreshResponse.accessToken);
        processQueue(null, refreshResponse.accessToken);

        return refreshResponse.accessToken;
    } catch (error) {
        processQueue(error as Error, null);
        store.logout();
        throw error;
    } finally {
        isRefreshing = false;
    }
};

/**
 * ✅ Authenticated Fetch với HttpOnly Cookie support
 */
export const authenticatedFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const { useAuthStore } = await import("@/stores/authStore");
    const store = useAuthStore.getState();
    let token = store.accessToken;

    const getHeaders = (t: string | null) => ({
        "Content-Type": "application/json",
        ...options.headers,
        ...(t ? { "Authorization": `Bearer ${t}` } : {}),
    });

    // ✅ Always include credentials for cookies
    const fetchOptions = {
        ...options,
        credentials: 'include' as RequestCredentials,
    };

    // 1. Check expiration BEFORE request
    if (token && isTokenExpired(token)) {
        // If already refreshing, wait for it
        if (isRefreshing) {
            try {
                token = await new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                });
            } catch (error) {
                throw new ApiError("Session expired", 401);
            }
        } else {
            // Start refresh process
            try {
                token = await performRefreshToken(store);
            } catch (error) {
                throw new ApiError("Session expired", 401);
            }
        }
    }

    let res = await fetch(`${BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers: getHeaders(token),
    });

    // 2. Check 401 AFTER request (in case token was revoked or expiration check failed)
    if (res.status === 401) {
        // If already refreshing, wait for it
        if (isRefreshing) {
            try {
                token = await new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                });
                // Retry with new token
                res = await fetch(`${BASE_URL}${endpoint}`, {
                    ...fetchOptions,
                    headers: getHeaders(token),
                });
            } catch (error) {
                throw new ApiError("Session expired", 401);
            }
        } else {
            // Start refresh process
            try {
                token = await performRefreshToken(store);
                // Retry with new token
                res = await fetch(`${BASE_URL}${endpoint}`, {
                    ...fetchOptions,
                    headers: getHeaders(token),
                });
            } catch (error) {
                throw new ApiError("Session expired", 401);
            }
        }
    }

    return res;
};
