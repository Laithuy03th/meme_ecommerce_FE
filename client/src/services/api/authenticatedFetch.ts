/**
 * Authenticated Fetch Wrapper với Auto Token Refresh (Đã sửa lỗi Queueing)
 */
import { refreshToken } from './authApi';
import { useAuthStore } from '@/stores/authStore';

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const state = useAuthStore.getState();
    let accessToken = state.accessToken;

    const getHeaders = (token: string | null) => {
        const headers = new Headers(options.headers);
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    };

    // Luôn include credentials để gửi cookie
    const fetchOptions: RequestInit = {
        ...options,
        credentials: 'include',
    };

    // 1. Request lần đầu
    let response = await fetch(url, { ...fetchOptions, headers: getHeaders(accessToken) });

    // 2. Nếu gặp 401 -> Xử lý Refresh Token
    if (response.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;
            // Tạo promise refresh dùng chung cho tất cả request đang chờ
            refreshPromise = refreshToken()
                .then((data) => {
                    // Update store
                    state.updateTokens(data.user, data.accessToken);
                    return data.accessToken;
                })
                .catch((error) => {
                    console.error('RefreshToken failed:', error);
                    state.logout();

                    // Redirect login nếu cần
                    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
                    }
                    throw error;
                })
                .finally(() => {
                    isRefreshing = false;
                    refreshPromise = null;
                });
        }

        try {
            // Tất cả request 401 đều phải CHỜ refreshPromise hoàn tất
            const newAccessToken = await refreshPromise;

            // Retry request với token mới
            response = await fetch(url, {
                ...fetchOptions,
                headers: getHeaders(newAccessToken)
            });

        } catch (error) {
            // Nếu refresh thất bại, ném lỗi ra ngoài (hoặc trả về response 401 cũ)
            throw new Error('Session expired');
        }
    }

    return response;
};