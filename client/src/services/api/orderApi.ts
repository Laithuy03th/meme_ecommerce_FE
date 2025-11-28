import { authenticatedFetch } from "./base";
import { AddressType, OrderType, PaginatedResponse, VoucherValidationResponse } from "@/types";

// --- ADDRESS API ---

export const getAddresses = async (): Promise<AddressType[]> => {
    const res = await authenticatedFetch("/users/me/addresses");
    if (!res.ok) throw new Error("Failed to fetch addresses");
    return res.json();
};

export const createAddress = async (data: Omit<AddressType, "id" | "createdAt" | "default">): Promise<AddressType> => {
    const res = await authenticatedFetch("/users/me/addresses", {
        method: "POST",
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create address");
    return res.json();
};

export const updateAddress = async (id: number, data: Omit<AddressType, "id" | "createdAt" | "default">): Promise<AddressType> => {
    const res = await authenticatedFetch(`/users/me/addresses/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update address");
    return res.json();
};

export const deleteAddress = async (id: number): Promise<void> => {
    const res = await authenticatedFetch(`/users/me/addresses/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete address");
};

export const setDefaultAddress = async (id: number): Promise<AddressType> => {
    const res = await authenticatedFetch(`/users/me/addresses/${id}/default`, {
        method: "POST",
    });
    if (!res.ok) throw new Error("Failed to set default address");
    return res.json();
};

// --- VOUCHER API ---

export const validateVoucher = async (code: string, orderAmount: number): Promise<VoucherValidationResponse> => {
    const params = new URLSearchParams({
        code: code,
        orderAmount: orderAmount.toString(),
    });

    const res = await authenticatedFetch(`/vouchers/validate?${params.toString()}`);
    if (!res.ok) {
        // Handle specific error messages from backend if needed
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Invalid voucher");
    }
    return res.json();
};

// --- ORDER API ---

export const checkout = async (data: { addressId: number; paymentMethod: string; note?: string; voucherCode?: string; selectedItemIds?: number[] }): Promise<OrderType> => {
    const res = await authenticatedFetch("/users/me/orders/checkout", {
        method: "POST",
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Checkout failed");
    }
    return res.json();
};

export const getOrders = async (page: number = 0, size: number = 20): Promise<PaginatedResponse<OrderType>> => {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });

    const res = await authenticatedFetch(`/users/me/orders?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
};

export const getOrder = async (id: number): Promise<OrderType> => {
    const res = await authenticatedFetch(`/users/me/orders/${id}`);
    if (!res.ok) throw new Error("Failed to fetch order details");
    return res.json();
};

export const cancelOrder = async (id: number, reason?: string): Promise<OrderType> => {
    const res = await authenticatedFetch(`/users/me/orders/${id}/cancel`, {
        method: "PUT",
        body: JSON.stringify({ reason }), // Backend might expect reason in body or just empty
    });
    if (!res.ok) throw new Error("Failed to cancel order");
    return res.json();
};

export const returnOrder = async (id: number, reason: string): Promise<OrderType> => {
    const res = await authenticatedFetch(`/users/me/orders/${id}/return`, {
        method: "POST",
        body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error("Failed to return order");
    return res.json();
};
