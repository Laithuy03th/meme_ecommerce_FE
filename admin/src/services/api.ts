import { refreshToken } from "./authApi";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// Helper to throw error with status
export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

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
 * Helper to check and limit running one refresh token request at a time
 */
const performRefreshToken = async (): Promise<string> => {
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        });
    }

    isRefreshing = true;

    try {
        // Call refresh API from authApi
        const refreshResponse = await refreshToken();

        if (!refreshResponse || !refreshResponse.accessToken) {
            throw new Error("No access token returned");
        }

        const newAccessToken = refreshResponse.accessToken;

        // Update localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", newAccessToken);
            if (refreshResponse.user) {
                localStorage.setItem("user", JSON.stringify(refreshResponse.user));
            }
        }

        processQueue(null, newAccessToken);
        return newAccessToken;
    } catch (error) {
        processQueue(error as Error, null);

        // Logout handling
        if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            // Only redirect if not already on login page to avoid loops
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }
        throw error;
    } finally {
        isRefreshing = false;
    }
};

/**
 * Helper to get token (server-side only for now, or client-side if needed)
 */
const getToken = async () => {
    if (typeof window === "undefined") {
        // Server-side - dynamic import to avoid client component errors
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        return cookieStore.get("accessToken")?.value;
    } else {
        // Client-side
        return localStorage.getItem("accessToken");
    }
};

export const authenticatedFetch = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    // Get token
    let token = await getToken();

    const getHeaders = (t: string | null | undefined) => {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...(options.headers as Record<string, string>),
        };
        if (t) {
            headers["Authorization"] = `Bearer ${t}`;
        }
        return headers;
    };

    const fetchOptions = {
        ...options,
        credentials: "include" as RequestCredentials,
    };

    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

    try {
        let res = await fetch(url, {
            ...fetchOptions,
            headers: getHeaders(token),
        });

        // Check 401
        if (res.status === 401) {
            // Handle Server Side 401
            if (typeof window === "undefined") {
                // For now, simpler to just throw/redirect rather than complex server-refresh
                const { redirect } = await import("next/navigation");
                // We can't easily refresh token on server without manually handling cookies
                // So we opt to redirect to login if session expires on server
                // Note: redirect() throws a NEXT_REDIRECT error, so it stops execution
                // But we should be careful inside a try/catch block for API calls
                redirect("/login");
            }

            // If this was a refresh attempt that failed, don't retry
            if (endpoint.includes("/auth/refresh")) {
                throw new ApiError("Session expired", 401);
            }

            try {
                // Perform refresh token protocol (Client Side mostly)
                if (typeof window !== "undefined") {
                    const newToken = await performRefreshToken();

                    // Retry request with new token
                    res = await fetch(url, {
                        ...fetchOptions,
                        headers: getHeaders(newToken),
                    });
                } else {
                    // Server side: If token expired, we might try to refresh if we had the refresh token cookie... 
                    // But for now let's fail gracefully or rely on client to refresh
                    throw new ApiError("Session expired (Server)", 401);
                }
            } catch (error) {
                if (typeof window !== "undefined") {
                    throw new ApiError("Session expired", 401);
                }
                // On Server, just propagate
                throw new ApiError("Session expired", 401);
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
            } catch (e) {
                // ignore json parse error
            }
            throw new ApiError(errorMessage, res.status);
        }

        return res.json();
    } catch (error) {
        throw error;
    }
};

export function buildQueryString(params: Record<string, any>): string {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.append(key, String(value));
        }
    });
    return query.toString();
}
