import BannerSlider from "@/components/BannerSlider";
import HomeCategories from "@/components/HomeCategories";
import ProductList from "@/components/ProductList";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
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
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) - 1 : 0; // API uses 0-based index
  const size = 20;

  // Fetch data
  const [categories, productsData] = await Promise.all([
    getCategories(),
    getProducts(page < 0 ? 0 : page, size, "newest")
  ]);

  const products = productsData.content;
  const totalPages = productsData.totalPages;
  const currentPage = productsData.number + 1; // Display as 1-based

  // Simulate filtered lists for UI sections if API doesn't return specific flags yet
  // In a real scenario, we might want separate API calls like /products/flash-sale or /products/new
  const saleProducts = products.filter(p => p.isSale).length > 0
    ? products.filter(p => p.isSale)
    : products.slice(0, 4); // Fallback to first 4 products

  const newArrivals = products.filter(p => p.isNew).length > 0
    ? products.filter(p => p.isNew)
    : products.slice(0, 8); // Fallback to first 8 products

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="w-full">
        <BannerSlider images={bannerImages} />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Categories */}
        <HomeCategories categories={categories} />

        {/* Flash Sale */}
        <section className="py-12 border-y border-gray-100 bg-red-50/50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-100 rounded-full">
                  <Zap className="w-6 h-6 text-red-500 fill-current" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Flash Sale</h2>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-red-500 bg-white px-4 py-2 rounded-full shadow-sm border border-red-100">
                <span>Ends in:</span>
                <span className="font-mono text-lg">05:23:45</span>
              </div>
            </div>
            <ProductList products={saleProducts} />
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">New Arrivals</h2>
            <Link href="/products?sort=newest" className="group flex items-center gap-1 text-primary font-medium hover:text-primary-dark transition-colors">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <ProductList products={newArrivals} />
        </section>

        {/* Promotional Banner */}
        <section className="py-8">
          <div className="relative rounded-3xl overflow-hidden bg-gray-900 text-white aspect-[21/9] md:aspect-[3/1]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl">
              <span className="text-secondary font-bold tracking-wider mb-2">LIMITED OFFER</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Summer Collection 50% Off</h2>
              <p className="text-gray-200 mb-8 text-lg">Discover the latest trends in fashion and enjoy exclusive discounts on our summer collection.</p>
              <Link href="/products" className="w-fit bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg">
                Shop Now
              </Link>
            </div>
          </div>
        </section>

        {/* Recommended for You (Main List) */}
        <section className="py-16" id="products">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Recommended for You</h2>
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
