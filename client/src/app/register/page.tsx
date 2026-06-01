"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * /register route — redirect sang /login?mode=register
 * Form đăng ký đã được tích hợp vào trang /login để UX tốt hơn
 */
export default function RegisterRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/login?mode=register");
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
    );
}
