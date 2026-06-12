"use client";

import Link from "next/link";
import { useState, Suspense, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { login as apiLogin, register } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import {
    Mail, Lock, ArrowRight, Loader2, User, Phone,
    Eye, EyeOff, ShoppingBag, Sparkles, CheckCircle2,
    Shield, Truck, Gift, RotateCcw
} from "lucide-react";

/* ──────────────────────────────────────────────
   Shared Input
────────────────────────────────────────────── */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: React.ReactNode;
    label: string;
    rightElement?: React.ReactNode;
}
const FloatingInput = ({ icon, label, rightElement, ...props }: InputProps) => (
    <div className="group">
        <label className="block text-sm font-semibold text-slate-600 mb-1.5 ml-1">
            {label}
        </label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors duration-200">
                {icon}
            </div>
            <input
                {...props}
                className={`block w-full pl-11 ${rightElement ? "pr-11" : "pr-4"} py-3 border border-slate-200 rounded-xl bg-white placeholder-slate-300 text-[15px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 hover:border-slate-300`}
            />
            {rightElement && (
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                    {rightElement}
                </div>
            )}
        </div>
    </div>
);

/* ──────────────────────────────────────────────
   Animated Background
────────────────────────────────────────────── */
const AnimatedBg = ({ mode }: { mode: "login" | "register" }) => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-purple-50/30" />
        <div
            className={`absolute -top-32 transition-all duration-1000 ease-in-out ${mode === "login" ? "-left-32" : "-right-32"} w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/10 to-secondary/8 blur-[120px]`}
        />
        <div
            className={`absolute -bottom-32 transition-all duration-1000 ease-in-out ${mode === "login" ? "-right-32" : "-left-32"} w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-secondary/10 to-primary/8 blur-[100px]`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
    </div>
);

