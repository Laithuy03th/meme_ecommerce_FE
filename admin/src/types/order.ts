export type OrderStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'PACKED'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELED'
    | 'RETURN_REQUESTED'
    | 'RETURNED'
    | 'REFUNDED';

export type PaymentStatus = 'UNPAID' | 'PAID' | 'FAILED' | 'REFUNDED';
// Bug #1 Fix: MOMO đã bị xóa khỏi BE — chỉ còn COD và VNPAY
export type PaymentMethod = 'COD' | 'VNPAY';

export interface OrderSummary {
    id: number;
    userEmail: string;
    shippingFullName: string;
    totalAmount: number;
    shippingFee: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    createdAt: string;
}

export interface OrderDetail extends OrderSummary {
    note?: string;
    userId: number;
    shippingPhone: string;
    shippingAddressLine1: string;
    shippingWard?: string;
    shippingDistrict?: string;
    shippingProvince?: string;
    shippingCountry?: string;
    updatedAt: string;
    items: OrderItem[];
}

export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
}

export interface UpdateOrderStatusRequest {
    status: OrderStatus;
}

// Bug #2 Fix: Đồng bộ với BE isValidTransition()
// SHIPPED chỉ được sang DELIVERED — khách chỉ được yêu cầu trả hàng SAU KHI nhận hàng (DELIVERED)
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    PENDING:          ['CONFIRMED', 'CANCELED'],
    CONFIRMED:        ['PACKED', 'CANCELED'],
    PACKED:           ['SHIPPED', 'CANCELED'],
    SHIPPED:          ['DELIVERED'],                     // ← Bỏ RETURN_REQUESTED (BE không cho phép)
    DELIVERED:        ['RETURN_REQUESTED', 'REFUNDED'],
    RETURN_REQUESTED: ['RETURNED', 'DELIVERED'],         // DELIVERED = Admin từ chối return
    RETURNED:         ['REFUNDED'],
    CANCELED:         [],                                // Terminal
    REFUNDED:         [],                                // Terminal
};

// Nhãn hiển thị tiếng Việt cho UI
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING:          'Chờ xác nhận',
    CONFIRMED:        'Đã xác nhận',
    PACKED:           'Đã đóng gói',
    SHIPPED:          'Đang vận chuyển',
    DELIVERED:        'Đã giao hàng',
    CANCELED:         'Đã hủy',
    RETURN_REQUESTED: 'Yêu cầu trả hàng',
    RETURNED:         'Đã trả hàng',
    REFUNDED:         'Đã hoàn tiền',
};

// Màu badge cho từng trạng thái
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
    PENDING:          'bg-yellow-100 text-yellow-800',
    CONFIRMED:        'bg-blue-100 text-blue-800',
    PACKED:           'bg-indigo-100 text-indigo-800',
    SHIPPED:          'bg-purple-100 text-purple-800',
    DELIVERED:        'bg-green-100 text-green-800',
    CANCELED:         'bg-red-100 text-red-800',
    RETURN_REQUESTED: 'bg-orange-100 text-orange-800',
    RETURNED:         'bg-gray-100 text-gray-800',
    REFUNDED:         'bg-teal-100 text-teal-800',
};
