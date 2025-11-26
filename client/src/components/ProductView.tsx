"use client";

import ProductInteraction from "@/components/ProductInteraction";
import { ProductType } from "@/types";
import { Star, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

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
    const [currentImage, setCurrentImage] = useState(product.image);

    // Update image when color changes
    useEffect(() => {
        if (product.variantImages && product.variantImages[selectedColor]) {
            setCurrentImage(product.variantImages[selectedColor]);
        } else {
            // Fallback to main image if no variant image
            setCurrentImage(product.image);
        }
    }, [selectedColor, product]);

    return (
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
            {/* IMAGE GALLERY */}
            <div className="w-full lg:w-1/2 space-y-4">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                    <Image
                        src={currentImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-all duration-500 ease-in-out"
                        priority
                    />
                </div>
                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-4">
                    {product.images?.map((img, i) => (
                        <div
                            key={i}
                            className={`relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all ${currentImage === img ? "border-primary ring-2 ring-primary ring-offset-1" : "border-gray-200 hover:border-primary"
                                }`}
                            onClick={() => setCurrentImage(img)}
                        >
                            <Image src={img} alt="" fill className="object-cover" />
                        </div>
                    ))}
                </div>
            </div>

            {/* DETAILS */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`w-4 h-4 ${s <= (product.rating || 0) ? "fill-current" : "text-gray-300"}`} />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500">({reviewsCount} reviews)</span>
                    </div>
                </div>

                <div className="flex items-baseline gap-4">
                    <h2 className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</h2>
                    {product.originalPrice && (
                        <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                    )}
                    {product.isSale && (
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                            Save ${(product.originalPrice! - product.price).toFixed(2)}
                        </span>
                    )}
                </div>

                <p className="text-gray-600 leading-relaxed">{product.description}</p>

                <div className="h-px bg-gray-200 my-2" />

                <ProductInteraction
                    product={product}
                    selectedSize={initialSize}
                    selectedColor={selectedColor}
                    onColorChange={setSelectedColor}
                />

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="flex flex-col items-center text-center gap-2 p-4 bg-gray-50 rounded-xl">
                        <Truck className="w-6 h-6 text-primary" />
                        <span className="text-xs font-medium text-gray-600">Free Shipping</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2 p-4 bg-gray-50 rounded-xl">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                        <span className="text-xs font-medium text-gray-600">2 Year Warranty</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2 p-4 bg-gray-50 rounded-xl">
                        <RotateCcw className="w-6 h-6 text-primary" />
                        <span className="text-xs font-medium text-gray-600">30 Days Return</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductView;
