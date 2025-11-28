"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { BASE_URL } from "@/services/api"; // Ensure BASE_URL is exported from api.ts or define it here

const AuthInitializer = () => {
    const { accessToken, refreshToken, login, logout } = useAuthStore();

    useEffect(() => {
        const initAuth = async () => {
            if (!accessToken) return;

            try {
                // Verify token and get latest user data
                const res = await fetch(`${BASE_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                if (res.ok) {
                    const userData = await res.json();
                    // Update user data in store (keep existing tokens)
                    if (refreshToken) {
                        login(userData, accessToken, refreshToken);
                    }
                } else if (res.status === 401) {
                    // Token expired, try to refresh
                    if (refreshToken) {
                        try {
                            const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ refreshToken }),
                            });

                            if (refreshRes.ok) {
                                const data = await refreshRes.json();
                                login(data.user, data.accessToken, data.refreshToken);
                            } else {
                                logout();
                            }
                        } catch (error) {
                            logout();
                        }
                    } else {
                        logout();
                    }
                }
            } catch (error) {
                console.error("Auth check failed", error);
                // Don't logout immediately on network error, maybe just let it be
            }
        };

        initAuth();
    }, [accessToken, refreshToken, login, logout]);

    return null; // This component doesn't render anything
};

export default AuthInitializer;
