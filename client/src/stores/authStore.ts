import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserType } from '@/types';
import { logout as apiLogout } from '@/services/api';

interface AuthState {
    user: UserType | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    login: (user: UserType, accessToken: string, refreshToken: string) => void;
    updateTokens: (user: UserType, accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            login: (user, accessToken, refreshToken) => {
                set({ user, accessToken, refreshToken, isAuthenticated: true });
                // Fetch cart from server
                const { fetchCart } = require('./cartStore').default.getState();
                fetchCart();
            },
            updateTokens: (user, accessToken, refreshToken) => {
                // Update tokens without side effects (used during token refresh)
                set({ user, accessToken, refreshToken, isAuthenticated: true });
            },
            logout: async () => {
                const token = get().accessToken;
                if (token) {
                    await apiLogout(token);
                }
                // Clear cart locally
                const { clearCart } = require('./cartStore').default.getState();
                clearCart();

                set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage', // unique name for localStorage
        }
    )
);
