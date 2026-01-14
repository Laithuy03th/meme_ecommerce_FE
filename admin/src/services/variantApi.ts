import { authenticatedFetch } from "./api";
import type { ProductVariant, CreateVariantRequest } from "@/types/product";

export const variantApi = {
    /**
     * GET /api/v1/admin/products/{productId}/variants
     * List all variants of a product
     */
    async listByProduct(productId: number): Promise<ProductVariant[]> {
        return authenticatedFetch<ProductVariant[]>(`/admin/products/${productId}/variants`);
    },

    /**
     * GET /api/v1/admin/products/{productId}/variants/{variantId}
     * Get variant detail
     */
    async getById(variantId: number): Promise<ProductVariant> {
        return authenticatedFetch<ProductVariant>(`/admin/products/0/variants/${variantId}`);
    },

    /**
     * POST /api/v1/admin/products/{productId}/variants
     * Create new variant
     */
    async create(productId: number, data: CreateVariantRequest): Promise<ProductVariant> {
        return authenticatedFetch<ProductVariant>(`/admin/products/${productId}/variants`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * PUT /api/v1/admin/products/{productId}/variants/{variantId}
     * Update variant
     */
    async update(variantId: number, data: Partial<CreateVariantRequest>): Promise<ProductVariant> {
        return authenticatedFetch<ProductVariant>(`/admin/products/0/variants/${variantId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * DELETE /api/v1/admin/products/{productId}/variants/{variantId}
     * Delete variant
     */
    async delete(variantId: number): Promise<void> {
        return authenticatedFetch<void>(`/admin/products/0/variants/${variantId}`, {
            method: 'DELETE',
        });
    },
};
