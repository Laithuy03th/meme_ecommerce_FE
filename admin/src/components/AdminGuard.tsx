"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";

interface User {
    id: number;
    email: string;
    fullName?: string;
    roles: string[];
}

export function AdminGuard({
    children,
    defaultOpen = true
}: {
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Skip check for login page
        if (pathname === '/login') {
            setAuthorized(true);
            return;
        }

        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('accessToken');

        // No user or token logged in
        if (!userStr || !token) {
            router.push('/login');
            return;
        }

        try {
            const userData: User = JSON.parse(userStr);

            // User is not admin
            if (!userData.roles || (!userData.roles.includes('ADMIN') && !userData.roles.includes('ROLE_ADMIN'))) {
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                router.push('/login');
                return;
            }

            setUser(userData);
            setAuthorized(true);
        } catch (e) {
            // Invalid user data
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            router.push('/login');
        }
    }, [router, pathname]);

    // Show loading while checking (except on login page where we show content immediately)
    if (!authorized && pathname !== '/login') {
        return (
            <div className="flex items-center justify-center min-h-screen w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
        );
    }

    // Login page: Full screen, no layout
    if (pathname === '/login') {
        return <main className="w-full h-screen flex items-center justify-center bg-background">{children}</main>;
    }

    // Admin Dashboard Layout
    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar user={user} />
            <main className="w-full bg-muted/40 min-h-screen">
                <Navbar user={user} />
                <div className="p-6">{children}</div>
            </main>
        </SidebarProvider>
    );
}
