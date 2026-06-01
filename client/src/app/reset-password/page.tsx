"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, ArrowLeft, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { BASE_URL } from "@/services/api/base";

/* ──────────────────────────────────────────────
   Gọi API reset password
────────────────────────────────────────────── */
const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Đặt lại mật khẩu thất bại");
    }
};

/* ──────────────────────────────────────────────
   Content component (cần Suspense vì useSearchParams)
────────────────────────────────────────────── */
const ResetPasswordContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [succeeded, setSucceeded] = useState(false);

    // BUG FIX: Không có token → hiển thị lỗi rõ ràng thay vì cho submit form vô nghĩa
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40 px-4">
                <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-8 text-center">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-7 h-7 text-red-500" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-2">Link không hợp lệ</h2>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.
                    </p>
                    <Link
                        href="/forgot-password"
                        className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25 transition-all"
                    >
                        Yêu cầu link mới
                    </Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData(e.target as HTMLFormElement);
        const newPassword = fd.get("password") as string;
        const confirmPassword = fd.get("confirm") as string;

        // BUG FIX: Validate confirm password ở phía client trước khi gọi API
        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Mật khẩu phải có ít nhất 8 ký tự");
            return;
        }

        setIsLoading(true);
        try {
            // BUG FIX: Gọi API thực sự với token từ URL và mật khẩu mới
            await resetPassword(token, newPassword);
            setSucceeded(true);
            toast.success("Đặt lại mật khẩu thành công! 🎉");
        } catch (err: any) {
            if (err.message?.toLowerCase().includes("expired") || err.message?.toLowerCase().includes("used")) {
                toast.error("Link đã hết hạn hoặc đã được dùng. Vui lòng yêu cầu link mới.");
            } else {
                toast.error(err.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (succeeded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40 px-4">
                <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-8 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Đặt lại mật khẩu thành công!</h2>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                        Mật khẩu của bạn đã được cập nhật. Hãy đăng nhập với mật khẩu mới.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25 transition-all"
                    >
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40" />
            <div className="fixed -top-1/4 -left-1/4 w-[60%] h-[60%] rounded-full bg-gradient-to-br from-indigo-300/15 to-violet-300/15 blur-3xl -z-10 animate-pulse" />

            <div className="w-full max-w-md">
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium mb-6 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Quay lại đăng nhập
                </Link>

                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10 border border-white p-8 sm:p-10">
                    <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-6">
                        <Lock className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-2">Đặt lại mật khẩu</h1>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                        Nhập mật khẩu mới của bạn. Mật khẩu phải có ít nhất 8 ký tự.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* New Password */}
                        <div className="group">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Mật khẩu mới
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="group">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Xác nhận mật khẩu mới
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    name="confirm"
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] relative overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Đặt lại mật khẩu"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-slate-400 mt-6">
                    🔒 Link đặt lại mật khẩu có hiệu lực trong 30 phút
                </p>
            </div>
        </div>
    );
};

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
