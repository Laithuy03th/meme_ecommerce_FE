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
    <button
      onClick={handleClick}
      className="relative p-2.5 rounded-full hover:bg-white/80 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 group border border-transparent hover:border-indigo-100"
    >
      <ShoppingCart className="w-5 h-5 text-slate-600 group-hover:text-indigo-500 transition-colors" />
      {totalItems > 0 && (
        <span className="absolute top-0 right-0 w-4 h-4 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-bounce">
          {totalItems}
        </span>
      )}
    </button>
  );
};

export default ShoppingCartIcon;
