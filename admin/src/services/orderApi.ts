import { authenticatedFetch, buildQueryString } from "./api";
import type { PageResponse } from "@/types/common";
import type { OrderSummary, OrderDetail, OrderStatus, UpdateOrderStatusRequest } from "@/types/order";

export const orderApi = {
    /**
     * GET /api/v1/admin/orders
     * List orders with pagination and status filter
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
     * Get order detail
     */
    async getById(orderId: number): Promise<OrderDetail> {
        return authenticatedFetch<OrderDetail>(`/admin/orders/${orderId}`);
    },

    /**
     * PATCH /api/v1/admin/orders/{orderId}/status
     * Update order status (with State Machine validation)
     * 
     * Allowed transitions:
     * - PENDING → CONFIRMED or CANCELED
     * - CONFIRMED → PACKED or CANCELED
     * - PACKED → SHIPPED or CANCELED
     * - SHIPPED → DELIVERED or RETURN_REQUESTED
     * - DELIVERED → RETURN_REQUESTED or REFUNDED
     * - RETURN_REQUESTED → RETURNED or DELIVERED
     * - RETURNED → REFUNDED
     * - CANCELED, REFUNDED → TERMINAL (no further changes)
     * 
     * @throws ApiError if transition is invalid
     */
    async updateStatus(orderId: number, newStatus: OrderStatus): Promise<OrderDetail> {
        return authenticatedFetch<OrderDetail>(`/admin/orders/${orderId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus } as UpdateOrderStatusRequest),
        });
    },
};
