"use client";

import useCartStore from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import useWishlistStore from "@/stores/wishlistStore";
import { ProductType } from "@/types";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Info } from "lucide-react";

// Map common color names (especially Vietnamese) to valid CSS hex codes
const getColorCode = (colorName: string) => {
  if (!colorName) return "#FFFFFF";
  if (colorName.startsWith("#") || colorName.startsWith("rgb")) return colorName;
  
  const colorMap: Record<string, string> = {
    "black": "#000000", "white": "#FFFFFF", "red": "#EF4444", "blue": "#3B82F6",
    "green": "#10B981", "yellow": "#F59E0B", "orange": "#F97316", "purple": "#8B5CF6",
    "pink": "#EC4899", "gray": "#6B7280", "brown": "#92400E", "silver": "#D1D5DB",
    "gold": "#FBBF24", "navy": "#1E3A8A", "beige": "#FDE68A",
    
    // Vietnamese Common Colors
    "đen": "#000000", "trắng": "#FFFFFF", "đỏ": "#EF4444", "xanh dương": "#3B82F6",
    "xanh lục": "#10B981", "xanh lá": "#10B981", "vàng": "#F59E0B", "cam": "#F97316",
    "tím": "#8B5CF6", "hồng": "#EC4899", "xám": "#6B7280", "nâu": "#92400E",
    "bạc": "#D1D5DB", "vàng đồng": "#FBBF24", "xanh navy": "#1E3A8A", "kem": "#FDE68A",
    
    // Apple Phone Specific Colors
    "titan tự nhiên": "#B6B5B0", "titan đen": "#4C4C4E", 
    "titan trắng": "#F2F1ED", "titan xanh": "#2E3B4E",
    "xanh rêu": "#3D4E41"
  };

  const normalized = colorName.toLowerCase().trim();
  // Return mapped, or attempt to use the string directly if valid
  return colorMap[normalized] || normalized; 
};

// Check if category is related to fashion/clothing
const isFashionCategory = (slug?: string) => {
  if (!slug) return false;
  const s = slug.toLowerCase();
  return s.includes("fashion") || 
         s.includes("thoi-trang") || 
         s.includes("ao") || 
         s.includes("quan") || 
         s.includes("vay") || 
         s.includes("clothing") || 
         s.includes("apparel") ||
         s.includes("giay") ||
         s.includes("shoes") ||
         s.includes("footwear");
};

// Standard international size mapping for height/weight
const sizeGuideMapping: Record<string, string> = {
  // Clothes
  "S": "Chiều cao 150cm - 160cm, Cân nặng 40kg - 50kg.",
  "M": "Chiều cao 160cm - 165cm, Cân nặng 50kg - 55kg.",
  "L": "Chiều cao 165cm - 170cm, Cân nặng 55kg - 60kg.",
  "XL": "Chiều cao 170cm - 175cm, Cân nặng 60kg - 65kg.",
  
  // Shoes (Standard length)
  "36": "Chiều dài chân ~22.5cm - 23.0cm.",
  "37": "Chiều dài chân ~23.0cm - 23.5cm.",
  "38": "Chiều dài chân ~23.5cm - 24.0cm.",
  "39": "Chiều dài chân ~24.0cm - 24.5cm.",
  "40": "Chiều dài chân ~24.5cm - 25.0cm.",
  "41": "Chiều dài chân ~25.0cm - 25.5cm.",
  "42": "Chiều dài chân ~25.5cm - 26.0cm."
};

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

  const { isAuthenticated } = useAuthStore();
  // ...

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${product.id}`); // Or current path
      return false;
    }
    if (!validateSelection()) return false;
    const variantId = getVariantId();
    await addToCart(product, quantity, variantId, color, size);
    return true;
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${product.id}`);
      return;
    }
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
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${product.id}`);
      return;
    }
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
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">Select Size</span>
              {isFashionCategory(product.categorySlug) && (
                <div className="group relative flex items-center gap-1 text-xs text-primary cursor-pointer hover:underline">
                  <Info className="w-3 h-3" />
                  <span>Size Guide</span>
                  <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-72 p-4 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 text-gray-700 animate-in fade-in zoom-in-95 duration-200">
                    <p className="font-bold mb-3 border-b pb-2 text-primary flex items-center gap-2">
                      <Info className="w-4 h-4" /> Bảng Quy Đổi Kích Cỡ
                    </p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[11px] font-bold text-gray-900 mb-1 uppercase tracking-wider">Quần áo (Áo, Váy)</p>
                        <ul className="space-y-1 text-[10px]">
                          <li><span className="font-semibold text-gray-600">S:</span> 150-160cm, 40-50kg</li>
                          <li><span className="font-semibold text-gray-600">M:</span> 160-165cm, 50-55kg</li>
                          <li><span className="font-semibold text-gray-600">L:</span> 165-170cm, 55-60kg</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-900 mb-1 uppercase tracking-wider">Giày dép (Chiều dài chân)</p>
                        <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                          <li><span className="font-semibold text-gray-600">36-37:</span> 22.5 - 23.5cm</li>
                          <li><span className="font-semibold text-gray-600">38-39:</span> 23.5 - 24.5cm</li>
                          <li><span className="font-semibold text-gray-600">40-41:</span> 24.5 - 25.5cm</li>
                          <li><span className="font-semibold text-gray-600">42:</span> 25.5 - 26cm</li>
                        </ul>
                      </div>
                    </div>
                    <p className="mt-3 pt-2 border-t text-[9px] text-gray-400 italic text-center">
                      *Thông số chỉ mang tính chất tham khảo
                    </p>
                  </div>
                </div>
              )}
            </div>
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
            
            {/* Show details for selected size if it's a fashion category */}
            {isFashionCategory(product.categorySlug) && size && sizeGuideMapping[size.toUpperCase()] && (
              <div className="mt-2 text-xs text-gray-600 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100 flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <Info className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                <p>
                  <span className="font-semibold text-blue-900">Size {size.toUpperCase()}:</span>{" "}
                  {sizeGuideMapping[size.toUpperCase()]}
                </p>
              </div>
            )}
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
                  <div className="w-8 h-8 rounded-full border border-black/10 shadow-sm flex items-center justify-center overflow-hidden" style={{ backgroundColor: getColorCode(c) }}>
                    {/* Fallback pattern/text if color isn't mapped properly or is too unique */}
                    {!getColorCode(c).startsWith("#") && !getColorCode(c).startsWith("rgb") && !["black","white","red","blue","green","yellow","orange","purple","pink","gray","brown","silver","gold","navy","beige"].includes(getColorCode(c)) && (
                        <span className="text-[10px] font-bold text-gray-500 uppercase leading-none drop-shadow-sm">{c.substring(0, 2)}</span>
                    )}
                  </div>
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
