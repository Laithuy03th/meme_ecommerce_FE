import { CartStoreActionsType, CartStoreStateType } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getCart, addToCart, updateCartItem, removeCartItem } from "@/services/api";
import { useAuthStore } from "./authStore";
import { toast } from "react-toastify";

const useCartStore = create<CartStoreStateType & CartStoreActionsType>()(
  persist(
    (set, get) => ({
      cart: [],
      cartId: null,
      totalAmount: 0,
      totalItems: 0,
      hasHydrated: false,
      isLoading: false,

      fetchCart: async () => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (!isAuthenticated) return;

        set({ isLoading: true });
        try {
          const cartData = await getCart();
          set({
            cart: cartData.items,
            cartId: cartData.id,
            totalAmount: cartData.totalAmount,
            totalItems: cartData.totalItems,
          });
        } catch (error: any) {
          console.error("Failed to fetch cart:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      addToCart: async (product, quantity, variantId, color, size) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (!isAuthenticated) {
          toast.error("Please login to add items to cart");
          return;
        }

        set({ isLoading: true });
        try {
          const cartData = await addToCart({
            productId: product.id,
            variantId: variantId,
            quantity: quantity,
          });
          set({
            cart: cartData.items,
            cartId: cartData.id,
            totalAmount: cartData.totalAmount,
            totalItems: cartData.totalItems,
          });
          toast.success("Added to cart!");
        } catch (error: any) {
          console.error("Failed to add to cart:", error);
          const message = error.message === "Failed to fetch"
            ? "Network error. Please check if backend is running."
            : (error.message || "Failed to add to cart");
          toast.error(message);
        } finally {
          set({ isLoading: false });
        }
      },

      updateCartItem: async (itemId, quantity) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (!isAuthenticated) return;

        // Optimistic update
        const previousCart = get().cart;
        set((state) => ({
          cart: state.cart.map(item => item.id === itemId ? { ...item, quantity } : item)
        }));

        try {
          const cartData = await updateCartItem(itemId, quantity);
          set({
            cart: cartData.items,
            cartId: cartData.id,
            totalAmount: cartData.totalAmount,
            totalItems: cartData.totalItems,
          });
        } catch (error: any) {
          console.error("Failed to update cart item:", error);
          set({ cart: previousCart }); // Revert on error
          toast.error(error.message || "Failed to update quantity");
        }
      },

      removeFromCart: async (itemId) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (!isAuthenticated) return;

        set({ isLoading: true });
        try {
          const cartData = await removeCartItem(itemId);
          set({
            cart: cartData.items,
            cartId: cartData.id,
            totalAmount: cartData.totalAmount,
            totalItems: cartData.totalItems,
          });
          toast.success("Item removed from cart");
        } catch (error: any) {
          console.error("Failed to remove cart item:", error);
          toast.error(error.message || "Failed to remove item");
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => set({ cart: [], totalAmount: 0, totalItems: 0, cartId: null }),

      syncCart: async () => {
        await get().fetchCart();
      }
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);

export default useCartStore;
