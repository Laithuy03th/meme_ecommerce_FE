"use client";

import {
    User,
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

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

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
        // Implement logout logic here (clear tokens, etc.)
        setIsOpen(false);
        router.push("/login");
    };

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/account" },
        { icon: Package, label: "My Orders", href: "/account/orders" },
        { icon: MapPin, label: "Addresses", href: "/account/addresses" },
        { icon: Heart, label: "Wishlist", href: "/wishlist" },
        { icon: Settings, label: "Settings", href: "/account/settings" },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
            >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
                    {/* Placeholder Avatar */}
                    <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="User"
                        className="w-full h-full object-cover"
                    />
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="User"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">John Doe</p>
                                <p className="text-xs text-gray-500">john.doe@example.com</p>
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
