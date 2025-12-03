"use client";

import ProductInteraction from "@/components/ProductInteraction";
import { ProductType } from "@/types";
import { Star, Truck, ShieldCheck, RotateCcw, Sparkles, Award, BadgeCheck } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import { useState, useEffect } from "react";
import { getSafeImageUrl, getSafeImageArray } from "@/lib/imageUtils";

const ProductView = ({
    product,
    initialSize,
    initialColor,
    reviewsCount,
}: {
    product: ProductType;
    initialSize: string;
    initialColor: string;
    reviewsCount: number;
}) => {
    const [selectedColor, setSelectedColor] = useState(initialColor);

    // Get safe images with fallback
    const safeImages = getSafeImageArray(product.images, product.id, product.name);
    const safeMainImage = getSafeImageUrl(product.image, product.id, product.name);
    const [currentImage, setCurrentImage] = useState(safeImages[0] || safeMainImage);

    // Update image when color changes
    useEffect(() => {
        if (product.variantImages && product.variantImages[selectedColor]) {
            const variantImage = getSafeImageUrl(product.variantImages[selectedColor], product.id, product.name);
            setCurrentImage(variantImage);
        } else {
            setCurrentImage(safeMainImage);
        }
    }, [selectedColor, product, safeMainImage]);

    const averageRating = product.rating || 4.5;

    return (
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
            {/* IMAGE GALLERY */}
            <div className="w-full lg:w-1/2 space-y-6">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 shadow-xl group">
                    <SafeImage
                        src={currentImage}
                        productId={product.id}
                        productName={product.name}
                        alt={product.name}
                        fill
                        className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                        priority
                    />
                    {product.isSale && (
                        <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl animate-pulse-slow">
                            SALE
                        </div>
                    )}
                    {product.isNew && (
                        <div className="absolute top-6 right-6 bg-gradient-to-r from-primary to-secondary text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-xl flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            NEW
                        </div>
                    )}
                </div>
                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-4">
                    {safeImages.map((img, i) => (
                        <div
                            key={i}
                            className={`relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all shadow-sm hover:shadow-lg ${currentImage === img
                                ? "border-primary ring-4 ring-primary/20 scale-105"
                                : "border-gray-200 hover:border-primary/50"
                                }`}
                            onClick={() => setCurrentImage(img)}
                        >
                            <SafeImage
                                src={img}
                                productId={product.id}
                                productName={product.name}
                                alt=""
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* DETAILS */}
            <div className="w-full lg:w-1/2 flex flex-col gap-8">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                    {/* Category Badge */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2 rounded-full mb-4">
                        <BadgeCheck className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-primary">{product.categoryName || "Premium Collection"}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">{product.name}</h1>

                    <div className="flex items-center gap-6 mb-6">
                        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className={`w-5 h-5 ${s <= averageRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                                ))}
                            </div>
                            <span className="text-lg font-bold text-gray-900">{averageRating}</span>
                        </div>
                        <span className="text-gray-600 font-medium">({reviewsCount} reviews)</span>
                    </div>

                    <div className="flex items-baseline gap-4 mb-6">
                        <h2 className="text-5xl font-black">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                ${product.price.toFixed(2)}
                            </span>
                        </h2>
                        {product.originalPrice && (
                            <span className="text-2xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                        )}
                        {product.isSale && (
                            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                Save ${(product.originalPrice! - product.price).toFixed(2)}
                            </span>
                        )}
                    </div>

                    <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                    <ProductInteraction
                        product={product}
                        selectedSize={initialSize}
                        selectedColor={selectedColor}
                        onColorChange={setSelectedColor}
                    />
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/30 transition-all group">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Truck className="w-7 h-7 text-green-600" />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-gray-900 block">Free Shipping</span>
                            <span className="text-xs text-gray-500">On orders $50+</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/30 transition-all group">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-7 h-7 text-blue-600" />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-gray-900 block">2 Year Warranty</span>
                            <span className="text-xs text-gray-500">Full coverage</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/30 transition-all group">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <RotateCcw className="w-7 h-7 text-purple-600" />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-gray-900 block">30 Days Return</span>
                            <span className="text-xs text-gray-500">Money back</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductView;
