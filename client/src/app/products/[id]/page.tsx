import ProductView from "@/components/ProductView";
import ProductList from "@/components/ProductList";
import { Star } from "lucide-react";
import { notFound } from "next/navigation";
import { getProduct, getRelatedProducts } from "@/services/api";

// Mock reviews for now as API doesn't provide them yet
const mockReviews = [
  { id: 1, user: "John Doe", date: "2023-10-15", rating: 5, comment: "Great product! Highly recommended." },
  { id: 2, user: "Jane Smith", date: "2023-10-10", rating: 4, comment: "Good quality, but shipping was a bit slow." },
];

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

  // Fetch product and related products concurrently
  const [product, relatedProducts] = await Promise.all([
    getProduct(id),
    getRelatedProducts(id)
  ]);

  if (!product) {
    return notFound();
  }

  // Determine initial selection
  const selectedSize = size || (product.sizes?.[0] as string);
  const selectedColor = color || (product.colors?.[0] as string);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Main Product View (Client Component) */}
      <ProductView
        product={product}
        initialSize={selectedSize}
        initialColor={selectedColor}
        reviewsCount={product.reviews || mockReviews.length}
      />

      {/* REVIEWS & DESCRIPTION TABS */}
      <div className="mb-16">
        <div className="border-b border-gray-200 mb-8 flex justify-between items-center">
          <div className="flex gap-8">
            <button className="pb-4 border-b-2 border-primary font-semibold text-primary">Reviews ({mockReviews.length})</button>
            <button className="pb-4 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700">Description</button>
            <button className="pb-4 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700">Shipping & Returns</button>
          </div>
          <button className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            Write a Review
          </button>
        </div>

        <div className="space-y-6">
          {mockReviews.map((review) => (
            <div key={review.id} className="flex gap-4 p-6 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                {review.user.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-900">{review.user}</h4>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "fill-current" : "text-gray-300"}`} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <ProductList products={relatedProducts} />
        </section>
      )}
    </div>
  );
};

export default ProductPage;
