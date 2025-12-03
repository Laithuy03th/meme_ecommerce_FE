import BannerSlider from "@/components/BannerSlider";
import HomeCategories from "@/components/HomeCategories";
import ProductList from "@/components/ProductList";
import BestSellersSlider from "@/components/BestSellersSlider";
import { ArrowRight, Zap, TrendingUp, ShieldCheck, Truck, CreditCard, Sparkles, Star, Play, Instagram } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getCategories, getProducts } from "@/services/api";
import Pagination from "@/components/Pagination";

const bannerImages = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1600"
];

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) - 1 : 0;
  const size = 20;

  // Fetch data
  const [categories, productsData] = await Promise.all([
    getCategories(),
    getProducts(page < 0 ? 0 : page, size, "newest")
  ]);

  const products = productsData.content;
  const totalPages = productsData.totalPages;
  const currentPage = productsData.number + 1;

  const saleProducts = products.filter(p => p.isSale).length > 0
    ? products.filter(p => p.isSale)
    : products.slice(0, 4);

  const newArrivals = products.filter(p => p.isNew).length > 0
    ? products.filter(p => p.isNew)
    : products.slice(0, 8);

  const bestSellers = products.slice(0, 6);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="w-full">
        <BannerSlider images={bannerImages} />
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Truck className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Free Shipping</h3>
                <p className="text-xs text-gray-500">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Secure Payment</h3>
                <p className="text-xs text-gray-500">100% protected</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <CreditCard className="w-7 h-7 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Easy Returns</h3>
                <p className="text-xs text-gray-500">30-day guarantee</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-pink-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Best Quality</h3>
                <p className="text-xs text-gray-500">Premium products</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Categories */}
        <HomeCategories categories={categories} />

        {/* Flash Sale */}
        <section className="py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 border-y border-red-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-2xl blur-xl opacity-40 animate-pulse"></div>
                  <div className="relative p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-xl">
                    <Zap className="w-8 h-8 text-white fill-current" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Flash Sale</h2>
                  <p className="text-gray-600 mt-1">Grab them before they're gone!</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-lg border-2 border-red-200">
                <span className="text-sm font-bold text-gray-700">Ends in:</span>
                <div className="flex gap-2">
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white font-bold rounded-xl w-12 h-12 flex items-center justify-center text-xl shadow-lg">05</div>
                    <span className="text-xs text-gray-600 mt-1 block">Hours</span>
                  </div>
                  <div className="text-2xl font-bold text-red-500 self-center -mt-4">:</div>
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white font-bold rounded-xl w-12 h-12 flex items-center justify-center text-xl shadow-lg">23</div>
                    <span className="text-xs text-gray-600 mt-1 block">Mins</span>
                  </div>
                  <div className="text-2xl font-bold text-red-500 self-center -mt-4">:</div>
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white font-bold rounded-xl w-12 h-12 flex items-center justify-center text-xl shadow-lg">45</div>
                    <span className="text-xs text-gray-600 mt-1 block">Secs</span>
                  </div>
                </div>
              </div>
            </div>
            <ProductList products={saleProducts} />
          </div>
        </section>

        {/* Best Sellers - Slider */}
        <section className="py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 px-6 py-2 rounded-full mb-4">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <span className="text-amber-700 font-bold text-sm uppercase tracking-wider">Trending Now</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 animate-gradient">
                Best Sellers
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Discover our most popular products loved by thousands of customers</p>
          </div>
          {/* Dynamic import to make this a client component */}
          <BestSellersSlider products={bestSellers.slice(0, 10)} />
        </section>

        {/* Video/Magazine Section */}
        <section className="py-16">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Featured Video */}
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-gray-900 shadow-xl hover:shadow-2xl transition-shadow">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&modestbranding=1&rel=0"
                title="Fashion Collection Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white pointer-events-none">
                <h3 className="text-2xl font-bold mb-2">Summer Collection 2024</h3>
                <p className="text-white/80">Watch our latest fashion showcase</p>
              </div>
            </div>

            {/* Featured Content */}
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow group">
              {/* Background Image */}
              <Image
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop"
                alt="New Arrivals"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Overlay - Lighter */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-pink-900/60 to-purple-900/70" />

              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />

              {/* Content */}
              <div className="relative p-8 h-full flex flex-col justify-between text-white z-10">
                <div>
                  <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold mb-4 border border-white/30">NEW ARRIVALS</span>
                  <h3 className="text-4xl font-bold mb-4">Exclusive Designer Collection</h3>
                  <p className="text-white/90 text-lg mb-6">Premium pieces carefully curated for the modern trendsetter. Limited stock available.</p>
                </div>
                <Link href="/products?sort=newest" className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all w-fit group">
                  Explore Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-black">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
                  New Arrivals
                </span>
              </h2>
              <p className="text-gray-600 mt-2 text-lg">Fresh styles just landed</p>
            </div>
            <Link href="/products?sort=newest" className="group flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors">
              View All <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <ProductList products={newArrivals} />
        </section>

        {/* Instagram Feed */}
        <section className="py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-6 py-2 rounded-full mb-4">
              <Instagram className="w-5 h-5 text-pink-600" />
              <span className="text-pink-700 font-bold text-sm">@MEMESHOP</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                Follow Our Journey
              </span>
            </h2>
            <p className="text-gray-600 text-lg">Join our community and get inspired</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400",
              "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400",
              "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400",
              "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=400",
              "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=400",
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=400"
            ].map((img, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-gray-100 group cursor-pointer relative">
                <Image
                  src={img}
                  alt={`Instagram ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended for You */}
        <section className="py-16" id="products">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-black">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  Recommended for You
                </span>
              </h2>
              <p className="text-gray-600 mt-2 text-lg">Handpicked selections based on your taste</p>
            </div>
          </div>

          <ProductList products={products} />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/"
          />
        </section>

      </div>
    </div>
  );
}
