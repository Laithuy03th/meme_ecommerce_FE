import { authenticatedFetch } from "./base";
import { AddressType, OrderType, PaginatedResponse, VoucherValidationResponse } from "@/types";

// Helper parse error từ BE response — dùng chung cho tất cả hàm
const parseError = async (res: Response, fallback: string): Promise<never> => {
    const text = await res.text().catch(() => "");
    try {
        const json = JSON.parse(text);
        throw new Error(json.message || fallback);
    } catch (e) {
        if (e instanceof Error && e.message !== fallback && text) throw e;
        throw new Error(fallback);
    }
};

// --- ADDRESS API ---

export const getAddresses = async (): Promise<AddressType[]> => {
    const res = await authenticatedFetch("/users/me/addresses");
    if (!res.ok) await parseError(res, "Failed to fetch addresses");
    return res.json();
};

export const createAddress = async (
    data: Omit<AddressType, "id" | "createdAt" | "default">
): Promise<AddressType> => {
    const res = await authenticatedFetch("/users/me/addresses", {
        method: "POST",
        body: JSON.stringify(data),
    });
    if (!res.ok) await parseError(res, "Failed to create address");
    return res.json();
};

export const updateAddress = async (
    id: number,
    data: Omit<AddressType, "id" | "createdAt" | "default">
): Promise<AddressType> => {
    const res = await authenticatedFetch(`/users/me/addresses/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    if (!res.ok) await parseError(res, "Failed to update address");
    return res.json();
};

export const deleteAddress = async (id: number): Promise<void> => {
    const res = await authenticatedFetch(`/users/me/addresses/${id}`, {
        method: "DELETE",
    });
    // BE trả 204 No Content — không có body để parse
    if (!res.ok) await parseError(res, "Failed to delete address");
};

export const setDefaultAddress = async (id: number): Promise<AddressType> => {
    const res = await authenticatedFetch(`/users/me/addresses/${id}/default`, {
        method: "POST",
    });
    if (!res.ok) await parseError(res, "Failed to set default address");
    return res.json();
};

// --- VOUCHER API ---

export const validateVoucher = async (
    code: string,
    orderAmount: number
): Promise<VoucherValidationResponse> => {
    const params = new URLSearchParams({
        code,
        orderAmount: orderAmount.toString(),
    });
    const res = await authenticatedFetch(`/vouchers/validate?${params.toString()}`);
    if (!res.ok) await parseError(res, "Invalid voucher");
    return res.json();
};

// --- ORDER API ---

export const checkout = async (data: {
    addressId: number;
    shippingMethodId: number;
    paymentMethod: string;
    voucherCode?: string;
    note?: string;
    selectedCartItemIds: number[];
    idempotencyKey?: string; // Chống click đặt hàng nhiều lần
}): Promise<OrderType> => {
    // BUG FIX: Tự sinh idempotencyKey nếu không được cung cấp
    // crypto.randomUUID() là Web API chuẩn — không cần thư viện
    const payload = {
        ...data,
        idempotencyKey: data.idempotencyKey ?? crypto.randomUUID(),
    };

    const res = await authenticatedFetch("/users/me/orders/checkout", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    if (!res.ok) await parseError(res, "Checkout failed");
    return res.json();
};

export const getOrders = async (
    page: number = 0,
    size: number = 20
): Promise<PaginatedResponse<OrderType>> => {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });
    const res = await authenticatedFetch(`/users/me/orders?${params.toString()}`);
    if (!res.ok) await parseError(res, "Failed to fetch orders");
    return res.json();
};

export const getOrder = async (id: number): Promise<OrderType> => {
    const res = await authenticatedFetch(`/users/me/orders/${id}`);
    if (!res.ok) await parseError(res, "Failed to fetch order details");
    return res.json();
};

export const cancelOrder = async (id: number, reason?: string): Promise<OrderType> => {
    const res = await authenticatedFetch(`/users/me/orders/${id}/cancel`, {
        method: "PUT",
        body: JSON.stringify({ reason }),
    });
    if (!res.ok) await parseError(res, "Failed to cancel order");
    return res.json();
};

export const returnOrder = async (id: number, reason: string): Promise<OrderType> => {
    const res = await authenticatedFetch(`/users/me/orders/${id}/return`, {
        method: "POST",
        body: JSON.stringify({ reason }),
    });
    if (!res.ok) await parseError(res, "Failed to return order");
    return res.json();
};

export const reorder = async (id: number): Promise<any> => {
    const res = await authenticatedFetch(`/users/me/orders/${id}/reorder`, {
        method: "POST",
    });
    if (!res.ok) await parseError(res, "Failed to reorder");
    return res.json();
};
