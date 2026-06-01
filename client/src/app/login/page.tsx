"use client";

import Link from "next/link";
import { useState, Suspense, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { login as apiLogin, register } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import {
    Mail, Lock, ArrowRight, Loader2, User, Phone,
    Eye, EyeOff, ShoppingBag, Sparkles, CheckCircle2
} from "lucide-react";

/* ──────────────────────────────────────────────
   Shared Input
────────────────────────────────────────────── */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: React.ReactNode;
    label: string;
    rightElement?: React.ReactNode;
    accentColor?: string;
}
const FloatingInput = ({
    icon, label, rightElement, accentColor = "indigo", ...props
}: InputProps) => {
    const accent = "focus:ring-primary/20 focus:border-primary focus:bg-white";

    return (
        <div className="group">
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    {icon}
                </div>
                <input
                    {...props}
                    className={`block w-full pl-11 ${rightElement ? "pr-11" : "pr-4"} py-3.5 border-2 border-slate-100 rounded-xl bg-slate-50/50 placeholder-slate-400 text-[15px] font-medium text-slate-900 focus:outline-none focus:ring-4 ${accent} transition-all duration-300 hover:border-slate-200`}
                />
                {rightElement && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                        {rightElement}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ──────────────────────────────────────────────
   Animated Background
────────────────────────────────────────────── */
const AnimatedBg = ({ mode }: { mode: "login" | "register" }) => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#fdfcfb]">
        {/* Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 via-white to-pink-50/40" />
        {/* Blobs */}
        <div
            className={`absolute -top-1/4 transition-all duration-1000 ease-in-out ${mode === "login" ? "-left-1/4" : "-right-1/4"} w-[60%] h-[60%] rounded-full bg-gradient-to-br from-primary/15 to-secondary/10 blur-[100px] animate-pulse-slow`}
        />
        <div
            className={`absolute -bottom-1/4 transition-all duration-1000 ease-in-out ${mode === "login" ? "-right-1/4" : "-left-1/4"} w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-secondary/15 to-primary/10 blur-[100px]`}
            style={{ animation: "pulse 6s ease-in-out infinite 2s" }}
        />
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
);

/* ──────────────────────────────────────────────
   Brand Panel (left side on desktop)
────────────────────────────────────────────── */
const BrandPanel = ({ mode }: { mode: "login" | "register" }) => {
    const features = [
        { icon: "🛍️", text: "Hàng nghìn sản phẩm meme độc đáo" },
        { icon: "🚀", text: "Giao hàng nhanh toàn quốc" },
        { icon: "💎", text: "Voucher & ưu đãi độc quyền mỗi ngày" },
        { icon: "🔒", text: "Thanh toán bảo mật & hoàn tiền dễ dàng" },
    ];
    return (
        <div className="hidden lg:flex flex-col justify-between h-full p-10 xl:p-14 relative z-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group w-fit">
                <div className="relative w-12 h-12 overflow-hidden rounded-2xl bg-gradient-to-tr from-primary to-secondary p-[2px] shadow-lg shadow-primary/20 group-hover:shadow-primary/40 group-hover:scale-105 transition-all duration-300">
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                        <span className="font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">M</span>
                    </div>
                </div>
                <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90 drop-shadow-sm">
                    MEMESHOP
                </span>
            </Link>

            {/* Hero */}
            <div>
                <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-bold mb-6 border border-white/30 shadow-sm">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        {mode === "login" ? "Chào mừng trở lại!" : "Tham gia cùng chúng tôi"}
                    </div>
                    <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-sm">
                        {mode === "login" ? (
                            <>Shopping<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-100">thông minh</span><br />hơn mỗi ngày</>
                        ) : (
                            <>Tạo tài khoản<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-100">miễn phí</span><br />ngay hôm nay</>
                        )}
                    </h1>
                    <p className="text-white/90 text-lg leading-relaxed font-medium">
                        {mode === "login"
                            ? "Đăng nhập để tiếp tục hành trình shopping của bạn với hàng nghìn sản phẩm độc đáo."
                            : "Đăng ký để nhận ưu đãi đặc biệt, theo dõi đơn hàng và nhiều hơn nữa."
                        }
                    </p>
                </div>

                {/* Features */}
                <div className="space-y-4">
                    {features.map((f, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/20 shadow-sm">
                                {f.icon}
                            </div>
                            <span className="text-white/95 text-[15px] font-bold tracking-wide">{f.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom */}
            <p className="text-white/70 text-sm font-semibold">
                © 2026 MemeShop. Mọi quyền được bảo lưu.
            </p>
        </div>
    );
};

/* ──────────────────────────────────────────────
   Password Strength Indicator
────────────────────────────────────────────── */
const PasswordStrength = ({ password }: { password: string }) => {
    const checks = [
        { label: "≥ 8 ký tự", ok: password.length >= 8 },
        { label: "Chữ hoa", ok: /[A-Z]/.test(password) },
        { label: "Chữ số", ok: /\d/.test(password) },
    ];
    if (!password) return null;
    return (
        <div className="flex gap-2 mt-1.5">
            {checks.map((c, i) => (
                <span key={i} className={`flex items-center gap-1 text-[11px] font-medium ${c.ok ? "text-emerald-600" : "text-slate-400"}`}>
                    <CheckCircle2 className={`w-3 h-3 ${c.ok ? "text-emerald-500" : "text-slate-300"}`} />
                    {c.label}
                </span>
            ))}
        </div>
    );
};

/* ──────────────────────────────────────────────
   LOGIN FORM
────────────────────────────────────────────── */
const LoginForm = ({ onSwitchToRegister }: { onSwitchToRegister: () => void }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const login = useAuthStore((s) => s.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const fd = new FormData(e.target as HTMLFormElement);
        try {
            const data = await apiLogin({
                email: fd.get("email") as string,
                password: fd.get("password") as string,
            });
            login(data.user, data.accessToken);
            toast.success(`Chào mừng trở lại, ${data.user.fullName?.split(" ").pop()}! 👋`);
            router.push(redirect || "/");
        } catch (err: any) {
            toast.error(err.message || "Email hoặc mật khẩu không đúng");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl xl:text-4xl font-black text-slate-900 mb-3 tracking-tight">Đăng nhập</h2>
                <p className="text-slate-600 text-base font-medium">
                    Chưa có tài khoản?{" "}
                    <button onClick={onSwitchToRegister} className="text-primary font-bold hover:text-secondary hover:underline underline-offset-4 transition-colors">
                        Tạo ngay miễn phí →
                    </button>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <FloatingInput
                    icon={<Mail className="w-4.5 h-4.5" />}
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                />

                <FloatingInput
                    icon={<Lock className="w-4.5 h-4.5" />}
                    label="Mật khẩu"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                    rightElement={
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="text-slate-400 hover:text-slate-600 transition-colors">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    }
                />

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="remember" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                        <span className="text-sm text-slate-600">Ghi nhớ đăng nhập</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm text-indigo-600 font-medium hover:text-indigo-700 hover:underline underline-offset-2 transition-colors">
                        Quên mật khẩu?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="group w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-pink-400 shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] relative overflow-hidden"
                >
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                    {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin relative z-10" />
                    ) : (
                        <div className="flex items-center gap-2 relative z-10">
                            <span className="text-[17px]">Đăng nhập</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                        </div>
                    )}
                </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">HOẶC TIẾP TỤC VỚI</span>
                <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 py-3.5 border-2 border-slate-100 bg-white rounded-xl text-[15px] font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-200 hover:shadow-sm transition-all duration-200 group">
                    <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </button>
                <button className="flex items-center justify-center gap-3 py-3.5 border-2 border-slate-100 bg-white rounded-xl text-[15px] font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-200 hover:shadow-sm transition-all duration-200 group">
                    <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                    GitHub
                </button>
            </div>
        </div>
    );
};

/* ──────────────────────────────────────────────
   REGISTER FORM
────────────────────────────────────────────── */
const RegisterForm = ({ onSwitchToLogin }: { onSwitchToLogin: () => void }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const fd = new FormData(e.target as HTMLFormElement);
        const pw = fd.get("password") as string;
        const cpw = fd.get("confirm-password") as string;
        if (pw !== cpw) {
            toast.error("Mật khẩu xác nhận không khớp!");
            setIsLoading(false);
            return;
        }
        try {
            await register({
                email: fd.get("email") as string,
                password: pw,
                fullName: fd.get("name") as string,
                phone: fd.get("phone") as string,
            });
            toast.success("Tạo tài khoản thành công! Hãy đăng nhập. 🎉");
            onSwitchToLogin();
        } catch (err: any) {
            toast.error(err.message || "Đăng ký thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl xl:text-4xl font-black text-slate-900 mb-3 tracking-tight">Tạo tài khoản</h2>
                <p className="text-slate-600 text-base font-medium">
                    Đã có tài khoản?{" "}
                    <button onClick={onSwitchToLogin} className="text-primary font-bold hover:text-secondary hover:underline underline-offset-4 transition-colors">
                        Đăng nhập ngay →
                    </button>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <FloatingInput
                    icon={<User className="w-4 h-4" />}
                    label="Họ và tên"
                    name="name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    required
                    accentColor="violet"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FloatingInput
                        icon={<Mail className="w-4 h-4" />}
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        accentColor="violet"
                    />
                    <FloatingInput
                        icon={<Phone className="w-4 h-4" />}
                        label="Số điện thoại"
                        name="phone"
                        type="tel"
                        placeholder="0901 234 567"
                        accentColor="violet"
                    />
                </div>

                <div>
                    <FloatingInput
                        icon={<Lock className="w-4 h-4" />}
                        label="Mật khẩu"
                        name="password"
                        type={showPwd ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        accentColor="violet"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        rightElement={
                            <button type="button" onClick={() => setShowPwd(!showPwd)}
                                className="text-slate-400 hover:text-slate-600 transition-colors">
                                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        }
                    />
                    <PasswordStrength password={password} />
                </div>

                <FloatingInput
                    icon={<Lock className="w-4 h-4" />}
                    label="Xác nhận mật khẩu"
                    name="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    accentColor="violet"
                    rightElement={
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                            className="text-slate-400 hover:text-slate-600 transition-colors">
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    }
                />

                <p className="text-xs text-slate-400 leading-relaxed">
                    Bằng cách đăng ký, bạn đồng ý với{" "}
                    <Link href="/terms" className="text-indigo-600 hover:underline">Điều khoản dịch vụ</Link>{" "}
                    và{" "}
                    <Link href="/privacy" className="text-indigo-600 hover:underline">Chính sách bảo mật</Link> của chúng tôi.
                </p>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="group w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-secondary to-primary hover:from-pink-400 hover:to-primary shadow-xl shadow-secondary/25 hover:shadow-secondary/40 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] relative overflow-hidden"
                >
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                    {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin relative z-10" />
                    ) : (
                        <div className="flex items-center gap-2 relative z-10">
                            <span className="text-[17px]">Tạo tài khoản</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                        </div>
                    )}
                </button>
            </form>
        </div>
    );
};

/* ──────────────────────────────────────────────
   MAIN AUTH PAGE
────────────────────────────────────────────── */
const AuthPageContent = () => {
    const searchParams = useSearchParams();
    const initMode = searchParams.get("mode") === "register" ? "register" : "login";
    const [mode, setMode] = useState<"login" | "register">(initMode);
    const [isAnimating, setIsAnimating] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    const switchMode = (next: "login" | "register") => {
        if (mode === next || isAnimating) return;
        setIsAnimating(true);
        // slide out
        if (formRef.current) {
            formRef.current.style.opacity = "0";
            formRef.current.style.transform = next === "register" ? "translateX(-24px)" : "translateX(24px)";
        }
        setTimeout(() => {
            setMode(next);
            if (formRef.current) {
                formRef.current.style.transform = next === "register" ? "translateX(24px)" : "translateX(-24px)";
            }
            // slide in
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (formRef.current) {
                        formRef.current.style.transition = "opacity 0.35s ease, transform 0.35s ease";
                        formRef.current.style.opacity = "1";
                        formRef.current.style.transform = "translateX(0)";
                    }
                    setTimeout(() => setIsAnimating(false), 350);
                });
            });
        }, 280);
    };

    return (
        <>
            <AnimatedBg mode={mode} />

            <div className="min-h-screen flex items-center justify-center py-8 px-4">
                <div className="w-full max-w-5xl">
                    {/* Card */}
                    <div className="bg-white/95 backdrop-blur-3xl rounded-[2rem] shadow-2xl shadow-primary/10 border border-white overflow-hidden grid lg:grid-cols-[1fr_1fr] min-h-[680px] relative">

                        {/* LEFT — Brand Panel */}
                        <div className={`relative overflow-hidden transition-all duration-700 ${mode === "login"
                            ? "bg-gradient-to-br from-primary via-purple-500 to-secondary"
                            : "bg-gradient-to-br from-secondary via-purple-500 to-primary"
                            }`}>
                            {/* decorative circles */}
                            <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
                            <div className="absolute -bottom-16 -right-8 w-80 h-80 rounded-full bg-white/20 blur-3xl" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />
                            {/* content */}
                            <div className="relative z-10 h-full">
                                <BrandPanel mode={mode} />
                            </div>

                            {/* Mobile top banner (only < lg) */}
                            <div className="lg:hidden p-8 text-white text-center relative z-10">
                                <Link href="/" className="inline-flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
                                        <span className="font-black text-2xl bg-clip-text text-transparent bg-gradient-to-br from-primary to-secondary">M</span>
                                    </div>
                                    <span className="font-black text-2xl drop-shadow-md">MEMESHOP</span>
                                </Link>
                                <p className="text-white/90 text-[15px] font-semibold">
                                    {mode === "login" ? "Đăng nhập để tiếp tục shopping" : "Tạo tài khoản để bắt đầu"}
                                </p>
                            </div>
                        </div>

                        {/* RIGHT — Form Panel */}
                        <div className="flex flex-col justify-center px-6 py-8 sm:px-10 lg:px-12 xl:px-14">
                            {/* Mode tabs */}
                            <div className="flex bg-slate-100 rounded-2xl p-1 mb-8 gap-1">
                                {(["login", "register"] as const).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => switchMode(m)}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${mode === m
                                            ? "bg-white text-slate-900 shadow-md"
                                            : "text-slate-500 hover:text-slate-700"
                                            }`}
                                    >
                                        {m === "login" ? "🔑 Đăng nhập" : "✨ Đăng ký"}
                                    </button>
                                ))}
                            </div>

                            {/* Animated form */}
                            <div
                                ref={formRef}
                                style={{ transition: "opacity 0.28s ease, transform 0.28s ease" }}
                            >
                                {mode === "login" ? (
                                    <LoginForm onSwitchToRegister={() => switchMode("register")} />
                                ) : (
                                    <RegisterForm onSwitchToLogin={() => switchMode("login")} />
                                )}
                            </div>

                            {/* Back to home */}
                            <div className="mt-6 text-center">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-indigo-600 transition-colors font-medium"
                                >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    Tiếp tục mua sắm không cần đăng nhập
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-6 flex items-center justify-center gap-6 flex-wrap">
                        {["🔒 Bảo mật SSL", "✅ Thanh toán an toàn", "🎁 Đổi trả miễn phí"].map((b) => (
                            <span key={b} className="text-xs text-slate-400 font-medium">{b}</span>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

/* ──────────────────────────────────────────────
   EXPORT
────────────────────────────────────────────── */
export default function AuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        }>
            <AuthPageContent />
        </Suspense>
    );
}
