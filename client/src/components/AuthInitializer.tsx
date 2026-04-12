"use client";

import { getMe } from "@/services/api/authApi";
import { refreshToken as refreshTokenAPI } from "@/services/api/authApi";
import { useAuthStore } from "@/stores/authStore";
import useCartStore from "@/stores/cartStore";
import useWishlistStore from "@/stores/wishlistStore";
import { useEffect } from "react";

/**
 * AuthInitializer - Kiểm tra và khôi phục session khi app load
 *

 * Luồng hợp lệ duy nhất:
 *   1. accessToken có trong Zustand store (persist từ localStorage) → verify rồi dùng.
 *   2. accessToken không có → user chưa đăng nhập trên app này → KHÔNG auto-login từ cookie.
 */
const AuthInitializer = () => {
    const { logout: storeLogout, accessToken, updateTokens } = useAuthStore();

    useEffect(() => {
        const initAuth = async () => {
            if (!accessToken) {
                // Không có token → user chưa login trên client app này.

                return;
            }

            // Có token trong store → verify xem còn hợp lệ không
            try {
                await getMe(accessToken);
                // Token hợp lệ → fetch dữ liệu
                useCartStore.getState().fetchCart();
                useWishlistStore.getState().fetchWishlist();
            } catch (error: any) {
                // Token hết hạn → thử refresh bằng HttpOnly Cookie
                console.log("Access token expired, attempting refresh...");
                try {
                    const refreshData = await refreshTokenAPI();
                    updateTokens(refreshData.user, refreshData.accessToken);
                    useCartStore.getState().fetchCart();
                    useWishlistStore.getState().fetchWishlist();
                    console.log("Token refreshed successfully");
                } catch (refreshError) {
                    // Refresh thất bại → logout sạch, user tự login lại
                    console.error("Token refresh failed, logging out:", refreshError);
                    storeLogout();
                }
            }
        };

        initAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};

export default AuthInitializer;
