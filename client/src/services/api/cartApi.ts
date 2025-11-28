import { CartType } from "@/types";
import { ApiError, authenticatedFetch } from "./base";

export const getCart = async (): Promise<CartType> => {
    try {
        const res = await authenticatedFetch("/users/me/cart", {
            cache: "no-store",
        });

        if (!res.ok) {
            if (res.status === 401) throw new ApiError("Unauthorized", 401);
            throw new ApiError("Failed to fetch cart", res.status);
        }
        return res.json();
    } catch (error) {
        console.error("Get Cart Error:", error);
        throw error;
    }
};

export const addToCart = async (data: { productId: number; variantId?: number | null; quantity: number }): Promise<CartType> => {
    // Ensure variantId is null if undefined/missing
    const payload = {
        ...data,
        variantId: data.variantId ?? null
    };

    console.log("Adding to cart payload:", payload);

    try {
        const res = await authenticatedFetch("/users/me/cart/items", {
            method: "POST",
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error("Add to cart failed response:", res.status, errorData);

            if (res.status === 401) throw new ApiError("Session expired", 401);
            throw new ApiError(errorData.message || "Failed to add to cart", res.status);
        }
        return res.json();
    } catch (error) {
        console.error("Add to Cart Network Error:", error);
        throw error;
    }
};

export const updateCartItem = async (itemId: number, quantity: number): Promise<CartType> => {
    try {
        const res = await authenticatedFetch(`/users/me/cart/items/${itemId}`, {
            method: "PUT",
            body: JSON.stringify({ quantity }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            if (res.status === 401) throw new ApiError("Session expired", 401);
            throw new ApiError(errorData.message || "Failed to update cart item", res.status);
        }
        return res.json();
    } catch (error) {
        console.error("Update Cart Item Error:", error);
        throw error;
    }
};

export const removeCartItem = async (itemId: number): Promise<CartType> => {
    try {
        const res = await authenticatedFetch(`/users/me/cart/items/${itemId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            if (res.status === 401) throw new ApiError("Session expired", 401);
            throw new ApiError(errorData.message || "Failed to remove cart item", res.status);
        }
        return res.json();
    } catch (error) {
        console.error("Remove Cart Item Error:", error);
        throw error;
    }
};
