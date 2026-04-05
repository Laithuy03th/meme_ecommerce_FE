"use client";

import { getMe } from "@/services/api/authApi";
import { refreshToken as refreshTokenAPI } from "@/services/api/authApi";
import { useAuthStore } from "@/stores/authStore";
import useCartStore from "@/stores/cartStore";
import useWishlistStore from "@/stores/wishlistStore";
import { useEffect } from "react";

/**
 * AuthInitializer - Kiểm tra và khôi phục session khi app load
 * Với HttpOnly Cookie auth, refresh token không cần trong store
 */
const AuthInitializer = () => {
    const { login, logout, accessToken, updateTokens } = useAuthStore();

    useEffect(() => {
        const initAuth = async () => {
            // If we have an access token, verify it
            if (accessToken) {
                try {
                    // Verify current token
                    await getMe(accessToken);

                    // Token valid - fetch user data
                    useCartStore.getState().fetchCart();
                    useWishlistStore.getState().fetchWishlist();
                } catch (error: any) {
                    // Token invalid/expired - try refresh
                    console.log('Access token expired, attempting refresh...');

                    try {
                        // Gọi refresh (sử dụng HttpOnly Cookie)
                        const refreshData = await refreshTokenAPI();

                        // Update với token mới
                        updateTokens(refreshData.user, refreshData.accessToken);

                        // Fetch data với token mới
                        useCartStore.getState().fetchCart();
                        useWishlistStore.getState().fetchWishlist();

                        console.log('Token refreshed successfully');
                    } catch (refreshError) {
                        // Refresh failed - logout
                        console.error("Token refresh failed:", refreshError);
                        logout();
                    }
                }
            } else {
                // No access token - try silent refresh with cookie
                // Trường hợp: Cookie còn hạn nhưng store bị clear
                try {
                    const refreshData = await refreshTokenAPI();
                    updateTokens(refreshData.user, refreshData.accessToken);
                    useCartStore.getState().fetchCart();
                    useWishlistStore.getState().fetchWishlist();
                    console.log('Session restored from cookie');
                } catch (error) {
                    // No valid session — user chưa đăng nhập, không phải lỗi
                    console.log('No valid session found, user needs to login');
                }
            }
        };

        initAuth();
        // Removed refreshToken from dependencies (không còn tồn tại)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Chỉ chạy 1 lần khi mount — Zustand actions stable, không cần trong deps

    return null;
};

export default AuthInitializer;
