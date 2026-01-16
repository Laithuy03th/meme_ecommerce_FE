import ProductList from "@/components/ProductList";
import FilterSidebar from "@/components/FilterSidebar";
import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import { getCategories, searchProducts } from "@/services/api";
import { Sparkles, Package, ShoppingBag } from "lucide-react";
import Image from "next/image";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;

  const categorySlug = params.category as string;
  const keyword = params.keyword as string; // ✅ Fixed: Use 'keyword' instead of 'search'
  const sort = (params.sort as string) || "newest";
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const page = Number(params.page) || 1;
  const size = 20;

  // Fetch data concurrently
  const [categories, productsData] = await Promise.all([
    getCategories(),
    searchProducts({
      keyword,          // ✅ Now uses keyword for proper filtering
      category: categorySlug,
      minPrice,
      maxPrice,
      sortBy: sort as any,
      page: page - 1,
      size,
    }),
  ]);

  const products = productsData.content;
  const totalPages = productsData.totalPages;
  const totalItems = productsData.totalElements;

  const currentCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="min-h-screen">
      {/* Hero Banner with Image */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop"
          alt="Shop Banner"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl">
            {currentCategory && (
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
                <Package className="w-4 h-4 text-white" />
                <span className="text-white/90 font-medium text-sm uppercase tracking-wider">
                  {currentCategory.name}
                </span>
              </div>
            )}

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              {currentCategory ? (
                <>
                  {currentCategory.name}
                  <span className="block text-3xl md:text-4xl font-bold text-white/80 mt-2">
                    Collection
                  </span>
                </>
              ) : (
                <>
                  Discover Our
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-pink-400 to-purple-400">
                    Amazing Products
                  </span>
                </>
              )}
            </h1>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Explore our curated collection of {totalItems.toLocaleString()} premium products
            </p>

            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                <span className="text-white font-bold">{totalItems}+ Products</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                <span className="text-white font-bold">{categories.length} Categories</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 md:h-24" style={{ fill: '#fdfcfb' }} viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar categories={categories} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Flash Sale Banner - Only show if no search/filter */}
            {!keyword && !categorySlug && !minPrice && !maxPrice && (
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-8 md:p-12 mb-8 text-white shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold tracking-wider mb-4 border border-white/30">
                      <Sparkles className="w-4 h-4" />
                      LIMITED TIME OFFER
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black mb-3">
                      Flash Sale Madness! ⚡
                    </h2>
                    <p className="text-indigo-100 max-w-md text-lg">
                      Grab your favorites with up to{" "}
                      <span className="font-black text-yellow-300 text-2xl">
                        70% OFF
                      </span>
                      . Prices drop for a limited time only!
                    </p>
                  </div>

                  {/* Countdown Timer */}
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-xl">
                    <div className="text-center">
                      <div className="bg-white text-indigo-600 font-black rounded-xl w-14 h-14 flex items-center justify-center text-2xl shadow-lg">
                        02
                      </div>
                      <span className="text-xs uppercase tracking-wider mt-2 block opacity-90 font-bold">
                        Hours
                      </span>
                    </div>
                    <span className="text-3xl font-black -mt-6">:</span>
                    <div className="text-center">
                      <div className="bg-white text-indigo-600 font-black rounded-xl w-14 h-14 flex items-center justify-center text-2xl shadow-lg">
                        45
                      </div>
                      <span className="text-xs uppercase tracking-wider mt-2 block opacity-90 font-bold">
                        Mins
                      </span>
                    </div>
                    <span className="text-3xl font-black -mt-6">:</span>
                    <div className="text-center">
                      <div className="bg-white text-indigo-600 font-black rounded-xl w-14 h-14 flex items-center justify-center text-2xl shadow-lg">
                        12
                      </div>
                      <span className="text-xs uppercase tracking-wider mt-2 block opacity-90 font-bold">
                        Secs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-purple-400/20 blur-2xl"></div>
              </div>
            )}

            {/* Products Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  {keyword ? (
                    <>
                      Search results for{" "}
                      <span className="text-primary">"{keyword}"</span>
                    </>
                  ) : (
                    "Products"
                  )}
                </h2>
                <p className="text-gray-600 mt-1">
                  Showing {products.length} of {totalItems} products
                </p>
              </div>
              <Filter />
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <>
                <ProductList products={products} />
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  baseUrl="/products"
                />
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 text-lg mb-6">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
