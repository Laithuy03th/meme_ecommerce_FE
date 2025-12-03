"use client";

import useCartStore from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

const ShoppingCartIcon = () => {
  const { totalItems, hasHydrated } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/cart");
    } else {
      router.push("/cart");
    }
  };

  if (!hasHydrated) return null;

  return (
    <button onClick={handleClick} className="relative">
      <ShoppingCart className="w-4 h-4 text-gray-600" />
      <span className="absolute -top-3 -right-3 bg-amber-400 text-gray-600 rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium">
        {totalItems}
      </span>
    </button>
  );
};

export default ShoppingCartIcon;
