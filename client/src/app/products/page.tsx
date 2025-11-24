// import ProductList from "@/components/ProductList";

// const ProductsPage = async ({
//   searchParams,
// }: {
//   searchParams: Promise<{ category: string }>;
// }) => {
//   const category = (await searchParams).category;
//   return (
//     <div className="">
//       <ProductList category={category} params="products"/>
//     </div>
//   );
// };

// export default ProductsPage;


// client/src/app/products/page.tsx
import ProductList from "@/components/ProductList";
import { fetchProducts } from "@/api/productApi";

interface ProductsPageProps {
  searchParams?: {
    category?: string;
    keyword?: string;
    page?: string;
    sortBy?: "newest" | "oldest" | "priceAsc" | "priceDesc";
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = searchParams?.category;
  const keyword = searchParams?.keyword;
  const page = searchParams?.page ? Number(searchParams.page) : 0;
  const sortBy = searchParams?.sortBy ?? "newest";

  const productPage = await fetchProducts({
    category,
    keyword,
    page,
    size: 20,
    sortBy,
  });

  return (
    <div className="container mx-auto px-4 my-10">
      <ProductList
        category={category}
        params="products"
        products={productPage.content}
      />
      {/* Sau này đặt component Pagination ở đây,
          dùng productPage.totalPages, productPage.number,... */}
    </div>
  );
}
