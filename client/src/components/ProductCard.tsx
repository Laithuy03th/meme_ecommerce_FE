"use client";

import useCartStore from "@/stores/cartStore";
import useWishlistStore from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { ProductType } from "@/types";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getSafeImageUrl } from "@/lib/imageUtils";

const ProductCard = ({ product }: { product: ProductType }) => {
  const { addToCart } = useCartStore();
  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false); // Client-only state
  const [isMounted, setIsMounted] = useState(false);

  // Use safe image URL with fallback
  const mainImage = getSafeImageUrl(
    product.thumbnailUrl || product.image,
    product.id,
    product.name,
  );
  const [currentImage, setCurrentImage] = useState(mainImage);

  // Sync wishlist state only on client
  useEffect(() => {
    setIsMounted(true);
    setIsLiked(isInWishlist(product.id));
  }, [isInWishlist, product.id]);

  // Handle color selection on card
  const handleColorSelect = (e: React.MouseEvent, color: string) => {
    e.preventDefault(); // Prevent navigation
    setSelectedColor(color);
    if (product.variantImages && product.variantImages[color]) {
      setCurrentImage(product.variantImages[color]);
    }
  };

  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation

    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${currentPath}`);
      return;
    }

    const size = product.sizes?.[0];
    const color = selectedColor || product.colors?.[0];

    // Find matching variant
    const selectedVariant = product.variants?.find(
      (v) => v.color === color && v.size === size
    );
    const variantId = selectedVariant?.id;

    addToCart(product, 1, variantId, color, size);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${currentPath}`);
      return;
    }

    if (isLiked) {
      removeItem(product.id);
    } else {
      addItem(product.id);
    }
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full flex flex-col border border-gray-100 hover:border-primary/20">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-blue-500/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-blue-500/30 animate-fade-in-up">
              New
            </span>
          )}
          {product.isSale && (
            <span className="bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-rose-500/30 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Sale
            </span>
          )}
        </div>

        {/* Wishlist Button (Always visible on mobile, hover on desktop) */}
        {isMounted && (
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-4 right-4 z-20 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${isLiked
              ? "bg-rose-50 text-rose-500"
              : "bg-white/80 text-slate-400 hover:bg-white hover:text-rose-500"
              } ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-[-10px] opacity-0'} md:opacity-0 md:group-hover:opacity-100`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </button>
        )}

        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <SafeImage
            src={currentImage}
            productId={product.id}
            productName={product.name}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          />

          {/* Overlay Actions */}
          <div className="absolute inset-x-4 bottom-4 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
            <button
              onClick={handleAddToCart}
              className="w-full bg-white/90 backdrop-blur-md text-slate-900 py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 relative">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors text-lg">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-amber-700">{product.rating ? product.rating.toFixed(1) : "New"}</span>
            </div>
            {product.soldCount !== undefined && product.soldCount > 0 && (
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">Sold {product.soldCount}</span>
            )}
            {product.stockStatus !== "IN_STOCK" && (
              <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md block ml-auto">
                {product.stockStatus === "OUT_OF_STOCK" ? "Out of Stock" : "Low Stock"}
              </span>
            )}
          </div>

          <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10 leading-relaxed">
            {product.shortDesc || product.description || "Experience premium quality with our latest collection."}
          </p>

          <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-medium mb-0.5">Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                  {product.price.toLocaleString('vi-VN')}đ
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through decoration-slate-300">
                    {product.originalPrice.toLocaleString('vi-VN')}đ
                  </span>
                )}
              </div>
            </div>

            {/* Color dots */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex -space-x-2">
                {product.colors.slice(0, 3).map((color, i) => (
                  <div
                    key={i}
                    onClick={(e) => handleColorSelect(e, color)}
                    className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 hover:z-10 shadow-sm ${selectedColor === color ? "border-primary z-10 ring-2 ring-primary/20" : "border-white"
                      }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
                {product.colors.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-500">
                    +{product.colors.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
