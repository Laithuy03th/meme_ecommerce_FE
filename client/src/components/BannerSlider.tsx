'use client';

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface BannerSliderProps {
  images: string[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({ images }) => {
  const swiperRef = useRef<SwiperType | null>(null);

  const bannerContent = [
    {
      title: "New Season Arrivals",
      subtitle: "Discover the latest trends in fashion and elevate your style.",
      buttonText: "Shop Collection",
      color: "from-purple-600 to-blue-600"
    },
    {
      title: "Exclusive Summer Sale",
      subtitle: "Up to 50% off on selected items. Don't miss out!",
      buttonText: "Explore Deals",
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Premium Accessories",
      subtitle: "Complete your look with our curated selection of accessories.",
      buttonText: "View Accessories",
      color: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl group mx-auto mt-6 border border-white/20">
      <Swiper
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        effect={'fade'}
        speed={1000}
        spaceBetween={0}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[Autoplay, Pagination, EffectFade]}
        className="w-full h-full"
      >
        {images.map((src, index) => {
          const content = bannerContent[index % bannerContent.length];
          return (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <Image
                  src={src}
                  alt={`Banner ${index + 1}`}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="object-cover animate-pulse-slow"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 max-w-5xl">
                  <div className="overflow-hidden mb-6">
                    <span className={`inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-sm md:text-base w-fit animate-fade-in-up`}>
                      Limited Time Offer
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    {content.title}
                  </h1>

                  <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    {content.subtitle}
                  </p>

                  <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <Link
                      href="/products"
                      className={`group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-slate-900 font-bold text-lg transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.6)] hover:scale-105 overflow-hidden`}
                    >
                      <span className="relative z-10">{content.buttonText}</span>
                      <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                      <div className={`absolute inset-0 bg-gradient-to-r ${content.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Navigation Buttons */}
      <div className="absolute bottom-10 right-10 z-10 flex gap-4">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all duration-300 hover:scale-110 group shadow-lg"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2} />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all duration-300 hover:scale-110 group shadow-lg"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default BannerSlider;