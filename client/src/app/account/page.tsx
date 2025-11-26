"use client";

import { Camera, Mail, Phone, User, Save } from "lucide-react";

const ProfilePage = () => {
    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                    <p className="text-gray-500 mt-1">Manage your personal information</p>
                </div>
                <div className="hidden sm:block">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Verified Account
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Stats */}
                <div className="space-y-6">
                    {/* Avatar Card */}
                    <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                        <div className="relative w-32 h-32 mx-auto mb-4 group cursor-pointer">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                                <img
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">John Doe</h3>
                        <p className="text-sm text-gray-500 mb-4">Member since 2023</p>
                        <button className="text-sm text-primary font-medium hover:underline">
                            Change Profile Photo
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-4">Account Overview</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-gray-500 text-sm">Total Orders</span>
                                <span className="font-bold text-gray-900">12</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-gray-500 text-sm">Total Spent</span>
                                <span className="font-bold text-gray-900">$1,234.56</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-500 text-sm">Membership</span>
                                <span className="font-bold text-primary">Gold</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Forms */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Personal Info Form */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                        </div>
                        <form className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                                    <input
                                        type="text"
                                        defaultValue="John"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Doe"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            defaultValue="john@example.com"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            defaultValue="+1 234 567 890"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20">
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
