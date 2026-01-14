import { authenticatedFetch, buildQueryString } from "./api";
import type { PageResponse } from "@/types/common";
import type { Product, CreateProductRequest } from "@/types/product";

export type { CreateProductRequest };

export const productApi = {
    /**
     * GET /api/v1/admin/products
     * List products with pagination
     */
    async list(page = 0, size = 20): Promise<PageResponse<Product>> {
        const query = buildQueryString({ page, size });
        return authenticatedFetch<PageResponse<Product>>(`/admin/products?${query}`);
    },

    /**
     * GET /api/v1/admin/products/{id}
     * Get product detail
     */
    async getById(id: number): Promise<Product> {
        return authenticatedFetch<Product>(`/admin/products/${id}`);
    },

    /**
     * POST /api/v1/admin/products
     * Create new product
     */
    async create(data: CreateProductRequest): Promise<Product> {
        return authenticatedFetch<Product>('/admin/products', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * PUT /api/v1/admin/products/{id}
     * Update product
     */
    async update(id: number, data: Partial<CreateProductRequest>): Promise<Product> {
        return authenticatedFetch<Product>(`/admin/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * DELETE /api/v1/admin/products/{id}
     * Soft delete product (set status to INACTIVE)
     */
    async delete(id: number): Promise<void> {
        return authenticatedFetch<void>(`/admin/products/${id}`, {
            method: 'DELETE',
        });
    },
};