/* ──────────────────────────────────────────────
   Brand Panel (left side on desktop)
────────────────────────────────────────────── */
const BrandPanel = ({ mode }: { mode: "login" | "register" }) => {
    const features = [
        { icon: Shield, text: "Thanh toán bảo mật & hoàn tiền dễ dàng" },
        { icon: Truck, text: "Giao hàng nhanh toàn quốc" },
        { icon: Gift, text: "Voucher & ưu đãi độc quyền mỗi ngày" },
        { icon: RotateCcw, text: "Đổi trả miễn phí trong 30 ngày" },
    ];
    return (
        <div className="hidden lg:flex flex-col justify-between h-full p-10 xl:p-12 relative z-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group w-fit">
                <div className="relative w-11 h-11 overflow-hidden rounded-2xl bg-gradient-to-tr from-primary to-secondary p-[2px] shadow-lg shadow-primary/30 group-hover:shadow-primary/50 group-hover:scale-105 transition-all duration-300">
                    <div className="w-full h-full bg-white rounded-[13px] flex items-center justify-center">
                        <span className="font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">M</span>
                    </div>
                </div>
                <span className="text-2xl font-black text-white drop-shadow-sm tracking-wide">
                    MEMESHOP
                </span>
            </Link>

            {/* Hero */}
            <div>
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold mb-5 border border-white/25">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        {mode === "login" ? "Chào mừng trở lại!" : "Tham gia cùng chúng tôi"}
                    </div>
                    <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
                        {mode === "login" ? (
                            <>Shopping<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-100">thông minh</span><br />hơn mỗi ngày</>
                        ) : (
                            <>Tạo tài khoản<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-100">miễn phí</span><br />ngay hôm nay</>
                        )}
                    </h1>
                    <p className="text-white/80 text-base leading-relaxed">
                        {mode === "login"
                            ? "Đăng nhập để tiếp tục hành trình shopping với hàng nghìn sản phẩm meme độc đáo."
                            : "Đăng ký để nhận ưu đãi đặc biệt, theo dõi đơn hàng và nhiều hơn nữa."
                        }
                    </p>
                </div>

                {/* Features */}
                <div className="space-y-3.5">
                    {features.map(({ icon: Icon, text }, i) => (
                        <div key={i} className="flex items-center gap-3.5 group">
                            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                                <Icon className="w-4 h-4 text-white/90" />
                            </div>
                            <span className="text-white/90 text-sm font-medium">{text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom */}
            <p className="text-white/50 text-xs font-medium">
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
        <div className="flex gap-2 mt-2">
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
            <div className="mb-7">
                <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Đăng nhập</h2>
                <p className="text-slate-500 text-sm">
                    Chưa có tài khoản?{" "}
                    <button onClick={onSwitchToRegister} className="text-primary font-semibold hover:text-primary/80 transition-colors underline underline-offset-2">
                        Tạo ngay miễn phí →
                    </button>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <FloatingInput
                    icon={<Mail className="w-4 h-4" />}
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                />

                <FloatingInput
                    icon={<Lock className="w-4 h-4" />}
                    label="Mật khẩu"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                    rightElement={
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="text-slate-400 hover:text-slate-600 transition-colors p-0.5">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    }
                />

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="remember" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/30 accent-primary" />
                        <span className="text-sm text-slate-500">Ghi nhớ đăng nhập</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm text-primary font-medium hover:text-primary/80 hover:underline underline-offset-2 transition-colors">
                        Quên mật khẩu?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="group w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] relative overflow-hidden mt-2"
                >
                    <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                    ) : (
                        <div className="flex items-center gap-2 relative z-10">
                            <span>Đăng nhập</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    )}
                </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[11px] text-slate-400 font-semibold tracking-wider">HOẶC TIẾP TỤC VỚI</span>
                <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2.5 py-3 border border-slate-200 bg-white rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all duration-200 group">
                    <svg className="h-4 w-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </button>
                <button className="flex items-center justify-center gap-2.5 py-3 border border-slate-200 bg-white rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all duration-200 group">
                    <svg className="h-4 w-4 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
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
            <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Tạo tài khoản</h2>
                <p className="text-slate-500 text-sm">
                    Đã có tài khoản?{" "}
                    <button onClick={onSwitchToLogin} className="text-primary font-semibold hover:text-primary/80 transition-colors underline underline-offset-2">
                        Đăng nhập ngay →
                    </button>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
                <FloatingInput
                    icon={<User className="w-4 h-4" />}
                    label="Họ và tên"
                    name="name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <FloatingInput
                        icon={<Mail className="w-4 h-4" />}
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                    />
                    <FloatingInput
                        icon={<Phone className="w-4 h-4" />}
                        label="Số điện thoại"
                        name="phone"
                        type="tel"
                        placeholder="0901 234 567"
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        rightElement={
                            <button type="button" onClick={() => setShowPwd(!showPwd)}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5">
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
                    rightElement={
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                            className="text-slate-400 hover:text-slate-600 transition-colors p-0.5">
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    }
                />

                <p className="text-xs text-slate-400 leading-relaxed pt-0.5">
                    Bằng cách đăng ký, bạn đồng ý với{" "}
                    <Link href="/terms" className="text-primary hover:underline">Điều khoản dịch vụ</Link>{" "}
                    và{" "}
                    <Link href="/privacy" className="text-primary hover:underline">Chính sách bảo mật</Link> của chúng tôi.
                </p>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="group w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-secondary to-primary hover:opacity-90 shadow-lg shadow-secondary/20 hover:shadow-secondary/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] relative overflow-hidden"
                >
                    <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                    ) : (
                        <div className="flex items-center gap-2 relative z-10">
                            <span>Tạo tài khoản</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
        if (formRef.current) {
            formRef.current.style.opacity = "0";
            formRef.current.style.transform = next === "register" ? "translateX(-20px)" : "translateX(20px)";
        }
        setTimeout(() => {
            setMode(next);
            if (formRef.current) {
                formRef.current.style.transform = next === "register" ? "translateX(20px)" : "translateX(-20px)";
            }
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (formRef.current) {
                        formRef.current.style.transition = "opacity 0.3s ease, transform 0.3s ease";
                        formRef.current.style.opacity = "1";
                        formRef.current.style.transform = "translateX(0)";
                    }
                    setTimeout(() => setIsAnimating(false), 300);
                });
            });
        }, 250);
    };

    return (
        <>
            <AnimatedBg mode={mode} />

            {/* Full-page centered container — accounts for sticky navbar height */}
            <div className="flex items-center justify-center min-h-[calc(100vh-72px)] py-10 px-4">
                <div className="w-full max-w-4xl">
                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden grid lg:grid-cols-[420px_1fr] min-h-[560px]">

                        {/* LEFT — Brand Panel */}
                        <div className={`relative overflow-hidden transition-all duration-700 ${mode === "login"
                            ? "bg-gradient-to-br from-primary via-purple-500 to-secondary"
                            : "bg-gradient-to-br from-secondary via-purple-500 to-primary"
                            }`}>
                            {/* Decorative circles */}
                            <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/15 blur-2xl" />
                            <div className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl" />

                            {/* Desktop content */}
                            <div className="relative z-10 h-full">
                                <BrandPanel mode={mode} />
                            </div>

                            {/* Mobile top banner (only < lg) */}
                            <div className="lg:hidden px-6 py-6 text-white text-center relative z-10">
                                <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md shadow-black/10">
                                        <span className="font-black text-xl bg-clip-text text-transparent bg-gradient-to-br from-primary to-secondary">M</span>
                                    </div>
                                    <span className="font-black text-xl drop-shadow-sm">MEMESHOP</span>
                                </Link>
                                <p className="text-white/85 text-sm font-medium">
                                    {mode === "login" ? "Đăng nhập để tiếp tục shopping" : "Tạo tài khoản để bắt đầu"}
                                </p>
                            </div>
                        </div>

                        {/* RIGHT — Form Panel */}
                        <div className="flex flex-col justify-center px-6 py-8 sm:px-8 lg:px-10">
                            {/* Mode tabs */}
                            <div className="flex bg-slate-100 rounded-xl p-1 mb-7 gap-1">
                                {(["login", "register"] as const).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => switchMode(m)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === m
                                            ? "bg-white text-slate-900 shadow-sm"
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
                                style={{ transition: "opacity 0.25s ease, transform 0.25s ease" }}
                            >
                                {mode === "login" ? (
                                    <LoginForm onSwitchToRegister={() => switchMode("register")} />
                                ) : (
                                    <RegisterForm onSwitchToLogin={() => switchMode("login")} />
                                )}
                            </div>

                            {/* Back to home */}
                            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary transition-colors font-medium"
                                >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    Tiếp tục mua sắm không cần đăng nhập
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-5 flex items-center justify-center gap-5 flex-wrap">
                        {["🔒 Bảo mật SSL", "✅ Thanh toán an toàn", "🎁 Đổi trả miễn phí"].map((b) => (
                            <span key={b} className="text-[11px] text-slate-400 font-medium">{b}</span>
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
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <AuthPageContent />
        </Suspense>
    );
}
