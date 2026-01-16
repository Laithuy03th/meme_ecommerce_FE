"use client";

import Link from "next/link";
import { forgotPassword } from "@/services/api/authApi";
import { useState } from "react";
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get("email") as string;

        try {
            await forgotPassword(email);
            setIsSent(true);
            toast.success("Reset link sent to your email!");
        } catch (error: any) {
            toast.error(error.message || "Failed to send reset link");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset Password</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your email to receive instructions
                    </p>
                </div>

                {!isSent ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-colors"
                                    placeholder="Email address"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-70"
                            >
                                {isLoading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="mt-8 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">
                            Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                        </p>
                        <button
                            onClick={() => setIsSent(false)}
                            className="text-primary hover:text-primary-dark font-medium"
                        >
                            Try another email
                        </button>
                    </div>
                )}

                <div className="text-center mt-4">
                    <Link href="/login" className="font-medium text-gray-600 hover:text-gray-900">
                        Back to Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
