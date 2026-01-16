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
        const url = `${BASE_URL}/reviews/products/${productId}`;
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
 */
export const getReviewSummary = async (productId: number): Promise<ReviewSummaryDto | null> => {
    try {
        const url = `${BASE_URL}/reviews/products/${productId}/summary`;
        console.log(`[API] Fetching review summary: ${url}`);

        const res = await fetch(url, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache, no-store' }
        });

        if (!res.ok) {
            console.warn(`[API] Failed to fetch review summary for product ${productId}: ${res.status}`);
            return null;
        }

        const data = await res.json();
        console.log(`[API] Review summary fetched:`, data);
        return data;
    } catch (error) {
        console.error(`Error fetching review summary for product ${productId}:`, error);
        return null;
    }
};

/**
 * Gửi review mới (Cần Token đăng nhập)
 * @example reviewApi.addReview(123, { orderItemId: 456, rating: 5, comment: 'Great!' })
 */
export const addReview = async (productId: number, data: ReviewRequest): Promise<ReviewResponse> => {
    const res = await authenticatedFetch(`/reviews/products/${productId}`, {
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
 * Xóa review của chính mình (Cần Token đăng nhập)
 * @example reviewApi.deleteMyReview(789)
 */
export const deleteMyReview = async (reviewId: number): Promise<void> => {
    const res = await authenticatedFetch(`/reviews/${reviewId}/me`, {
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
        const res = await authenticatedFetch('/reviews/me', {
            method: 'GET',
        });

        if (!res.ok) {
            console.warn('[API] Failed to fetch my reviews:', res.status);
            return [];
        }

        return await res.json();
    } catch (error) {
        console.error('Error fetching my reviews:', error);
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
        const res = await authenticatedFetch(`/reviews/order-items/${orderItemId}`, {
            method: 'GET',
        });

        if (!res.ok) {
            if (res.status === 404) return null; // Chưa có review
            console.warn(`[API] Failed to fetch review for order item ${orderItemId}:`, res.status);
            return null;
        }

        return await res.json();
    } catch (error) {
        console.error(`Error fetching review for order item ${orderItemId}:`, error);
        return null;
    }
};

const reviewApi = {
    getProductReviews,
    getReviewSummary,
    addReview,
    deleteMyReview,
    getMyReviews,
    getReviewByOrderItem,
};

export default reviewApi;
