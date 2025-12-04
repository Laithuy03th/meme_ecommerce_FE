/**
 * Authenticated Fetch Wrapper với Auto Token Refresh
 * 
 * Automatically handles 401 errors và refresh access token
 * sử dụng HttpOnly Cookie refresh token
 */

import { refreshToken } from './authApi';
import { useAuthStore } from '@/stores/authStore';

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

/**
 * Wrapper around fetch that automatically refreshes token on 401
 */
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const state = useAuthStore.getState();
    const accessToken = state.accessToken;

    // Add auth header if we have token
    const headers = new Headers(options.headers);
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    // Always include credentials for cookies
    const fetchOptions: RequestInit = {
        ...options,
        headers,
        credentials: 'include', // ✅ Important for HttpOnly Cookie
    };

    // Make initial request
    let response = await fetch(url, fetchOptions);

    // If 401, try to refresh token
    if (response.status === 401 && !isRefreshing) {
        try {
            // Prevent multiple simultaneous refresh calls
            if (!refreshPromise) {
                isRefreshing = true;
                refreshPromise = refreshToken();
            }

            // Wait for refresh to complete
            const refreshData = await refreshPromise;

            // Update store with new token
            state.updateTokens(refreshData.user, refreshData.accessToken);

            // Retry original request with new token
            headers.set('Authorization', `Bearer ${refreshData.accessToken}`);
            response = await fetch(url, { ...fetchOptions, headers });

        } catch (error) {
            // Refresh failed - logout user
            console.error('Token refresh failed:', error);
            state.logout();

            // Redirect to login if not already there
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = `/login?redirect=${window.location.pathname}`;
            }

            throw new Error('Authentication expired. Please login again.');
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    }

    return response;
};

/**
 * Helper for JSON API calls with auto-refresh
 */
export const authenticatedFetchJSON = async <T = any>(url: string, options: RequestInit = {}): Promise<T> => {
    const response = await authenticatedFetch(url, options);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
};
