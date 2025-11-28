"use client";

import { getMe } from "@/services/api/authApi";
import { BASE_URL } from "@/services/api/base";
import { useAuthStore } from "@/stores/authStore";
import useCartStore from "@/stores/cartStore";
import useWishlistStore from "@/stores/wishlistStore";
import { useEffect } from "react";

const AuthInitializer = () => {
    const { login, logout, accessToken, refreshToken } = useAuthStore();

    useEffect(() => {
        const initAuth = async () => {
            // If we have an access token, verify it
            if (accessToken) {
                try {
                    await getMe(accessToken);
                    // If successful, fetch cart and wishlist
                    useCartStore.getState().fetchCart();
                    useWishlistStore.getState().fetchWishlist();
                } catch (error: any) {
                    // If 401, try to refresh
                    if (error.status === 401 && refreshToken) {
                        try {
                            // Manual refresh call to avoid circular dependency in interceptor if possible,
                            // or just rely on the interceptor if it handles it. 
                            // But here we want to explicitly check validity on load.
                            const refreshRes = await fetch(`${BASE_URL} /auth/refresh`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ refreshToken }),
                            });

                            if (refreshRes.ok) {
                                const data = await refreshRes.json();
                                login(data.user, data.accessToken, data.refreshToken);
                                useCartStore.getState().fetchCart();
                                useWishlistStore.getState().fetchWishlist();
                            } else {
                                logout();
                            }
                        } catch (refreshError) {
                            console.error("Token refresh failed", refreshError);
                            logout();
                        }
                    } else {
                        // Other errors or no refresh token
                        logout();
                    }
                }
            }
        };

        initAuth();
    }, [login, logout, accessToken, refreshToken]);

    return null;
};

export default AuthInitializer;
