import { authenticatedFetch, buildQueryString } from "./api";
import type { PageResponse } from "@/types/common";
import type { Voucher, CreateVoucherRequest, VoucherListParams } from "@/types/voucher";

export const voucherApi = {
    /**
     * GET /api/v1/admin/vouchers
     * List vouchers with pagination and filter
     */
    async list(params: VoucherListParams = {}): Promise<PageResponse<Voucher>> {
        const query = buildQueryString({
            page: params.page || 0,
            size: params.size || 20,
            ...(params.isActive !== undefined && { isActive: params.isActive }),
        });
        return authenticatedFetch<PageResponse<Voucher>>(`/admin/vouchers?${query}`);
    },

    /**
     * GET /api/v1/admin/vouchers/{id}
     * Get voucher detail by ID
     */
    async getById(id: number): Promise<Voucher> {
        return authenticatedFetch<Voucher>(`/admin/vouchers/${id}`);
    },

    /**
     * POST /api/v1/admin/vouchers
     * Create new voucher
     */
    async create(data: CreateVoucherRequest): Promise<Voucher> {
        return authenticatedFetch<Voucher>('/admin/vouchers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * PUT /api/v1/admin/vouchers/{id}
     * Update voucher
     */
    async update(id: number, data: CreateVoucherRequest): Promise<Voucher> {
        return authenticatedFetch<Voucher>(`/admin/vouchers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * DELETE /api/v1/admin/vouchers/{id}
     * Soft delete voucher (set isActive = false)
     */
    async delete(id: number): Promise<void> {
        return authenticatedFetch<void>(`/admin/vouchers/${id}`, {
            method: 'DELETE',
        });
    },

};
