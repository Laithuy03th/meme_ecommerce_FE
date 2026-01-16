import { authenticatedFetch } from './authenticatedFetch';
import { BASE_URL } from './base';

// ==================== REVIEW TYPES ====================
/**
 * Review Response từ BE
 */
export interface ReviewResponse {
    id: number;
    userFullName: string;
    productId: number;
    productName: string;
    productImage: string;
    rating: number;
    comment: string;
    imageUrl?: string; // Ảnh review user upload
    adminReply?: string;
    adminRepliedAt?: string;
    createdAt: string;
}

/**
 * Review Summary DTO (bao gồm thống kê sao)
 */
export interface ReviewSummaryDto {
    productId: number;
    averageRating: number;
    totalReviews: number;
    starCounts: Record<number, number>; // Map<Integer, Long> -> {5: 10, 4: 2, ...}
}

/**
 * Review Request (dùng khi gửi review mới)
 */
export interface ReviewRequest {
    rating: number; // 1-5
    comment?: string;
    imageUrl?: string;
    orderItemId: number; // Bắt buộc để xác thực user đã mua hàng
}

// ==================== REVIEW API ====================

/**
 * Lấy list review của 1 sản phẩm (Public - không cần đăng nhập)
 * @example reviewApi.getProductReviews(123)
 */
export const getProductReviews = async (productId: number): Promise<ReviewResponse[]> => {
    try {
        const url = `${BASE_URL}/products/${productId}/reviews`;
        console.log(`[API] Fetching reviews: ${url}`);

        const res = await fetch(url, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache, no-store' }
        });

        if (!res.ok) {
            console.warn(`[API] Failed to fetch reviews for product ${productId}: ${res.status}`);
            return [];
        }

        const data = await res.json();

        // Handle Paginated Response (nếu BE trả về Page<ReviewResponse>)
        if (data.content && Array.isArray(data.content)) {
            console.log(`[API] Reviews fetched (paginated): ${data.content.length} reviews`);
            return data.content;
        }

        // Handle Direct List Response (nếu BE trả về ReviewResponse[])
        if (Array.isArray(data)) {
            console.log(`[API] Reviews fetched (array): ${data.length} reviews`);
            return data;
        }

        console.warn(`[API] Unexpected review response format:`, data);
        return [];
    } catch (error) {
        console.error(`Error fetching reviews for product ${productId}:`, error);
        return [];
    }
};

/**
 * Lấy tóm tắt review (số sao TB, chart) (Public - không cần đăng nhập)
 * @example reviewApi.getReviewSummary(123)
 * Note: Assuming Summary endpoint follows similar pattern or is custom.
 * If backend doesn't support this, we handle 404 gracefully.
 */
export const getReviewSummary = async (productId: number): Promise<ReviewSummaryDto | null> => {
    try {
        // Trying likely path based on other endpoints, or assuming older path if distinct
        // Docs didn't specify summary, so we keep old path or try standard. 
        // Let's try /products/{id}/reviews/summary based on REST patterns
        const url = `${BASE_URL}/products/${productId}/reviews/summary`;
        console.log(`[API] Fetching review summary: ${url}`);

        const res = await fetch(url, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache, no-store' }
        });

        if (!res.ok) {
            // console.warn(`[API] Failed to fetch review summary for product ${productId}: ${res.status}`);
            return null;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        // console.error(`Error fetching review summary for product ${productId}:`, error);
        return null;
    }
};

/**
 * Gửi review mới (Cần Token đăng nhập)
 * @example reviewApi.addReview(123, { orderItemId: 456, rating: 5, comment: 'Great!' })
 */
export const createReview = async (productId: number, data: ReviewRequest): Promise<ReviewResponse> => {
    const res = await authenticatedFetch(`/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to submit review' }));
        throw new Error(error.message || error.error || 'Failed to submit review');
    }

    return res.json();
};

/**
 * Sửa review của chính mình
 * @example reviewApi.updateMyReview(10, { rating: 4, comment: 'Fixed' })
 */
export const updateMyReview = async (reviewId: number, data: Partial<ReviewRequest>): Promise<ReviewResponse> => {
    const res = await authenticatedFetch(`/products/reviews/${reviewId}/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to update review' }));
        throw new Error(error.message || 'Failed to update review');
    }

    return res.json();
};

/**
 * Xóa review của chính mình (Cần Token đăng nhập)
 * @example reviewApi.deleteMyReview(789)
 */
export const deleteMyReview = async (reviewId: number): Promise<void> => {
    const res = await authenticatedFetch(`/products/reviews/${reviewId}/me`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to delete review' }));
        throw new Error(error.message || 'Failed to delete review');
    }
};

/**
 * Lấy tất cả review của tôi (Cần Token đăng nhập)
 * @example reviewApi.getMyReviews()
 */
export const getMyReviews = async (): Promise<ReviewResponse[]> => {
    try {
        // Assuming this endpoint exists or is different. 
        // Docs didn't specify 'Get My Reviews', but 'deleteMyReview' implies it.
        // Keeping old path /reviews/me for now or checking if it should be /users/me/reviews?
        // Let's stick to /reviews/me for now unless it errors.
        const res = await authenticatedFetch('/users/me/reviews', { // Guessed pattern
            method: 'GET',
        });

        // Convert 404 to empty
        if (res.status === 404) return [];

        if (!res.ok) {
            return [];
        }

        return await res.json();
    } catch (error) {
        return [];
    }
};

/**
 * Kiểm tra/Lấy review cho 1 món hàng cụ thể trong đơn hàng
 * (Để hiển thị form edit nếu đã review)
 * @example reviewApi.getReviewByOrderItem(456)
 */
export const getReviewByOrderItem = async (orderItemId: number): Promise<ReviewResponse | null> => {
    try {
        // This is likely a custom helper. 
        // If not in new docs, we might need to rely on the Order Detail 'hasReviewed' flag.
        // But keeping it if backend supports it.
        const res = await authenticatedFetch(`/products/reviews/order-items/${orderItemId}`, { // Adjusted path guess
            method: 'GET',
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            return null;
        }

        return await res.json();
    } catch (error) {
        return null;
    }
};

const reviewApi = {
    getProductReviews,
    getReviewSummary,
    createReview,
    updateMyReview,
    deleteMyReview,
    getMyReviews,
    getReviewByOrderItem,
};

export default reviewApi;
