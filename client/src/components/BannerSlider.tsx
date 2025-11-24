'use client';

import React, { useRef } from 'react'; // 1. Import useRef
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper'; // Import kiểu dữ liệu Swiper để gợi ý code
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface BannerSliderProps {
  images: string[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({ images }) => {
  // 2. Tạo một biến tham chiếu để điều khiển Swiper
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative w-full aspect-[3/1] rounded-lg overflow-hidden shadow-lg group">
      <Swiper
        // 3. Gán swiper vào biến tham chiếu khi khởi tạo
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        spaceBetween={0}
        centeredSlides={true}
        loop={true} // Thêm loop=true để trượt vô hạn (hết ảnh cuối quay về ảnh đầu)
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        // Không cần prop navigation={{...}} phức tạp nữa vì ta tự xử lý onClick
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full h-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={`Banner ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                priority={index === 0}
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* --- NÚT PREVIOUS (Trái) --- */}
      {/* 4. Thêm sự kiện onClick gọi lệnh slidePrev() */}
      <button 
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute top-1/2 left-4 z-10 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100 duration-300"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
      </button>

      {/* --- NÚT NEXT (Phải) --- */}
      {/* 5. Thêm sự kiện onClick gọi lệnh slideNext() */}
      <button 
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute top-1/2 right-4 z-10 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100 duration-300"
      >
        <ChevronRight className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
      </button>
    </div>
  );
};

export default BannerSlider;