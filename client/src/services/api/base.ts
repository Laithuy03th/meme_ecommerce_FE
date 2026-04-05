export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

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
    return Date.now() >= decoded.exp * 1000 - 10000; // 10s buffer
};

// Concurrency Lock
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
 * Bug #1 Fix: Redirect về /login khi refresh thất bại, không để caller tự xử lý.
 */
const redirectToLogin = () => {
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
};

/**
 * Bug #2 Fix: Không nhận `store` từ tham số — luôn gọi getState() tươi bên trong hàm.
 */
const performRefreshToken = async (): Promise<string> => {
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        });
    }

    isRefreshing = true;

    try {
        // Bug #5 Fix: /auth/refresh không cần Content-Type (không có body)
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
            credentials: 'include',
        });

        if (!refreshRes.ok) throw new Error("Refresh failed");

        const data = await refreshRes.json();

        // Bug #2 Fix: Lấy store tươi tại thời điểm cần dùng
        const { useAuthStore } = await import("@/stores/authStore");
        useAuthStore.getState().updateTokens(data.user, data.accessToken);

        processQueue(null, data.accessToken);
        return data.accessToken;

    } catch (error) {
        processQueue(error as Error, null);

        // Bug #1 Fix: Logout + redirect ngay tại đây
        const { useAuthStore } = await import("@/stores/authStore");
        useAuthStore.getState().logout();
        redirectToLogin();

        throw error;
    } finally {
        isRefreshing = false;
    }
};

/**
 * Authenticated Fetch với HttpOnly Cookie support.
 * Fixes: Bug #1, #2, #3, #4, #5
 */
export const authenticatedFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    // Bug #2 Fix: Luôn lấy state tươi qua helper, không cache store từ đầu hàm
    const getFreshStore = async () => {
        const { useAuthStore } = await import("@/stores/authStore");
        return useAuthStore.getState();
    };

    const store = await getFreshStore();
    let token = store.accessToken;

    // Bug #5 Fix: Chỉ set Content-Type khi request CÓ body
    const hasBody = options.body !== undefined && options.body !== null;
    const getHeaders = (t: string | null): Record<string, string> => ({
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(options.headers as Record<string, string>),
        ...(t ? { "Authorization": `Bearer ${t}` } : {}),
    });

    const fetchOptions: RequestInit = {
        ...options,
        credentials: 'include',
    };

    // Bug #4 Fix: Guard để tránh vòng lặp vô hạn khi /auth/refresh tự bị 401
    const isRefreshEndpoint = endpoint.includes('/auth/refresh');

    // Bước 1: Proactive check — refresh trước khi gửi nếu token sắp hết hạn
    if (token && isTokenExpired(token) && !isRefreshEndpoint) {
        try {
            token = await performRefreshToken();
        } catch (error) {
            throw new ApiError("Session expired", 401);
        }
    }

    // Bước 2: Gửi request với token hiện tại
    let res = await fetch(`${BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers: getHeaders(token),
    });

    // Bước 3: Reactive check — xử lý 401 từ server
    if (res.status === 401 && !isRefreshEndpoint) {
        // Bug #3 Fix: Nếu proactive refresh đã xảy ra (token mới khác token cũ trong store),
        // mà server vẫn 401 → user bị ban/revoked → không retry nữa
        const tokenWasRefreshed = token !== store.accessToken;
        if (tokenWasRefreshed) {
            const freshStore = await getFreshStore();
            freshStore.logout();
            redirectToLogin();
            throw new ApiError("Account suspended or session revoked", 401);
        }

        try {
            token = await performRefreshToken();
            res = await fetch(`${BASE_URL}${endpoint}`, {
                ...fetchOptions,
                headers: getHeaders(token),
            });

            // Nếu retry vẫn 401 → dừng lại, không loop
            if (res.status === 401) {
                throw new ApiError("Unauthorized after token refresh", 401);
            }
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Session expired", 401);
        }
    }

    return res;
};
