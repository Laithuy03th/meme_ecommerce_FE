import ProductList from "@/components/ProductList";
import FilterSidebar from "@/components/FilterSidebar";
import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import { products } from "@/data/mockData";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;

  const category = params.category as string;
  const search = params.search as string;
  const sort = params.sort as string;
  const minPrice = params.minPrice ? Number(params.minPrice) : 0;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : 10000;
  const color = params.color as string;
  const size = params.size as string;
  const page = Number(params.page) || 1;

  // Filter Logic
  let filteredProducts = products;

  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category?.toLowerCase() === category.toLowerCase() || p.slug === category);
  }

  if (search) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (minPrice || maxPrice < 10000) {
    filteredProducts = filteredProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);
  }

  if (color) {
    filteredProducts = filteredProducts.filter(p => p.colors?.includes(color));
  }

  if (size) {
    filteredProducts = filteredProducts.filter(p => p.sizes?.includes(size));
  }

  // Sort Logic
  if (sort) {
    if (sort === 'asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
  }

  // Pagination Logic
  const pageSize = category ? 10 : 20;
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <FilterSidebar />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {category ? `${category} Products` : "All Products"}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({totalItems} items)
              </span>
            </h1>
            <Filter />
          </div>

          {paginatedProducts.length > 0 ? (
            <>
              <ProductList products={paginatedProducts} />
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
