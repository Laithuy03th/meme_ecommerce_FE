import { authenticatedFetch, buildQueryString } from "./api";
import type { PageResponse } from "@/types/common";
import type { OrderSummary, OrderDetail, OrderStatus, UpdateOrderStatusRequest } from "@/types/order";

export const orderApi = {
    /**
     * GET /api/v1/admin/orders
     * List all orders with pagination and optional status filter.
     */
    async list(
        status?: OrderStatus,
        page = 0,
        size = 20
    ): Promise<PageResponse<OrderSummary>> {
        const query = buildQueryString({
            page,
            size,
            ...(status && { status }),
        });
        return authenticatedFetch<PageResponse<OrderSummary>>(`/admin/orders?${query}`);
    },

    /**
     * GET /api/v1/admin/orders/{orderId}
     * Get full order detail.
     */
    async getById(orderId: number): Promise<OrderDetail> {
        return authenticatedFetch<OrderDetail>(`/admin/orders/${orderId}`);
    },

    /**
     * PUT /api/v1/admin/orders/{orderId}/status
     * Update order status — đi qua State Machine validation ở BE.
     *
     * Các chuyển trạng thái hợp lệ:
     * - PENDING          → CONFIRMED | CANCELED
     * - CONFIRMED        → PACKED    | CANCELED
     * - PACKED           → SHIPPED   | CANCELED
     * - SHIPPED          → DELIVERED
     * - DELIVERED        → RETURN_REQUESTED | REFUNDED
     * - RETURN_REQUESTED → RETURNED  | DELIVERED (admin từ chối)
     * - RETURNED         → REFUNDED
     * - CANCELED, REFUNDED → Terminal (không thể chuyển tiếp)
     *
     * @throws ApiError 400/422 nếu transition không hợp lệ
     */
    async updateStatus(orderId: number, newStatus: OrderStatus): Promise<OrderDetail> {
        return authenticatedFetch<OrderDetail>(`/admin/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus } as UpdateOrderStatusRequest),
        });
    },

    /**
     * PUT /api/v1/admin/orders/{orderId}/return/approve
     * Admin duyệt yêu cầu trả hàng: RETURN_REQUESTED → RETURNED (tự động hoàn stock).
     *
     * Fix: Trả về OrderDetail thay vì void —
     * BE luôn trả body đầy đủ, dùng data mới để update UI ngay mà không cần gọi thêm getById().
     */
    async approveReturn(orderId: number): Promise<OrderDetail> {
        return authenticatedFetch<OrderDetail>(`/admin/orders/${orderId}/return/approve`, {
            method: 'PUT',
        });
    },

    /**
     * PUT /api/v1/admin/orders/{orderId}/refund
     * Admin xác nhận đã hoàn tiền cho khách: RETURNED → REFUNDED.
     */
    async refundOrder(orderId: number): Promise<OrderDetail> {
        return authenticatedFetch<OrderDetail>(`/admin/orders/${orderId}/refund`, {
            method: 'PUT',
        });
    },
};
