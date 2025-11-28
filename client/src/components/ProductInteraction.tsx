"use client";

import useCartStore from "@/stores/cartStore";
import { ProductType } from "@/types";
import { Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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
  const { addToCart } = useCartStore();
  const router = useRouter();

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

  const handleAddToCart = () => {
    // Validate selection if product has options
    if (product.sizes?.length && !size) {
      toast.error("Please select a size");
      return;
    }
    if (product.colors?.length && !color) {
      toast.error("Please select a color");
      return;
    }

    // Find the matching variant (case-insensitive)
    let variantId: number | undefined;

    if (product.variants?.length) {
      const selectedVariant = product.variants.find(
        (v) =>
          (v.color?.toLowerCase() || "") === (color?.toLowerCase() || "") &&
          (v.size?.toLowerCase() || "") === (size?.toLowerCase() || "")
      );
      variantId = selectedVariant?.id;

      console.log("Adding to cart from Detail:", {
        productName: product.name,
        color,
        size,
        variantId,
        variants: product.variants
      });

      if (!variantId) {
        console.warn("No matching variant found for selected options");
        // If we can't find a variant but should have one, maybe we shouldn't proceed?
        // But for now, let's try sending what we have.
      }
    }

    addToCart(product, quantity, variantId, color, size);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
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
          <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-500 hover:text-red-500">
            <Heart className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInteraction;
