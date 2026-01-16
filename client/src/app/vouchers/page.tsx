"use client";

import { useEffect, useState } from "react";
import { getVouchers } from "@/services/api/voucherApi";
import { VoucherType } from "@/types";
import VoucherCard from "@/components/VoucherCard";
import { Tag, Loader2, Frown } from "lucide-react";

export default function VouchersPage() {
    const [vouchers, setVouchers] = useState<VoucherType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const data = await getVouchers();
                setVouchers(data);
            } catch (err: any) {
                console.error("Failed to load vouchers:", err);
                setError("Không thể tải danh sách voucher");
            } finally {
                setLoading(false);
            }
        };

        fetchVouchers();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-gray-500">Đang tải voucher...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Frown className="w-16 h-16 text-gray-300" />
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-12 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <Tag className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">Mã Giảm Giá</h1>
                </div>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Chọn voucher phù hợp và áp dụng vào đơn hàng để nhận ưu đãi tốt nhất! 🎁
                </p>
            </div>

            {vouchers.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Tag className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có voucher nào</h3>
                    <p className="text-gray-500">Hãy quay lại sau để nhận những ưu đãi hấp dẫn!</p>
                </div>
            ) : (
                <>
                    {/* Stats Bar */}
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100 rounded-2xl p-6 mb-8">
                        <div className="flex items-center justify-center gap-8">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-orange-600">{vouchers.length}</p>
                                <p className="text-sm text-gray-600">Voucher khả dụng</p>
                            </div>
                            <div className="w-px h-12 bg-orange-200"></div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-red-600">
                                    {vouchers.filter(v => v.discountType === "PERCENT").length}
                                </p>
                                <p className="text-sm text-gray-600">Giảm theo %</p>
                            </div>
                            <div className="w-px h-12 bg-orange-200"></div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-orange-600">
                                    {vouchers.filter(v => v.discountType === "AMOUNT").length}
                                </p>
                                <p className="text-sm text-gray-600">Giảm cố định</p>
                            </div>
                        </div>
                    </div>

                    {/* Voucher Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vouchers.map((voucher) => (
                            <VoucherCard key={voucher.id} voucher={voucher} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
