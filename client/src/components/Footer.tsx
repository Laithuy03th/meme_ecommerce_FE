import Image from "next/image";
import Link from "next/link";
import { Phone, Facebook, Instagram, Mail, MapPin, ArrowRight, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-secondary" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* --- PHẦN TRÊN: LIÊN HỆ & ĐĂNG KÝ --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-slate-800 pb-12 mb-12">

          {/* Cột 1: Mua hàng */}
          <div className="flex items-start gap-4 group">
            <div className="p-3 bg-slate-800 rounded-2xl group-hover:bg-primary/20 transition-colors duration-300">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="uppercase font-bold text-white text-sm tracking-wider mb-1">Hotline Mua Hàng</p>
              <a href="tel:0967284444" className="text-2xl font-bold text-white hover:text-primary transition-colors">
                096728.4444
              </a>
              <p className="text-xs text-slate-500 mt-1">(8:30 - 22:00, Tất cả các ngày)</p>
            </div>
          </div>

          {/* Cột 2: Góp ý */}
          <div className="flex items-start gap-4 group">
            <div className="p-3 bg-slate-800 rounded-2xl group-hover:bg-secondary/20 transition-colors duration-300">
              <Mail className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="uppercase font-bold text-white text-sm tracking-wider mb-1">Góp ý, Khiếu nại</p>
              <a href="tel:0968959050" className="text-2xl font-bold text-white hover:text-secondary transition-colors">
                096.895.90.50
              </a>
              <p className="text-xs text-slate-500 mt-1">(8:00 - 17:00, Trừ ngày lễ)</p>
            </div>
          </div>

          {/* Cột 3: Đăng ký tin */}
          <div className="lg:col-span-2">
            <p className="uppercase font-bold text-white text-sm tracking-wider mb-4">Đăng ký nhận thông tin mới</p>
            <div className="flex relative group">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className="w-full pl-6 pr-32 py-4 bg-slate-800 border border-slate-700 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all duration-300"
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-gradient-to-r from-primary to-secondary text-white px-6 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center gap-2 group-hover:scale-[1.02]">
                Đăng ký <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* --- PHẦN DƯỚI: LINK & THÔNG TIN --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Cột 1: Hỗ trợ khách hàng */}
          <div>
            <h3 className="uppercase font-bold text-white mb-6 relative inline-block">
              Hỗ trợ khách hàng
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
            </h3>
            <ul className="flex flex-col gap-3">
              {['Hướng dẫn mua hàng', 'Hướng dẫn chọn size', 'Phương thức thanh toán', 'Chính sách vận chuyển', 'Chính sách bảo mật', 'Quy định đổi trả', 'Chính sách xử lý khiếu nại'].map((item) => (
                <li key={item}>
                  <Link href="/" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-primary transition-colors"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 2: Về chúng tôi */}
          <div>
            <h3 className="uppercase font-bold text-white mb-6 relative inline-block">
              Về chúng tôi
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-secondary rounded-full"></span>
            </h3>
            <div className="flex flex-col gap-4 text-sm leading-relaxed">
              <p className="font-bold text-white text-lg">HỘ KINH DOANH SHOP</p>
              <p className="flex gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Số 110 Phố Nhổn, Phường Tây Tựu, Quận Bắc Từ Liêm, Tp. Hà Nội</span>
              </p>
              <p><span className="font-bold text-white">Mã Số Doanh Nghiệp:</span> 01D-8004624</p>
              <p><span className="font-bold text-white">Email:</span> cntt@laithuy.vn</p>

              <div className="mt-4 w-40 opacity-80 hover:opacity-100 transition-opacity">
                <Image src="/bocongthuong.png" alt="Đã thông báo bộ công thương" width={160} height={60} className="object-contain" />
              </div>
            </div>
          </div>

          {/* Cột 3: Hệ thống cửa hàng */}
          <div>
            <h3 className="uppercase font-bold text-white mb-6 relative inline-block">
              Hệ thống cửa hàng
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-amber-500 rounded-full"></span>
            </h3>
            <div className="text-sm space-y-4">
              <div>
                <p className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Thành phố Hà Nội
                </p>
                <ul className="pl-4 border-l border-slate-700 space-y-2 text-slate-400">
                  <li>110 Phố Nhổn</li>
                  <li>1221 Giải Phóng</li>
                  <li>154 Quang Trung, Hà Đông</li>
                  <li>34 Trần Phú, Hà Đông</li>
                  <li>208 Bạch Mai</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Khu vực miền Nam
                </p>
                <ul className="pl-4 border-l border-slate-700 space-y-2 text-slate-400">
                  <li>225 Võ Văn Ngân, Thủ Đức</li>
                  <li>567 Quang Trung, P10, Gò Vấp</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cột 4: Fanpage Widget */}
          <div>
            <h3 className="uppercase font-bold text-white mb-6 relative inline-block">
              Kết nối với chúng tôi
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-500 rounded-full"></span>
            </h3>
            <div className="flex gap-4 mb-6">
              <Link href="https://www.facebook.com/Atino.vn" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-blue-600/30">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="https://www.instagram.com/atino.vn/" className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white hover:opacity-90 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-red-500/30">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>

            <div className="bg-slate-800 w-full h-48 flex items-center justify-center rounded-2xl overflow-hidden relative border border-slate-700 group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 font-bold text-slate-500 group-hover:text-white transition-colors">Fanpage Widget Area</span>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
          <p>&copy; 2024 MemeShop. All rights reserved. Designed with <Heart className="w-4 h-4 inline text-rose-500 fill-current animate-pulse" /> by Antigravity.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;