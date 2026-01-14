"use client";

import { paymentApi } from "@/services/api";
import { CheckCircle, XCircle, Home, RefreshCcw, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PaymentResultContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [message, setMessage] = useState("");
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        const verify = async () => {
            // 1. Convert SearchParams to Object
            const params: Record<string, string> = {};
            searchParams.forEach((value, key) => {
                params[key] = value;
            });

            // Simple check if params exist
            if (Object.keys(params).length === 0) {
                setStatus("failed");
                setMessage("Invalid transaction data");
                return;
            }

            setOrderId(params['vnp_TxnRef'] || params['orderId']);

            try {
                // 2. Verify with Backend
                const res = await paymentApi.verifyVnPayCallback(params);

                if (res.paymentStatus === "PAID") {
                    setStatus("success");
                    setMessage("Thanh toán thành công! Đơn hàng đã được xác nhận.");
                } else {
                    setStatus("failed");
                    setMessage(res.message || "Giao dịch không thành công.");
                }
            } catch (error: any) {
                console.error("Verify error:", error);
                setStatus("failed");
                setMessage(error.message || "Lỗi xác thực giao dịch.");
            }
        };

        verify();
    }, [searchParams]);

    const isSuccess = status === "success";

    return (
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">
            {status === "loading" ? (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <h2 className="text-xl font-bold text-gray-700">Verifying Payment...</h2>
                    <p className="text-gray-500">Please wait while we check your transaction status.</p>
                </div>
            ) : (
                <>
                    <div className={`p-8 flex flex-col items-center text-center ${isSuccess ? "bg-gradient-to-br from-green-50 to-emerald-50" : "bg-gradient-to-br from-red-50 to-pink-50"
                        }`}>
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg ${isSuccess ? "bg-green-500 text-white shadow-green-200" : "bg-red-500 text-white shadow-red-200"
                            }`}>
                            {isSuccess ? (
                                <CheckCircle className="w-12 h-12" />
                            ) : (
                                <XCircle className="w-12 h-12" />
                            )}
                        </div>

                        <h1 className={`text-3xl font-bold mb-2 ${isSuccess ? "text-green-800" : "text-red-800"}`}>
                            {isSuccess ? "Payment Successful!" : "Payment Failed"}
                        </h1>
                        <p className={`text-sm ${isSuccess ? "text-green-600" : "text-red-600"}`}>
                            {message}
                        </p>

                        {orderId && (
                            <div className="mt-6 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/50">
                                <span className="text-gray-500 text-sm">Order ID</span>
                                <p className="text-gray-900 font-mono font-bold text-lg">#{orderId}</p>
                            </div>
                        )}
                    </div>

                    <div className="p-8 space-y-4 bg-white">
                        {isSuccess ? (
                            <>
                                <Link
                                    href="/account/orders"
                                    className="block w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold text-center shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.02]"
                                >
                                    View My Order
                                </Link>
                                <Link
                                    href="/"
                                    className="block w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-bold text-center hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                >
                                    Back to Home <Home className="w-4 h-4" />
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={orderId ? `/checkout` : "/cart"}
                                    className="block w-full bg-red-500 text-white py-4 rounded-xl font-bold text-center shadow-lg shadow-red-200 hover:bg-red-600 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                                >
                                    Try Again <RefreshCcw className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/"
                                    className="block w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-bold text-center hover:bg-gray-200 transition-all"
                                >
                                    Back to Home
                                </Link>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default function PaymentResultPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <Suspense fallback={<div className="p-8 bg-white rounded-2xl shadow-lg"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
                <PaymentResultContent />
            </Suspense>
        </div>
    );
}
