"use client";

import { useState } from "react";
import { VoucherType } from "@/types";
import { Copy, Check, Calendar, Tag, TrendingUp, Users } from "lucide-react";
import { toast } from "react-toastify";

interface VoucherCardProps {
    voucher: VoucherType;
}

export default function VoucherCard({ voucher }: VoucherCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(voucher.code);
            setCopied(true);
            toast.success("Đã copy mã voucher!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Không thể copy mã");
        }
    };

    const getDiscountText = () => {
        if (voucher.discountType === "PERCENT") {
            return `${voucher.discountValue}%`;
        } else {
            return `${voucher.discountValue.toLocaleString("vi-VN")}₫`;
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const getRemainingCount = () => {
        if (!voucher.usageLimit) return null;
        return voucher.usageLimit - voucher.usedCount;
    };

    const getProgressPercent = () => {
        if (!voucher.usageLimit) return 0;
        return (voucher.usedCount / voucher.usageLimit) * 100;
    };

    return (
        <div className="relative group">
            {/* Main Card */}
            <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden relative">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                {/* Discount Badge */}
                <div className="relative bg-white text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 font-extrabold text-3xl py-3 px-4 rounded-xl mb-4 text-center shadow-md">
                    <div className="absolute inset-0 bg-white rounded-xl opacity-95"></div>
                    <span className="relative flex items-center justify-center gap-2">
                        <TrendingUp className="w-6 h-6 text-orange-500" />
                        Giảm {getDiscountText()}
                    </span>
                </div>

                {/* Voucher Code Section */}
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            <span className="font-mono font-bold text-lg tracking-wider">
                                {voucher.code}
                            </span>
                        </div>
                        <button
                            onClick={handleCopyCode}
                            className="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-50 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Đã copy
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Conditions */}
                <div className="space-y-2 text-sm">
                    {voucher.minOrderAmount > 0 && (
                        <div className="flex items-start gap-2">
                            <span className="text-white/80">•</span>
                            <p className="flex-1">
                                Đơn tối thiểu:{" "}
                                <span className="font-bold">
                                    {voucher.minOrderAmount.toLocaleString("vi-VN")}₫
                                </span>
                            </p>
                        </div>
                    )}
                    {voucher.maxDiscountAmount > 0 && voucher.discountType === "PERCENT" && (
                        <div className="flex items-start gap-2">
                            <span className="text-white/80">•</span>
                            <p className="flex-1">
                                Giảm tối đa:{" "}
                                <span className="font-bold">
                                    {voucher.maxDiscountAmount.toLocaleString("vi-VN")}₫
                                </span>
                            </p>
                        </div>
                    )}
                    {voucher.endDate && (
                        <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p className="flex-1">
                                HSD: <span className="font-bold">{formatDate(voucher.endDate)}</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Usage Progress */}
                {voucher.usageLimit && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="flex items-center justify-between text-xs mb-2">
                            <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>Đã dùng: {voucher.usedCount}</span>
                            </div>
                            <span>
                                Còn lại: <span className="font-bold">{getRemainingCount()}</span>
                            </span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-white h-full rounded-full transition-all duration-500"
                                style={{ width: `${getProgressPercent()}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Hover Tooltip (Optional) */}
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                Nhấn Copy!
            </div>
        </div>
    );
}
