import { authenticatedFetch } from "./base";
import { VoucherType, VoucherValidationResponse } from "@/types";

/**
 * Lấy danh sách voucher khả dụng
 */
export const getVouchers = async (): Promise<VoucherType[]> => {
    try {
        const res = await authenticatedFetch("/vouchers");

        if (!res.ok) {
            console.warn("[API] Failed to fetch vouchers");
            return [];
        }

        return await res.json();
    } catch (error) {
        console.error("Error fetching vouchers:", error);
        return [];
    }
};

/**
 * Kiểm tra và áp dụng voucher
 */
export const validateVoucher = async (code: string, orderAmount: number): Promise<VoucherValidationResponse> => {
    const params = new URLSearchParams({
        code: code,
        orderAmount: orderAmount.toString(),
    });

    const res = await authenticatedFetch(`/vouchers/validate?${params.toString()}`);

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        // Return structured error response instead of throwing to handle UI better
        return {
            valid: false,
            discountAmount: 0,
            message: errorData.message || "Mã giảm giá không hợp lệ"
        };
    }

    return res.json();
};
