import ProductView from "@/components/ProductView";
import ProductList from "@/components/ProductList";
import { notFound } from "next/navigation";
import { getProduct, getRelatedProducts } from "@/services/api";
import { getProductReviews, getReviewSummary } from "@/services/api/reviewApi";
import ProductReviewsSection from "@/components/ProductReviewsSection";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  const product = await getProduct(id);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description || product.shortDesc,
  };
};

const ProductPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ color: string; size: string }>;
}) => {
  const id = (await params).id;
  const { size, color } = await searchParams;

  // 1. Fetch data concurrently
  const [product, relatedProducts, reviewsData, reviewSummary] = await Promise.all([
    getProduct(id),
    getRelatedProducts(id),
    getProductReviews(Number(id)).catch(() => []),
    getReviewSummary(Number(id)).catch(() => null),
  ]);

  if (!product) {
    return notFound();
  }

  // 2. Initial selection logic
  const selectedSize = size || (product.sizes?.[0] as string);
  const selectedColor = color || (product.colors?.[0] as string);

  // 3. Process Review Data
  const reviews = Array.isArray(reviewsData) ? reviewsData.sort((a: any, b: any) =>
    new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime()
  ) : [];

  const totalReviews = reviewSummary ? reviewSummary.totalReviews : reviews.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Main Product View (Client Component) */}
      <ProductView
        product={product}
        initialSize={selectedSize}
        initialColor={selectedColor}
        reviewCount={totalReviews}
      />

      {/* REVIEWS SECTION (New Client Component) */}
      <ProductReviewsSection
        productId={product.id}
        initialReviews={reviews}
        reviewSummary={reviewSummary}
      />

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Có thể bạn sẽ thích</h2>
            <div className="h-1 flex-1 mx-8 bg-gradient-to-r from-primary/20 via-primary/50 to-transparent rounded-full" />
          </div>
          <ProductList products={relatedProducts} />
        </section>
      )}
    </div>
  );
};

export default ProductPage;
