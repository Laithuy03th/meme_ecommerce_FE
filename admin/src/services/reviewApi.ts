import { authenticatedFetch, buildQueryString } from "./api";
import type { ReviewResponse } from "@/types/review";

export const reviewApi = {
    /**
     * GET /api/v1/admin/reviews
     * List reviews with pagination
     */
    async list(page = 0, size = 20): Promise<ReviewResponse> {
        const query = buildQueryString({ page, size });
        return authenticatedFetch<ReviewResponse>(`/admin/reviews?${query}`);
    },

    /**
     * POST /api/v1/products/reviews/{id}/reply
     * Reply to a review
     */
    async reply(id: number, content: string): Promise<void> {
        return authenticatedFetch<void>(`/products/reviews/${id}/reply`, {
            method: 'POST',
            body: JSON.stringify({ reply: content }),
        });
    },

    /**
     * DELETE /api/v1/products/reviews/{id}
     * Delete a review
     */
    async delete(id: number): Promise<void> {
        return authenticatedFetch<void>(`/products/reviews/${id}`, {
            method: 'DELETE',
        });
    },

    /**
     * PUT /api/v1/admin/reviews/{id}/visibility
     * Hide/Show review
     */
    async toggleVisibility(id: number): Promise<void> {
        return authenticatedFetch<void>(`/admin/reviews/${id}/visibility`, {
            method: 'PUT',
        });
    },
};
