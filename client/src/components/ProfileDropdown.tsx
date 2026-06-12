"use client";

import {
    Smile,
    Package,
    Heart,
    Settings,
    LogOut,
    LayoutDashboard,
    MapPin
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "react-toastify";

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        router.push("/login");
        toast.info("Logged out successfully");
    };

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/account" },
        { icon: Package, label: "My Orders", href: "/account/orders" },
        { icon: MapPin, label: "Addresses", href: "/account/addresses" },
        { icon: Heart, label: "Wishlist", href: "/wishlist" },
        { icon: Settings, label: "Settings", href: "/account/settings" },
    ];

    // Prevent hydration mismatch
    if (!isMounted) {
        return (
            <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="flex items-center gap-1.5">
                <Link
                    href="/login"
                    className="relative flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-full overflow-hidden shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 group hover:-translate-y-0.5"
                >
                    <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                    <Smile className="relative z-10 w-4 h-4 text-white group-hover:animate-bounce" />
                    <span className="relative z-10 whitespace-nowrap">Đăng nhập</span>
                </Link>
            </div>
        );
    }


    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none ring-2 ring-transparent focus:ring-gray-100"
            >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden relative">
                    {user.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt={user.fullName || "User"}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                        </div>
                    )}
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 relative">
                                {user.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.fullName || "User"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                                    </div>
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-gray-900 truncate">{user.fullName}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="px-2 py-2">
                        {menuItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-primary transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="border-t border-gray-100 my-1"></div>

                    {/* Logout */}
                    <div className="px-2 pb-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
