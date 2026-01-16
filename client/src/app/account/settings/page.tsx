"use client";

import { Shield, Bell, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { changePassword } from "@/services/api/authApi";
import { useAuthStore } from "@/stores/authStore";

const SettingsPage = () => {
    const { accessToken } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!accessToken) {
            toast.error("You must be logged in to change password");
            return;
        }

        setIsLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const oldPassword = formData.get("oldPassword") as string;
        const newPassword = formData.get("newPassword") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            await changePassword({ oldPassword, newPassword }, accessToken);
            toast.success("Password updated successfully");
            (e.target as HTMLFormElement).reset();
        } catch (error: any) {
            toast.error(error.message || "Failed to update password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="border-b border-gray-100 pb-6">
                <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
                <p className="text-gray-500 mt-1">Manage your security and notification preferences</p>
            </div>

            {/* Security Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-gray-900">Security</h3>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Change Password</h4>
                        <form onSubmit={handlePasswordChange}>
                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                                    <input
                                        name="oldPassword"
                                        type="password"
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                                        <input
                                            name="newPassword"
                                            type="password"
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                                        <input
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-gray-900 text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-70 flex items-center gap-2"
                                >
                                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Notifications Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="font-medium text-gray-900">Order Updates</p>
                            <p className="text-sm text-gray-500">Receive emails about your order status</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                    <div className="border-t border-gray-50 my-2"></div>
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="font-medium text-gray-900">Promotions</p>
                            <p className="text-sm text-gray-500">Receive emails about new products and sales</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SettingsPage;
