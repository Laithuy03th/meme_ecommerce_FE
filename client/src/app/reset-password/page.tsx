"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

const ResetPasswordPage = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [showPassword, setShowPassword] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successfully</h2>
                    <p className="text-gray-600 mb-8">
                        Your password has been updated. You can now log in with your new password.
                    </p>
                    <Link
                        href="/login"
                        className="block w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="mb-8">
                    <Link href="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
                    <p className="text-gray-600">Enter your new password below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors pl-11"
                                placeholder="••••••••"
                                required
                            />
                            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors pl-11"
                                placeholder="••••••••"
                                required
                            />
                            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
