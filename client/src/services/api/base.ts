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

const performRefreshToken = async (store: any): Promise<string> => {
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        });
    }

    const refreshTokenStr = store.refreshToken;
    if (!refreshTokenStr) {
        throw new ApiError("No refresh token available", 401);
    }

    isRefreshing = true;

    try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: refreshTokenStr }),
        });

        if (!refreshRes.ok) throw new Error("Refresh failed");

        const refreshResponse = await refreshRes.json();

        // Use updateTokens instead of login to avoid side effects
        store.updateTokens(refreshResponse.user, refreshResponse.accessToken, refreshResponse.refreshToken);
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

export const authenticatedFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const { useAuthStore } = await import("@/stores/authStore");
    const store = useAuthStore.getState();
    let token = store.accessToken;

    const getHeaders = (t: string | null) => ({
        "Content-Type": "application/json",
        ...options.headers,
        ...(t ? { "Authorization": `Bearer ${t}` } : {}),
    });

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
        ...options,
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
                    ...options,
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
                    ...options,
                    headers: getHeaders(token),
                });
            } catch (error) {
                throw new ApiError("Session expired", 401);
            }
        }
    }

    return res;
};
