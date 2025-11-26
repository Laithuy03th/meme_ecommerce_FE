"use client";

import useCartStore from "@/stores/cartStore";
import { ProductType } from "@/types";
import { ShoppingCart, Star, Eye, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

const ProductCard = ({ product }: { product: ProductType }) => {
  const { addToCart } = useCartStore();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [currentImage, setCurrentImage] = useState(product.image);

  // Handle color selection on card
  const handleColorSelect = (e: React.MouseEvent, color: string) => {
    e.preventDefault(); // Prevent navigation
    setSelectedColor(color);
    if (product.variantImages && product.variantImages[color]) {
      setCurrentImage(product.variantImages[color]);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    addToCart({
      ...product,
      image: currentImage, // Use the currently displayed image (variant specific)
      quantity: 1,
      selectedSize: product.sizes?.[0],
      selectedColor: selectedColor || product.colors?.[0],
    });
    toast.success("Added to cart!");
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              New
            </span>
          )}
          {product.isSale && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Sale
            </span>
          )}
        </div>

        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              onClick={handleAddToCart}
              className="bg-white text-gray-900 p-3 rounded-full hover:bg-primary hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg"
              title="Add to Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button
              className="bg-white text-gray-900 p-3 rounded-full hover:bg-primary hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 shadow-lg"
              title="Quick View"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                toast.success("Added to wishlist!");
              }}
              className="bg-white text-gray-900 p-3 rounded-full hover:bg-primary hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-100 shadow-lg"
              title="Add to Wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-medium">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating || 0}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 line-clamp-2 mb-3 h-10">
            {product.description || product.shortDescription}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Color dots if available */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex -space-x-1">
                {product.colors.slice(0, 4).map((color, i) => (
                  <div
                    key={i}
                    onClick={(e) => handleColorSelect(e, color)}
                    className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${selectedColor === color ? "border-primary z-10" : "border-white"
                      }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
                {product.colors.length > 4 && (
                  <div className="w-5 h-5 rounded-full bg-gray-100 border border-white flex items-center justify-center text-[8px] text-gray-500">
                    +
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
