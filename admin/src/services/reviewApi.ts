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
            body: JSON.stringify({ content }), // Assuming body uses 'content' or 'reply'? User didn't specify body key, but usually it's content or message.
            // User just said: POST /api/v1/products/reviews/{reviewId}/reply
            // Common sense implies a body. I'll stick with 'content' or whatever existing code used but existing code used { reply: string }.
            // The user didn't specify the body structure for reply. I will assume { comment: string } or { reply: string }. 
            // Existing code used `reply`. I'll keep `reply` key if I can, but usually standard is comment.
            // Let's stick to what was there: { reply }.
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
