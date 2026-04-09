"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/services/authApi";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Lock, Mail, Command, Leaf, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const user = localStorage.getItem("user");
        if (token && user) {
            router.push("/");
        }
    }, [router]);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        setLoading(true);
        try {
            const data = await login({ email, password });

            // Backend automatically sets refreshToken cookie with path=/admin
            // We only need to store accessToken in localStorage
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("user", JSON.stringify(data.user));

            toast.success("Đăng nhập thành công!");

            if (data.user.roles?.includes("ADMIN")) {
                router.push("/");
            } else {
                toast.error("Bạn không có quyền truy cập Admin!");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Đăng nhập thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen grid lg:grid-cols-2 overflow-hidden bg-white">
            {/* LEFT SIDE: Visuals & Branding (Mint Pastel Theme) */}
            <div className="hidden lg:flex flex-col justify-between relative bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-10 lg:p-12 overflow-hidden">
                {/* Decorative Blobs (Hiệu ứng nền loang màu) */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-teal-200/30 rounded-full blur-[80px] mix-blend-multiply" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[80px] mix-blend-multiply" />

                {/* Logo Area */}
                <div className="relative z-10 flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
                        <Command className="h-6 w-6" />
                    </div>
                    <span className="text-xl font-bold text-teal-900 tracking-tight">MemeShop Admin</span>
                </div>

                {/* Main Visual Content */}
                <div className="relative z-10 space-y-6 max-w-lg">
                    <div className="inline-flex items-center rounded-full border border-teal-200 bg-white/60 px-3 py-1 text-sm text-teal-800 backdrop-blur-md shadow-sm">
                        <Leaf className="mr-2 h-3.5 w-3.5 text-teal-500" />
                        <span className="font-medium">Hệ thống quản lý v2.0</span>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold text-slate-800 leading-[1.2]">
                            Quản lý cửa hàng <br />
                            <span className="text-teal-600">Dễ dàng & Hiệu quả</span>
                        </h2>
                        <p className="text-lg text-slate-600 font-light leading-relaxed">
                            Chào mừng quay trở lại. Hãy đăng nhập để theo dõi đơn hàng, quản lý kho và xem báo cáo doanh thu mới nhất.
                        </p>
                    </div>

                    {/* Decorative Elements (Glass card) */}
                    <div className="mt-8 p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm w-3/4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 w-3/4 bg-slate-300/50 rounded-full" />
                            <div className="h-2 w-1/2 bg-slate-300/50 rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm font-medium text-teal-800/60">
                    © 2025 MemeShop Inc.
                </div>
            </div>

            {/* RIGHT SIDE: Login Form (Clean White) */}
            <div className="flex items-center justify-center bg-white p-8 lg:p-12">
                <div className="w-full max-w-[400px] space-y-8">

                    {/* Header Mobile */}
                    <div className="lg:hidden flex flex-col items-center mb-6 space-y-2">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
                            <Command className="h-6 w-6" />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900">MemeShop Admin</h1>
                    </div>

                    <div className="text-center lg:text-left space-y-2">
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                            Chào mừng trở lại! 👋
                        </h1>
                        <p className="text-slate-500">
                            Nhập thông tin xác thực để truy cập Dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="admin@memeshop.com"
                                        required
                                        className="pl-10 h-11 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all rounded-xl"
                                        defaultValue="admin@example.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-slate-700 font-medium">Mật khẩu</Label>
                                    <a href="#" className="text-xs font-medium text-teal-600 hover:text-teal-700 hover:underline">
                                        Quên mật khẩu?
                                    </a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="pl-10 h-11 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all rounded-xl"
                                        defaultValue="123456"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <div className="flex items-center">
                                    Đăng nhập <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-slate-400 font-medium">
                                Hoặc tiếp tục với
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Placeholder Buttons for OAuth - Chỉ để trang trí layout */}
                        <Button variant="outline" className="h-11 border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl">
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-63.5 0-14 5-25.5 13.2-34.3-1.3-3.5-5.7-16.2 1.2-33.9 0 0 10.5-3.6 34.4 12.2 10-2.8 20.8-4.3 30.8-4.3 10 0 20.8 1.5 30.8 4.3 23.9-15.8 34.4-12.2 34.4-12.2 6.9 17.7 2.6 30.3 1.3 33.9 8.1 8.8 13.2 20.3 13.2 34.3 0 49.4-56.5 57.3-111.5 63.2 9 7.7 17.2 23 17.2 47 0 34-.3 61.3-.3 69.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>
                            GitHub
                        </Button>
                        <Button variant="outline" className="h-11 border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl">
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                            Google
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}