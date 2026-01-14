"use client";

import { useState } from "react";
import { validateVoucher } from "@/services/api/voucherApi";
import { Tag, X, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

interface VoucherInputProps {
    cartTotal: number;
    onVoucherApplied: (discount: number, code: string) => void;
}

export default function VoucherInput({ cartTotal, onVoucherApplied }: VoucherInputProps) {
    const [voucherCode, setVoucherCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [appliedVoucher, setAppliedVoucher] = useState<{
        code: string;
        discount: number;
    } | null>(null);

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) {
            setError("Vui lòng nhập mã voucher");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await validateVoucher(
                voucherCode.toUpperCase(),
                cartTotal
            );

            if (result.valid) {
                setAppliedVoucher({
                    code: voucherCode.toUpperCase(),
                    discount: result.discountAmount,
                });
                onVoucherApplied(result.discountAmount, voucherCode.toUpperCase());
                toast.success(`Áp dụng thành công! Giảm ${result.discountAmount.toLocaleString("vi-VN")}₫`);
            } else {
                setError(result.message || "Mã voucher không hợp lệ");
                setAppliedVoucher(null);
            }
        } catch (err: any) {
            setError("Có lỗi xảy ra khi kiểm tra voucher");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveVoucher = () => {
        setVoucherCode("");
        setAppliedVoucher(null);
        setError("");
        onVoucherApplied(0, "");
        toast.info("Đã xóa mã giảm giá");
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleApplyVoucher();
        }
    };

    return (
        <div className="voucher-section">
            <label className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
                <Tag className="w-5 h-5 text-primary" />
                Mã giảm giá
            </label>

            {!appliedVoucher ? (
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập mã giảm giá"
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            disabled={loading}
                        />
                        <button
                            onClick={handleApplyVoucher}
                            disabled={loading || !voucherCode.trim()}
                            className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang kiểm tra...
                                </>
                            ) : (
                                "Áp dụng"
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                            <X className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-700 font-bold font-mono">{appliedVoucher.code}</span>
                                <span className="text-sm text-gray-600">đã được áp dụng</span>
                            </div>
                            <p className="text-sm text-green-600 font-medium">
                                Giảm {appliedVoucher.discount.toLocaleString("vi-VN")}₫
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleRemoveVoucher}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Xóa mã giảm giá"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
