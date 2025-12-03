"use client";

import { ProductType } from "@/types";
import { Star, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { getSafeImageUrl, handleImageError } from "@/lib/imageUtils";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface BestSellersSliderProps {
    products: ProductType[];
}

const BestSellersSlider = ({ products }: BestSellersSliderProps) => {
    return (
        <div className="best-sellers-slider relative">
            <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={24}
                slidesPerView={1.2}
                loop={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                speed={800}
                navigation={{
                    nextEl: ".swiper-button-next-custom",
                    prevEl: ".swiper-button-prev-custom",
                }}
                pagination={{
                    clickable: true,
                    el: ".swiper-pagination-custom",
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 2.2,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 24,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 24,
                    },
                }}
                className="!pb-16"
            >
                {products.map((product) => {
                    const safeImage = getSafeImageUrl(
                        product.thumbnailUrl || product.image,
                        product.id,
                        product.name
                    );

                    return (
                        <SwiperSlide key={product.id}>
                            <Link
                                href={`/products/${product.id}`}
                                className="group block relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                            >
                                <Image
                                    src={safeImage}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => handleImageError(e, product.id, product.name)}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    className="w-4 h-4 fill-amber-400 text-amber-400"
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm opacity-80">(4.9)</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowRight className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-900 hover:bg-white hover:scale-110 transition-all -translate-x-6 hidden md:flex">
                <ArrowRight className="w-6 h-6 rotate-180" />
            </button>
            <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-900 hover:bg-white hover:scale-110 transition-all translate-x-6 hidden md:flex">
                <ArrowRight className="w-6 h-6" />
            </button>

            {/* Custom Pagination */}
            <div className="swiper-pagination-custom flex justify-center gap-2 mt-8"></div>

            <style jsx global>{`
        .best-sellers-slider .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #d1d5db;
          opacity: 1;
          transition: all 0.3s;
        }
        .best-sellers-slider .swiper-pagination-bullet-active {
          width: 32px;
          border-radius: 6px;
          background: linear-gradient(to right, #f59e0b, #f97316);
        }
      `}</style>
        </div>
    );
};

export default BestSellersSlider;
