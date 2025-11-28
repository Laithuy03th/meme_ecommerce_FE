export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// Helper to throw error with status
export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

// Helper for authenticated requests with interceptor
export const authenticatedFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const { useAuthStore } = await import("@/stores/authStore");
    const store = useAuthStore.getState();
    let token = store.accessToken;

    const getHeaders = (t: string | null) => ({
        "Content-Type": "application/json",
        ...options.headers,
        ...(t ? { "Authorization": `Bearer ${t}` } : {}),
    });

    let res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: getHeaders(token),
    });

    if (res.status === 401) {
        const refreshTokenStr = store.refreshToken;
        if (!refreshTokenStr) {
            store.logout();
            throw new ApiError("Session expired", 401);
        }

        try {
            // Attempt to refresh token
            // Direct fetch to avoid circular dependency with authApi.ts
            const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: refreshTokenStr }),
            });

            if (!refreshRes.ok) throw new Error("Refresh failed");

            const refreshResponse = await refreshRes.json();

            // Update store with new tokens
            store.login(refreshResponse.user, refreshResponse.accessToken, refreshResponse.refreshToken);

            // Retry original request with new token
            res = await fetch(`${BASE_URL}${endpoint}`, {
                ...options,
                headers: getHeaders(refreshResponse.accessToken),
            });
        } catch (error) {
            // Refresh failed
            store.logout();
            throw new ApiError("Session expired", 401);
        }
    }

    return res;
};
