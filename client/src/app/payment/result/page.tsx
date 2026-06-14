"use client";

import { paymentApi, getOrder } from "@/services/api";
import { CheckCircle, XCircle, Home, RefreshCcw, Loader2, Package, MapPin, CreditCard, Receipt } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { OrderType } from "@/types";

function PaymentResultContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [message, setMessage] = useState("");
    const [orderId, setOrderId] = useState<string | null>(null);
    const [order, setOrder] = useState<OrderType | null>(null);

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

            const currentOrderId = params['orderId'] || params['vnp_TxnRef']?.split('_')[1];
            setOrderId(currentOrderId);

            try {
                // 2. Verify with Backend
                const res = await paymentApi.verifyVnPayCallback(params);

                if (res.paymentStatus === "PAID") {
                    setStatus("success");
                    setMessage("Thanh toán thành công! Đơn hàng đã được xác nhận.");
                    
                    // Fetch order details for full invoice summary
                    if (currentOrderId) {
                        try {
                            const orderDetails = await getOrder(Number(currentOrderId));
                            setOrder(orderDetails);
                        } catch (err) {
                            console.error("Failed to fetch order details:", err);
                        }
                    }
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

    const formatPrice = (price?: number) => {
        if (!price && price !== 0) return "0đ";
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className={`w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up ${status === "loading" ? "max-w-md" : ""}`}>
            {status === "loading" ? (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <h2 className="text-xl font-bold text-gray-700">Đang xác thực thanh toán...</h2>
                    <p className="text-gray-500">Vui lòng chờ trong giây lát.</p>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row">
                    {/* Left/Top Sidebar: Status */}
                    <div className={`p-8 md:w-1/3 flex flex-col items-center justify-center text-center ${isSuccess ? "bg-gradient-to-br from-green-50 to-emerald-50" : "bg-gradient-to-br from-red-50 to-pink-50"
                        }`}>
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg ${isSuccess ? "bg-green-500 text-white shadow-green-200" : "bg-red-500 text-white shadow-red-200"
                            }`}>
                            {isSuccess ? (
                                <CheckCircle className="w-12 h-12" />
                            ) : (
                                <XCircle className="w-12 h-12" />
                            )}
                        </div>

                        <h1 className={`text-2xl font-bold mb-2 ${isSuccess ? "text-green-800" : "text-red-800"}`}>
                            {isSuccess ? "Thanh Toán Thành Công!" : "Thanh Toán Thất Bại"}
                        </h1>
                        <p className={`text-sm ${isSuccess ? "text-green-600" : "text-red-600"}`}>
                            {message}
                        </p>

                        {orderId && (
                            <div className="mt-6 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/50 w-full">
                                <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Mã đơn hàng</span>
                                <p className="text-gray-900 font-mono font-bold text-lg mt-1">#{orderId}</p>
                            </div>
                        )}
                        
                        <div className="mt-8 space-y-3 w-full">
                            {isSuccess ? (
                                <>
                                    <Link
                                        href="/account/orders"
                                        className="block w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-bold text-center shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.02] text-sm"
                                    >
                                        Quản Lý Đơn Hàng
                                    </Link>
                                    <Link
                                        href="/"
                                        className="block w-full bg-white text-gray-700 py-3 rounded-xl font-bold text-center hover:bg-gray-100 border border-gray-200 transition-all text-sm"
                                    >
                                        Tiếp Tục Mua Sắm
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={orderId ? `/checkout` : "/cart"}
                                        className="block w-full bg-red-500 text-white py-3 rounded-xl font-bold text-center shadow-lg shadow-red-200 hover:bg-red-600 transition-all hover:scale-[1.02] text-sm"
                                    >
                                        Thử Thanh Toán Lại
                                    </Link>
                                    <Link
                                        href="/"
                                        className="block w-full bg-white text-gray-700 py-3 rounded-xl font-bold text-center hover:bg-gray-100 border border-gray-200 transition-all text-sm"
                                    >
                                        Về Trang Chủ
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right/Bottom Content: Order Details (Only if Success & Order fetched) */}
                    <div className="p-8 md:w-2/3 bg-white border-t md:border-t-0 md:border-l border-gray-100">
                        {isSuccess && order ? (
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-4">
                                    <Receipt className="w-5 h-5 text-primary" />
                                    Chi tiết đơn hàng
                                </h2>
                                
                                {/* Info Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-sm font-semibold">Giao hàng đến</span>
                                        </div>
                                        <p className="font-medium text-gray-900">{order.shippingAddress?.fullName}</p>
                                        <p className="text-sm text-gray-600 mt-1">{order.shippingAddress?.phone}</p>
                                        <p className="text-sm text-gray-600 mt-1 truncate" title={order.shippingAddress?.addressLine}>{order.shippingAddress?.addressLine}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                                            <CreditCard className="w-4 h-4" />
                                            <span className="text-sm font-semibold">Thanh toán</span>
                                        </div>
                                        <p className="font-medium text-gray-900">
                                            {typeof order.paymentMethod === 'string' ? order.paymentMethod : order.paymentMethod?.type}
                                        </p>
                                        <p className="text-sm text-green-600 font-medium mt-1">Đã thanh toán (VNPay)</p>
                                        <p className="text-sm text-gray-600 mt-1">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Package className="w-4 h-4" /> Sản phẩm ({order.items?.length || 0})
                                    </h3>
                                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {order.items?.map((item) => (
                                            <div key={item.id} className="flex gap-3 items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                    <img src={item.productImageUrl || item.thumbnailUrl || "/images/placeholder.jpg"} alt={item.productName} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                                                    <p className="text-xs text-gray-500">{item.variantInfo || `${item.color || ''} ${item.size ? '- ' + item.size : ''}`}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-900">{formatPrice(item.price || item.unitPrice)}</p>
                                                    <p className="text-xs text-gray-500">x{item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Tạm tính</span>
                                        <span>{formatPrice(order.subtotal || (order.totalAmount - (order.shippingFee || 0)))}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Phí vận chuyển</span>
                                        <span>{formatPrice(order.shippingFee)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-dashed">
                                        <span className="font-bold text-gray-900">Tổng cộng</span>
                                        <span className="text-xl font-bold text-primary">{formatPrice(order.totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        ) : isSuccess ? (
                            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4">
                                <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                                <p>Đang tải thông tin đơn hàng...</p>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4 opacity-50">
                                <Receipt className="w-16 h-16 text-gray-200" />
                                <p>Không có thông tin hóa đơn do giao dịch thất bại.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function PaymentResultPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
            <Suspense fallback={<div className="p-8 bg-white rounded-2xl shadow-lg"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
                <PaymentResultContent />
            </Suspense>
        </div>
    );
}

