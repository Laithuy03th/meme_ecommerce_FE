import { BaseEntity } from "./common";

export type DiscountType = 'PERCENT' | 'AMOUNT';

export interface Voucher extends BaseEntity {
    code: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderAmount?: number;
    maxDiscountAmount?: number;
    startDate: string;
    endDate: string;
    usageLimit: number;
    usedCount: number;
    isActive: boolean;
}

export interface CreateVoucherRequest {
    code: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderAmount?: number;
    maxDiscountAmount?: number;
    startDate?: string; // ISO 8601
    endDate?: string;
    usageLimit: number;
}

export interface VoucherListParams {
    isActive?: boolean;
    page?: number;
    size?: number;
}
