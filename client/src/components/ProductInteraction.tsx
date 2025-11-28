"use client";

import useCartStore from "@/stores/cartStore";
import useWishlistStore from "@/stores/wishlistStore";
import { ProductType } from "@/types";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProductInteraction = ({
  product,
  selectedSize: initialSize,
  selectedColor: initialColor,
  onColorChange,
}: {
  product: ProductType;
  selectedSize: string;
  selectedColor: string;
  onColorChange?: (color: string) => void;
}) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(initialSize);
  const [color, setColor] = useState(initialColor);
  const { addToCart, updateCartItem, setSelectedItems, cart } = useCartStore();
  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const router = useRouter();

  const isLiked = isInWishlist(product.id);

  // Sync quantity from cart if item exists
  useEffect(() => {
    const existingItem = cart.find(item =>
      item.productId === product.id &&
      (item.color === color || (!item.color && !color)) &&
      (item.size === size || (!item.size && !size))
    );

    if (existingItem) {
      setQuantity(existingItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [cart, product.id, color, size]);

  useEffect(() => {
    if (onColorChange) {
      onColorChange(color);
    }
  }, [color, onColorChange]);

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else {
      if (quantity > 1) {
        setQuantity((prev) => prev - 1);
      }
    }
  };

  const validateSelection = () => {
    if (product.sizes?.length && !size) {
      toast.error("Please select a size");
      return false;
    }
    if (product.colors?.length && !color) {
      toast.error("Please select a color");
      return false;
    }
    return true;
  };

  const getVariantId = () => {
    if (product.variants?.length) {
      const selectedVariant = product.variants.find(
        (v) =>
          (v.color?.toLowerCase() || "") === (color?.toLowerCase() || "") &&
          (v.size?.toLowerCase() || "") === (size?.toLowerCase() || "")
      );
      return selectedVariant?.id;
    }
    return undefined;
  };

  const handleAddToCart = async () => {
    if (!validateSelection()) return false;
    const variantId = getVariantId();
    await addToCart(product, quantity, variantId, color, size);
    return true;
  };

  const handleBuyNow = async () => {
    if (!validateSelection()) return;

    const variantId = getVariantId();

    // Check if item exists in cart
    const existingItem = cart.find(item =>
      item.productId === product.id &&
      (item.color === color || (!item.color && !color)) &&
      (item.size === size || (!item.size && !size))
    );

    if (existingItem) {
      // Update quantity if different
      if (existingItem.quantity !== quantity) {
        await updateCartItem(existingItem.id, quantity);
      }
      setSelectedItems([existingItem.id]);
    } else {
      // Add to cart
      await addToCart(product, quantity, variantId, color, size);
      // Find the newly added item to select it
      // We need to fetch cart again or wait for store to update?
      // addToCart is async and updates store.
      const { cart: newCart } = useCartStore.getState();
      const newItem = newCart.find(item =>
        item.productId === product.id &&
        (item.color === color || (!item.color && !color)) &&
        (item.size === size || (!item.size && !size))
      );
      if (newItem) {
        setSelectedItems([newItem.id]);
      }
    }

    router.push("/cart?step=2"); // Go to checkout (Address selection)
  };

  const handleToggleWishlist = () => {
    if (isLiked) {
      removeItem(product.id);
    } else {
      addItem(product.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* SELECTIONS */}
      <div className="space-y-4">
        {/* SIZE */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-900">Select Size</span>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-[3rem] px-3 py-2 rounded-lg text-sm font-medium border transition-all ${size === s
                    ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* COLOR */}
        {product.colors && product.colors.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-900">Select Color</span>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${color === c ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent hover:scale-110"
                    }`}
                  title={c}
                >
                  <div className="w-8 h-8 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: c.toLowerCase() }} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QUANTITY & ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
        <div className="flex items-center border border-gray-200 rounded-lg w-fit">
          <button
            className="p-3 hover:bg-gray-50 text-gray-500 transition-colors"
            onClick={() => handleQuantityChange("decrement")}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
          <button
            className="p-3 hover:bg-gray-50 text-gray-500 transition-colors"
            onClick={() => handleQuantityChange("increment")}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex gap-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all"
          >
            Buy Now
          </button>
          <button
            onClick={handleToggleWishlist}
            className={`p-3 border rounded-xl hover:bg-gray-50 transition-all ${isLiked
              ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300"
              : "border-gray-200 text-gray-500 hover:text-red-500 hover:border-gray-300"
              }`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInteraction;
