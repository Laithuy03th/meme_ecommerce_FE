"use client";

import Link from "next/link";
import { forgotPassword } from "@/services/api/authApi";
import { useState } from "react";
import { toast } from "react-toastify";
import { Mail, ArrowLeft, Loader2, CheckCircle2, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [sentEmail, setSentEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get("email") as string;
        try {
            await forgotPassword(email);
            setSentEmail(email);
            setIsSent(true);
            toast.success("Link đặt lại mật khẩu đã được gửi!");
        } catch (error: any) {
            toast.error(error.message || "Không thể gửi email, vui lòng thử lại");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40" />
            <div className="fixed -top-1/4 -left-1/4 w-[60%] h-[60%] rounded-full bg-gradient-to-br from-indigo-300/15 to-violet-300/15 blur-3xl -z-10 animate-pulse" />
            <div className="fixed -bottom-1/4 -right-1/4 w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-pink-300/10 to-rose-200/10 blur-3xl -z-10" />

            <div className="w-full max-w-md">
                {/* Back link */}
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium mb-6 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Quay lại đăng nhập
                </Link>

                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10 border border-white p-8 sm:p-10">
                    {!isSent ? (
                        <>
                            {/* Icon */}
                            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-6">
                                <Mail className="w-7 h-7 text-white" />
                            </div>

                            <h1 className="text-2xl font-black text-slate-900 mb-2">Quên mật khẩu?</h1>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                                Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu ngay lập tức.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="group">
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Địa chỉ email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                            <Mail className="w-4.5 h-4.5" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            placeholder="you@example.com"
                                            className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 text-sm text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                                        />
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
                                        <>
                                            <span>Gửi link đặt lại mật khẩu</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        /* Success state */
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Email đã được gửi!</h2>
                            <p className="text-slate-500 text-sm leading-relaxed mb-2">
                                Chúng tôi đã gửi link đặt lại mật khẩu đến
                            </p>
                            <p className="font-semibold text-indigo-600 text-sm mb-6">{sentEmail}</p>
                            <p className="text-xs text-slate-400 mb-8">
                                Không thấy email? Kiểm tra thư mục spam hoặc{" "}
                                <button onClick={() => setIsSent(false)} className="text-indigo-600 hover:underline font-medium">
                                    thử email khác
                                </button>
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25 transition-all duration-300"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    )}
                </div>

                {/* Trust badge */}
                <p className="text-center text-xs text-slate-400 mt-6">
                    🔒 Thông tin của bạn được bảo mật hoàn toàn
                </p>
            </div>
        </div>
    );
}
