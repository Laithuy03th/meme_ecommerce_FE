"use client";

import { Clock, Mail, MapPin, Phone, Send, ShieldCheck, Smile, Truck, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

const AboutPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            toast.success("Thank you! Your message has been sent to our meme experts.");
            setIsSubmitting(false);
            (e.target as HTMLFormElement).reset();
        }, 1500);
    };

    return (
        <div className="bg-white">
            {/* 1. Hero Section */}
            <section className="relative h-[400px] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="https://images.unsplash.com/photo-1531297461136-82lw9z1.jpg" // Abstract playful background
                        alt="Background"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="relative z-10 text-center max-w-3xl px-6 animate-fade-in-up">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/50 text-sm font-semibold mb-4 backdrop-blur-sm">
                        Since 2024
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        We Sell Keyboards, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">But Mostly Happiness.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                        Chào mừng đến với MemeShop - Nơi công nghệ gặp gỡ sự hài hước. Chúng tôi không chỉ bán Gear, chúng tôi bán trải nghiệm "gõ phím ra tiếng cười".
                    </p>
                </div>
            </section>

            {/* 2. Our Story & Values */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">Câu Chuyện Của Chúng Tôi</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Bắt đầu từ một căn phòng trọ nhỏ vào năm 2024, MemeShop ra đời với một ý tưởng đơn giản: "Tại sao mua đồ công nghệ lại cứ phải khô khan?".
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Chúng tôi tin rằng mỗi cú click chuột, mỗi lần gõ phím đều xứng đáng là một niềm vui. Tại MemeShop, bạn sẽ tìm thấy những món đồ độc, lạ, và chất lượng nhất hệ mặt trời.
                        </p>

                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Uy Tín 100%</h4>
                                    <p className="text-sm text-gray-500">Hàng chính hãng, bảo hành "tới bến".</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-green-100 rounded-xl text-green-600">
                                    <Smile className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Hỗ Trợ Vui Vẻ</h4>
                                    <p className="text-sm text-gray-500">Nhân viên tư vấn nhiệt tình, bao hài.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl skew-y-3 transform hover:skew-y-0 transition-all duration-500">
                        <Image
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                            alt="Our Team"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* 3. Funny Stats */}
            <section className="bg-gray-50 py-16 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="p-6">
                            <h3 className="text-4xl font-black text-gray-900 mb-2">999+</h3>
                            <p className="text-gray-600 font-medium">Đơn Hàng Đã Giao</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-4xl font-black text-primary mb-2">24/7</h3>
                            <p className="text-gray-600 font-medium">Hỗ Trợ Khách Hàng</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-4xl font-black text-gray-900 mb-2">5⭐</h3>
                            <p className="text-gray-600 font-medium">Đánh Giá Tuyệt Đối</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-4xl font-black text-primary mb-2">∞</h3>
                            <p className="text-gray-600 font-medium">Niềm Vui Mang Lại</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Contact & Location Info */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Liên Hệ Với MemeShop</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Bạn có thắc mắc? Cần tư vấn chọn Gear? Hay đơn giản là muốn tâm sự? Đừng ngần ngại, hãy liên hệ ngay với biệt đội MemeShop!
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Cards */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-xl mb-2">Địa Chỉ Shop</h4>
                            <p className="text-gray-600">
                                KTX B10 Đại học Bách Khoa<br />
                                Hai Bà Trưng, Hà Nội, Việt Nam
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                                <Phone className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-xl mb-2">Hotline 24/7</h4>
                            <p className="text-gray-600 mb-1">+84 979 753 680</p>
                            <p className="text-sm text-gray-400">Gọi lúc nào cũng được (trừ lúc ngủ)</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-xl mb-2">Email Hỗ Trợ</h4>
                            <p className="text-gray-600">support@memeshop.vn</p>
                            <p className="text-gray-600">meme.department@memeshop.vn</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 bg-gray-50 rounded-3xl p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="w-6 h-6 text-gray-700" />
                            <h3 className="text-2xl font-bold text-gray-900">Gửi Thắc Mắc</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên của bạn</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-white"
                                        placeholder="Để chúng mình tiện xưng hô"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-white"
                                        placeholder="Để gửi phản hồi lại nè"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Chủ đề cần hỗ trợ</label>
                                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-white">
                                    <option>Tư vấn sản phẩm</option>
                                    <option>Hỗ trợ kỹ thuật</option>
                                    <option>Khiếu nại (nhẹ nhàng thôi nhé)</option>
                                    <option>Góp ý xây dựng</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung chi tiết</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-white resize-none"
                                    placeholder="Bạn muốn nhắn nhủ điều gì..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full md:w-auto px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg flex items-center justify-center gap-2 group"
                            >
                                {isSubmitting ? (
                                    <>Đang gửi... <Clock className="w-4 h-4 animate-spin" /></>
                                ) : (
                                    <>Gửi Ngay <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* 5. Map Embed */}
            <section className="h-[400px] w-full relative bg-gray-200">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.636069904975!2d105.84279831533202!3d21.006216993888362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac76ccab6dd7%3A0x55e92a5b07a97d03!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBCw6FjaCBraG9hIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1620000000000!5m2!1svi!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(0.3)' }}
                    allowFullScreen={true}
                    loading="lazy"
                    title="MemeShop Location"
                ></iframe>
                <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-xl max-w-xs">
                    <p className="font-bold text-gray-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" /> KTX B10 ĐH Bách Khoa
                    </p>
                    <a
                        href="https://goo.gl/maps/example"
                        target="_blank"
                        className="text-primary text-sm mt-1 hover:underline block"
                    >
                        Chỉ đường trên Google Maps
                    </a>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
