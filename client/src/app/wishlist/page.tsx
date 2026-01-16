"use client";

import useWishlistStore from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { Heart, ShoppingCart, Trash2, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const WishlistPage = () => {
    const { wishlist, removeItem, isLoading } = useWishlistStore();
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isAuthenticated) {
            router.push("/login?redirect=/wishlist");
        }
    }, [isAuthenticated, router]);

    if (!mounted) return null;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                        <Heart className="w-8 h-8 text-white fill-current" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
                        <p className="text-gray-500 mt-1">{wishlist.length} items saved for later</p>
                    </div>
                </div>
                {wishlist.length > 0 && (
                    <Link
                        href="/products"
                        className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-xl transition-all group"
                    >
                        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Discover More
                    </Link>
                )}
            </div>

            {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlist.map((item, index) => (
                        <div
                            key={item.id}
                            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 border-2 border-gray-100 hover:border-pink-200 flex flex-col animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <Link href={`/products/${item.productId}`} className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 block">
                                <Image
                                    src={item.thumbnailUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000"}
                                    alt={item.productName}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                    <span className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                                        View Details <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </Link>

                            <div className="p-5 flex flex-col flex-1">
                                <Link href={`/products/${item.productId}`} className="block mb-2">
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 hover:text-primary transition-colors leading-snug">
                                        {item.productName}
                                    </h3>
                                </Link>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                        {item.basePrice.toLocaleString('vi-VN')}đ
                                    </span>

                                    <button
                                        onClick={() => {
                                            removeItem(item.productId);
                                            toast.success("Removed from wishlist");
                                        }}
                                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="Remove from Wishlist"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Favorite Badge */}
                            <div className="absolute top-4 right-4 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30 animate-pulse-slow">
                                <Heart className="w-5 h-5 text-white fill-current" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
                        <Heart className="w-16 h-16 text-pink-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Start adding products you love to your wishlist and shop them later!</p>
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full text-white bg-gradient-to-r from-primary to-secondary font-bold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all group"
                    >
                        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Start Shopping
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
