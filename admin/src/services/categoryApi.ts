import { authenticatedFetch } from "./api";
import type { Category, CreateCategoryRequest } from "@/types/category";

export const categoryApi = {
    /**
     * GET /api/v1/categories
     * List all categories
     */
    async list(): Promise<Category[]> {
        return authenticatedFetch<Category[]>('/admin/categories');
    },

    /**
     * GET /api/v1/categories/{id}
     * Get category by ID
     */
    async getById(id: number): Promise<Category> {
        return authenticatedFetch<Category>(`/admin/categories/${id}`);
    },

    /**
     * POST /api/v1/categories
     * Create new category
     */
    async create(data: CreateCategoryRequest): Promise<Category> {
        return authenticatedFetch<Category>('/admin/categories', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * PUT /api/v1/categories/{id}
     * Update category
     */
    async update(id: number, data: CreateCategoryRequest): Promise<Category> {
        return authenticatedFetch<Category>(`/admin/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    /**
     * DELETE /api/v1/categories/{id}
     * Delete category
     */
    async delete(id: number): Promise<void> {
        return authenticatedFetch<void>(`/admin/categories/${id}`, {
            method: 'DELETE',
        });
    },
};
