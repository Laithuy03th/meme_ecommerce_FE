"use client";

import { Shield, Bell } from "lucide-react";

const SettingsPage = () => {
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
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                                <input type="password" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="••••••••" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                                    <input type="password" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                                    <input type="password" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="••••••••" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button className="bg-gray-900 text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
                                Update Password
                            </button>
                        </div>
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
