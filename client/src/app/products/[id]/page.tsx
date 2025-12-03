import ProductView from "@/components/ProductView";
import ProductList from "@/components/ProductList";
import { Star, MessageCircle, ThumbsUp, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { getProduct, getRelatedProducts } from "@/services/api";

// Mock reviews for now as API doesn't provide them yet
const mockReviews = [
  { id: 1, user: "John Doe", date: "2023-10-15", rating: 5, comment: "Great product! Highly recommended. The quality exceeded my expectations and the shipping was fast.", helpful: 12 },
  { id: 2, user: "Jane Smith", date: "2023-10-10", rating: 4, comment: "Good quality, but shipping was a bit slow. Overall satisfied with the product.", helpful: 5 },
  { id: 3, user: "Mike Johnson", date: "2023-10-05", rating: 5, comment: "Perfect! Exactly what I was looking for. Will definitely order again.", helpful: 8 },
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

  const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;

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
      <div className="mb-20">
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-2 rounded-full shadow-lg">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-gray-500">Based on {mockReviews.length} reviews</p>
            </div>
            <button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl transition-all flex items-center gap-2 group">
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Write a Review
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {mockReviews.map((review, index) => (
            <div key={review.id} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-2xl font-bold text-primary">{review.user.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{review.user}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {review.date}
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {review.helpful} found helpful
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-5 h-5 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
                  <button className="text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-2 group">
                    <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Helpful
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">You May Also Like</h2>
            <div className="h-1 flex-1 mx-8 bg-gradient-to-r from-primary/20 via-primary/50 to-transparent rounded-full" />
          </div>
          <ProductList products={relatedProducts} />
        </section>
      )}
    </div>
  );
};

export default ProductPage;
