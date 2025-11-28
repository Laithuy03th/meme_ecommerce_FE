import { authenticatedFetch } from "./base";
import { WishlistItemType } from "@/types";

export const getWishlist = async (): Promise<WishlistItemType[]> => {
    const res = await authenticatedFetch("/users/me/wishlist");
    if (!res.ok) throw new Error("Failed to fetch wishlist");
    return res.json();
};

export const addToWishlist = async (productId: number): Promise<WishlistItemType> => {
    const res = await authenticatedFetch(`/users/me/wishlist/${productId}`, {
        method: "POST",
    });
    if (!res.ok) throw new Error("Failed to add to wishlist");
    return res.json();
};

export const removeFromWishlist = async (productId: number): Promise<void> => {
    const res = await authenticatedFetch(`/users/me/wishlist/${productId}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to remove from wishlist");
};
