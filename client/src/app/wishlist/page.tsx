import ProductList from "@/components/ProductList";
import { products } from "@/data/mockData";
import { Heart } from "lucide-react";
import Link from "next/link";

const WishlistPage = () => {
    // Mock wishlist items
    const wishlistItems = products.slice(0, 2);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-red-50 rounded-full">
                    <Heart className="w-8 h-8 text-red-500 fill-current" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            </div>

            {wishlistItems.length > 0 ? (
                <ProductList products={wishlistItems} />
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
                    <Link href="/products" className="text-primary hover:underline mt-4 inline-block">
                        Browse Products
                    </Link>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
