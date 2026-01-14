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
export type PaymentMethod = 'COD' | 'VNPAY' | 'MOMO';

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

// State Machine - Allowed Transitions
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ['CONFIRMED', 'CANCELED'],
    CONFIRMED: ['PACKED', 'CANCELED'],
    PACKED: ['SHIPPED', 'CANCELED'],
    SHIPPED: ['DELIVERED', 'RETURN_REQUESTED'],
    DELIVERED: ['RETURN_REQUESTED', 'REFUNDED'],
    RETURN_REQUESTED: ['RETURNED', 'DELIVERED'],
    RETURNED: ['REFUNDED'],
    CANCELED: [],
    REFUNDED: [],
};
