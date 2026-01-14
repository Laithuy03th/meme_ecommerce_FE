"use client";

import { useEffect, useState } from 'react';

interface User {
    id: number;
    email: string;
    fullName?: string;
    roles: string[];
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage first
        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                const parsedUser = JSON.parse(userJson);
                setUser(parsedUser);
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const isAdmin = user?.roles?.includes('ADMIN') || false;
    // In Admin app, we mostly care about isAdmin. 
    // But strictly speaking, everyone logged in here SHOULD be admin due to server-side checks.

    return {
        user,
        isAdmin,
        loading,
        isAuthenticated: !!user,
    };
}
