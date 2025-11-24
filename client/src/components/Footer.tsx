import Image from "next/image";
import Link from "next/link";
import { Phone, Facebook, Instagram, ShoppingBag } from "lucide-react"; // Import icon

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 pt-10 pb-6 border-t border-gray-200 text-sm">
      <div className="container mx-auto px-4">
        {/* --- PHẦN TRÊN: LIÊN HỆ & ĐĂNG KÝ --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-gray-200 pb-10 mb-10">
          
          {/* Cột 1: Mua hàng */}
          <div className="flex items-start gap-3">
            <Phone className="w-6 h-6 text-red-600 mt-1" />
            <div>
              <p className="uppercase font-semibold text-gray-800 mb-1">Gọi mua hàng (8:30 - 22:00)</p>
              <a href="tel:0967284444" className="text-2xl font-bold text-red-600 hover:text-red-700">
                096728.4444
              </a>
              <p className="text-xs text-gray-500 mt-1">Tất cả các ngày trong tuần</p>
            </div>
          </div>

          {/* Cột 2: Góp ý */}
          <div className="flex items-start gap-3">
            <Phone className="w-6 h-6 text-red-600 mt-1" />
            <div>
              <p className="uppercase font-semibold text-gray-800 mb-1">Góp ý, khiếu nại (8:00 - 17:00)</p>
              <a href="tel:0968959050" className="text-2xl font-bold text-red-600 hover:text-red-700">
                096.895.90.50
              </a>
              <p className="text-xs text-gray-500 mt-1">Các ngày trong tuần (trừ ngày lễ)</p>
            </div>
          </div>

          {/* Cột 3: Đăng ký tin */}
          <div className="lg:col-span-1">
            <p className="uppercase font-semibold text-gray-800 mb-3">Đăng ký nhận thông tin mới</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Nhập email của bạn tại đây..." 
                className="w-full px-3 py-2 border-2 border-gray-400 focus:outline-none focus:border-black text-sm"
              />
              <button className="bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 whitespace-nowrap">
                Đăng ký
              </button>
            </div>
          </div>

          {/* Cột 4: Theo dõi */}
          <div>
            <p className="uppercase font-semibold text-gray-800 mb-3">Theo dõi chúng tôi</p>
            <div className="flex gap-3">
              <Link href="https://www.facebook.com/Atino.vn" className="hover:opacity-75"><Facebook className="w-6 h-6 text-gray-800" /></Link>
              <Link href="https://www.instagram.com/atino.vn/" className="hover:opacity-75"><Instagram className="w-6 h-6 text-gray-800" /></Link>
              {/* Shopee & Lazada thường dùng Icon ảnh hoặc SVG riêng, ở đây dùng tạm Icon đại diện */}
              <Link href="https://shopee.vn/atino.vn?af_click_lookback=7d&af_reengagement_window=7d&af_siteid=an_17171860000&af_sub_siteid=sellervn-439115986&af_viewthrough_lookback=1d&c=-&deep_and_deferred=1&is_retargeting=true&pid=affiliates&uls_trackid=547ie6b0025u&utm_campaign=-&utm_content=sellervn-439115986&utm_medium=affiliates&utm_source=an_17171860000&utm_term=dz9k6h35vbzg&v4=1" className="hover:opacity-75"><Image src="/shopee_black.png" alt="Shopee" width={24} height={24} className="text-gray-800 -mt-1" /></Link>
            </div>
          </div>
        </div>

        {/* --- PHẦN DƯỚI: LINK & THÔNG TIN --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Cột 1: Hỗ trợ khách hàng */}
          <div>
            <h3 className="uppercase font-semibold text-gray-800 mb-4">Hỗ trợ khách hàng</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/" className="hover:text-black transition-colors">Hướng dẫn mua hàng</Link></li>
              <li><Link href="/" className="hover:text-black transition-colors">Hướng dẫn chọn size</Link></li>
              <li><Link href="/" className="hover:text-black transition-colors">Phương thức thanh toán</Link></li>
              <li><Link href="/" className="hover:text-black transition-colors">Chính sách vận chuyển</Link></li>
              <li><Link href="/" className="hover:text-black transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="/" className="hover:text-black transition-colors">Quy định đổi trả</Link></li>
              <li><Link href="/" className="hover:text-black transition-colors">Chính sách xử lý khiếu nại</Link></li>
            </ul>
          </div>

          {/* Cột 2: Về chúng tôi */}
          <div>
            <h3 className="uppercase font-semibold text-gray-800 mb-4">Về chúng tôi</h3>
            <div className="flex flex-col gap-3 text-gray-600">
              <p><span className="font-semibold">HỘ KINH DOANH SHOP</span></p>
              <p>
                <span className="font-semibold">Địa Chỉ:</span> Số 110 Phố Nhổn, Phường Tây Tựu, Quận Bắc Từ Liêm, Tp. Hà Nội
              </p>
              <p><span className="font-semibold">Mã Số Doanh Nghiệp:</span> 01D-8004624</p>
              <p><span className="font-semibold">Email:</span> cntt@laithuy.vn</p>
              
              {/* Ảnh bộ công thương - Bạn cần tải ảnh về folder public */}
              <div className="mt-4 w-40">
                <Image src="/bocongthuong.png" alt="Đã thông báo bộ công thương" width={160} height={60} className="object-contain" />
              </div>
            </div>
          </div>

          {/* Cột 3: Hệ thống cửa hàng */}
          <div>
            <h3 className="uppercase font-semibold text-gray-800 mb-4">Hệ thống cửa hàng</h3>
            <div className="text-gray-600">
              <p className="font-semibold mb-2">Thành phố Hà Nội:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1 text-xs leading-relaxed">
                <li>110 Phố Nhổn</li>
                <li>1221 Giải Phóng</li>
                <li>154 Quang Trung, Hà Đông</li>
                <li>34 Trần Phú, Hà Đông</li>
                <li>208 Bạch Mai</li>
                <li>175 Chùa Bộc</li>
                <li>116 Cầu Giấy</li>
                <li>290 Nguyễn Trãi, Trung Văn</li>
                <li>312 Khu 6 Trạm Trôi, Hoài Đức</li>
                <li>195 Quang Trung, Tx.Sơn Tây</li>
              </ul>
              <p className="font-semibold mt-3 mb-2">Khu vực miền Nam:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1 text-xs">
                 <li>225 Võ Văn Ngân, Thủ Đức</li>
                 <li>567 Quang Trung, P10, Gò Vấp</li>
              </ul>
            </div>
          </div>

          {/* Cột 4: Fanpage Widget */}
          <div>
             <h3 className="uppercase font-semibold text-gray-800 mb-4">Fanpage</h3>
             {/* Đây là chỗ nhúng widget FB hoặc ảnh chụp */}
             <div className="bg-gray-200 w-full h-48 flex items-center justify-center rounded-md overflow-hidden relative">
                <Image src="/fanpage-placeholder.png" alt="Fanpage" fill className="object-cover opacity-50" />
                <span className="relative z-10 font-semibold text-gray-600">Fanpage Widget Area</span>
             </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;