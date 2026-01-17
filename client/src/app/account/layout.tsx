"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Package, MapPin, LogOut, Settings, Star } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    const links = [
        { name: "Profile", href: "/account", icon: User },
        { name: "Orders", href: "/account/orders", icon: Package },
        { name: "Reviews", href: "/account/reviews", icon: Star },
        { name: "Addresses", href: "/account/addresses", icon: MapPin },
        { name: "Settings", href: "/account/settings", icon: Settings },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                        <div className="p-6 bg-gray-50 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                {user?.avatarUrl ? (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                                        <img
                                            src={user.avatarUrl}
                                            alt={user.fullName || "User"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl font-bold text-primary border border-primary/10">
                                        {user?.fullName?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                )}
                                <div className="overflow-hidden">
                                    <p className="font-bold text-gray-900 truncate" title={user?.fullName}>{user?.fullName || "Guest"}</p>
                                    <p className="text-xs text-gray-500 truncate" title={user?.email}>{user?.email || "guest@example.com"}</p>
                                </div>
                            </div>
                        </div>
                        <nav className="p-2">
                            {links.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                            ? "bg-primary text-white font-medium shadow-md shadow-primary/20"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {link.name}
                                    </Link>
                                );
                            })}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors mt-2 cursor-pointer"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Content */}
                <div className="flex-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountLayout;
