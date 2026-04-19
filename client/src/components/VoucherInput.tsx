"use client";

import { useState, useEffect } from "react";
import { getVouchers, validateVoucher } from "@/services/api/voucherApi";
import { Tag, X, Loader2, CheckCircle2, Ticket, CalendarDays, Copy } from "lucide-react";
import { toast } from "react-toastify";
import { VoucherType } from "@/types";

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

    const [availableVouchers, setAvailableVouchers] = useState<VoucherType[]>([]);
    const [isLoadingVouchers, setIsLoadingVouchers] = useState(true);

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        try {
            const data = await getVouchers();
            setAvailableVouchers(data || []);
        } catch (error) {
            console.error("Failed to load vouchers", error);
        } finally {
            setIsLoadingVouchers(false);
        }
    };

    const handleApplyVoucher = async (codeOverride?: string) => {
        const codeToUse = codeOverride || voucherCode;
        if (!codeToUse.trim()) {
            setError("Vui lòng nhập mã voucher");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await validateVoucher(
                codeToUse.toUpperCase(),
                cartTotal
            );

            if (result.valid) {
                setAppliedVoucher({
                    code: codeToUse.toUpperCase(),
                    discount: result.discountAmount,
                });
                setVoucherCode(codeToUse.toUpperCase()); // Sync input
                onVoucherApplied(result.discountAmount, codeToUse.toUpperCase());
                toast.success(`Áp dụng thành công! Giảm ${result.discountAmount.toLocaleString("vi-VN")}₫`);
            } else {
                setError(result.message || "Mã voucher không hợp lệ");
                setAppliedVoucher(null);
                onVoucherApplied(0, ""); // Reset parent
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
        <div className="voucher-section space-y-4">
            {/* Input Section */}
            <div>
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
                                onKeyDown={handleKeyPress}
                                placeholder="Nhập mã giảm giá"
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all uppercase placeholder:normal-case"
                                disabled={loading}
                            />
                            <button
                                onClick={() => handleApplyVoucher()}
                                disabled={loading || !voucherCode.trim()}
                                className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2 shadow-sm hover:shadow-md whitespace-nowrap"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Checking...
                                    </>
                                ) : (
                                    "Áp dụng"
                                )}
                            </button>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
                                <X className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-4 shadow-sm animate-in zoom-in-95">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-full border border-emerald-100">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-emerald-700 font-bold font-mono text-lg">{appliedVoucher.code}</span>
                                    <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">Đang dùng</span>
                                </div>
                                <p className="text-sm text-emerald-600 mt-0.5">
                                    Đã giảm <span className="font-bold">{appliedVoucher.discount.toLocaleString("vi-VN")}₫</span>
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleRemoveVoucher}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                            title="Bỏ mã này"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* List Available Vouchers */}
            {!isLoadingVouchers && availableVouchers.length > 0 && !appliedVoucher && (
                <div className="space-y-3 pt-2">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Ticket className="w-4 h-4" />
                        Mã giảm giá dành cho bạn
                    </h4>

                    <div className="grid gap-3 max-h-60 overflow-y-auto pr-1 customize-scrollbar">
                        {availableVouchers.map((voucher) => {
                            const minOrder = voucher.minOrderAmount ?? 0;
                            const isEligible = cartTotal >= minOrder;
                            const percentDisplay = voucher.discountType === 'PERCENT' ? `${voucher.discountValue ?? 0}%` : null;
                            const amountDisplay = voucher.discountType === 'FIXED_AMOUNT' ? `${(voucher.discountValue ?? 0).toLocaleString('vi-VN')}₫` : null;

                            return (
                                <div
                                    key={voucher.id}
                                    className={`relative group flex border rounded-xl overflow-hidden transition-all duration-200 ${isEligible
                                            ? "bg-white border-gray-200 hover:border-primary/50 hover:shadow-md cursor-pointer"
                                            : "bg-gray-50 border-gray-100 opacity-60 grayscale-[0.5]"
                                        }`}
                                    onClick={() => isEligible && handleApplyVoucher(voucher.code)}
                                >
                                    {/* Left: Decoration */}
                                    <div className={`w-24 flex flex-col items-center justify-center p-3 text-white text-center rounded-r-2xl border-r border-dashed border-white/20 ${isEligible ? "bg-gradient-to-br from-primary to-orange-600" : "bg-gray-400"}`}>
                                        <span className="font-black text-xl leading-none">
                                            {percentDisplay || amountDisplay}
                                        </span>
                                        <span className="text-[10px] font-medium opacity-90 mt-1 uppercase">OFF</span>
                                    </div>

                                    {/* Right: Info */}
                                    <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-mono font-bold text-gray-800 text-sm bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/30 transition-colors">
                                                {voucher.code}
                                            </span>
                                            {isEligible && (
                                                <span className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Dùng ngay
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-1">
                                            Đơn tối thiểu {(voucher.minOrderAmount ?? 0).toLocaleString('vi-VN')}₫
                                        </p>
                                        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                                            <CalendarDays className="w-3 h-3" />
                                            HSD: {new Date(voucher.endDate).toLocaleDateString('vi-VN')}
                                        </div>
                                    </div>

                                    {/* Perforation visual trick */}
                                    <div className="absolute top-1/2 left-[5.8rem] -translate-y-1/2 w-4 h-4 bg-white rounded-full -ml-2"></div>
                                    <div className="absolute -top-2 left-[5.8rem] w-4 h-4 bg-white rounded-full -ml-2"></div>
                                    <div className="absolute -bottom-2 left-[5.8rem] w-4 h-4 bg-white rounded-full -ml-2"></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
