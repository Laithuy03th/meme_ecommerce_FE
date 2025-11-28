import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WishlistItemType } from "@/types";
import { addToWishlist, getWishlist, removeFromWishlist } from "@/services/api";
import { toast } from "react-toastify";
import { useAuthStore } from "./authStore";

interface WishlistState {
    wishlist: WishlistItemType[];
    isLoading: boolean;
    fetchWishlist: () => Promise<void>;
    addItem: (productId: number) => Promise<void>;
    removeItem: (productId: number) => Promise<void>;
    isInWishlist: (productId: number) => boolean;
    clearWishlist: () => void;
}

const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            wishlist: [],
            isLoading: false,

            fetchWishlist: async () => {
                const { isAuthenticated } = useAuthStore.getState();
                if (!isAuthenticated) return;

                set({ isLoading: true });
                try {
                    const data = await getWishlist();
                    set({ wishlist: data });
                } catch (error) {
                    console.error("Failed to fetch wishlist", error);
                } finally {
                    set({ isLoading: false });
                }
            },

            addItem: async (productId: number) => {
                const { isAuthenticated } = useAuthStore.getState();
                if (!isAuthenticated) {
                    toast.error("Please login to add items to wishlist");
                    return;
                }

                try {
                    // Optimistic update
                    // We can't fully optimistically update because we need the response for full details,
                    // but we can assume success for the icon state if we had the product details.
                    // For now, let's wait for API.
                    const newItem = await addToWishlist(productId);
                    set((state) => ({
                        wishlist: [...state.wishlist, newItem],
                    }));
                    toast.success("Added to wishlist");
                } catch (error) {
                    toast.error("Failed to add to wishlist");
                }
            },

            removeItem: async (productId: number) => {
                const { isAuthenticated } = useAuthStore.getState();
                if (!isAuthenticated) return;

                try {
                    await removeFromWishlist(productId);
                    set((state) => ({
                        wishlist: state.wishlist.filter((item) => item.productId !== productId),
                    }));
                    toast.success("Removed from wishlist");
                } catch (error) {
                    toast.error("Failed to remove from wishlist");
                }
            },

            isInWishlist: (productId: number) => {
                return get().wishlist.some((item) => item.productId === productId);
            },

            clearWishlist: () => set({ wishlist: [] }),
        }),
        {
            name: "wishlist-storage",
            partialize: (state) => ({ wishlist: state.wishlist }), // Persist wishlist
        }
    )
);

export default useWishlistStore;
