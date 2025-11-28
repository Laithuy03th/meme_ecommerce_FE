import ProductList from "@/components/ProductList";
import FilterSidebar from "@/components/FilterSidebar";
import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import { getCategories, getProducts } from "@/services/api";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;

  const categorySlug = params.category as string;
  const search = params.search as string;
  const sort = (params.sort as string) || "newest";
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const page = Number(params.page) || 1;
  const size = 20;

  // Fetch data concurrently
  const [categories, productsData] = await Promise.all([
    getCategories(),
    getProducts(page - 1, size, sort, {
      search,
      minPrice,
      maxPrice,
      categorySlug,
    }),
  ]);

  const products = productsData.content;
  const totalPages = productsData.totalPages;
  const totalItems = productsData.totalElements;

  return (
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
          {/* Flash Sale Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6 md:p-10 mb-8 text-white shadow-lg">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold tracking-wider mb-3 border border-white/30">
                  LIMITED TIME OFFER
                </span>
                <h2 className="text-2xl md:text-4xl font-bold mb-2">Flash Sale Madness! ⚡</h2>
                <p className="text-indigo-100 max-w-md text-sm md:text-base">
                  Grab your favorites with up to <span className="font-bold text-yellow-300">70% OFF</span>. Prices drop for a limited time only!
                </p>
              </div>

              {/* Countdown Timer Mockup */}
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <div className="text-center">
                  <div className="bg-white text-indigo-600 font-bold rounded-lg w-10 h-10 flex items-center justify-center text-lg shadow-sm">02</div>
                  <span className="text-[10px] uppercase tracking-wider mt-1 block opacity-80">Hrs</span>
                </div>
                <span className="text-xl font-bold -mt-4">:</span>
                <div className="text-center">
                  <div className="bg-white text-indigo-600 font-bold rounded-lg w-10 h-10 flex items-center justify-center text-lg shadow-sm">45</div>
                  <span className="text-[10px] uppercase tracking-wider mt-1 block opacity-80">Mins</span>
                </div>
                <span className="text-xl font-bold -mt-4">:</span>
                <div className="text-center">
                  <div className="bg-white text-indigo-600 font-bold rounded-lg w-10 h-10 flex items-center justify-center text-lg shadow-sm">12</div>
                  <span className="text-[10px] uppercase tracking-wider mt-1 block opacity-80">Secs</span>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-purple-400/20 blur-2xl"></div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {categorySlug
                ? `${categories.find((c) => c.slug === categorySlug)?.name || categorySlug} Products`
                : "All Products"}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({totalItems} items)
              </span>
            </h1>
            <Filter />
          </div>

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
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
