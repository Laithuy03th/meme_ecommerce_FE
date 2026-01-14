import { VoucherType, VoucherValidationResponse } from "@/types";
import { authenticatedFetch } from "./base";

/**
 * Validate voucher code
 */
export const validateVoucher = async (
    code: string,
    orderAmount: number
): Promise<VoucherValidationResponse> => {
    const res = await authenticatedFetch(
        `/vouchers/validate?code=${encodeURIComponent(code)}&orderAmount=${orderAmount}`
    );

    if (!res.ok) {
        throw new Error("Failed to validate voucher");
    }

    return res.json();
};

/**
 * Get all active vouchers
 */
export const getActiveVouchers = async (): Promise<VoucherType[]> => {
    const res = await authenticatedFetch("/vouchers/active");

    if (!res.ok) {
        throw new Error("Failed to fetch active vouchers");
    }

    return res.json();
};
