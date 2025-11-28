"use client";

import useWishlistStore from "@/stores/wishlistStore";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const WishlistPage = () => {
    const { wishlist, removeItem, isLoading } = useWishlistStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (isLoading) {
        return <div className="p-12 text-center">Loading wishlist...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-red-50 rounded-full">
                    <Heart className="w-8 h-8 text-red-500 fill-current" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            </div>

            {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlist.map((item) => (
                        <div key={item.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                            <Link href={`/products/${item.productId}`} className="relative aspect-[3/4] overflow-hidden bg-gray-100 block">
                                <Image
                                    src={item.thumbnailUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000"}
                                    alt={item.productName}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                    <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        View Details
                                    </span>
                                </div>
                            </Link>

                            <div className="p-4 flex flex-col flex-1">
                                <Link href={`/products/${item.productId}`} className="block mb-2">
                                    <h3 className="font-semibold text-gray-900 line-clamp-1 hover:text-primary transition-colors">
                                        {item.productName}
                                    </h3>
                                </Link>

                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-lg font-bold text-primary">
                                        ${item.basePrice.toFixed(2)}
                                    </span>

                                    <button
                                        onClick={() => removeItem(item.productId)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        title="Remove from Wishlist"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Heart className="w-10 h-10 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-500 mb-8">Explore our products and save your favorites!</p>
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-primary-dark md:py-4 md:text-lg md:px-10 transition-all shadow-lg hover:shadow-xl"
                    >
                        Start Shopping
                    </Link>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
