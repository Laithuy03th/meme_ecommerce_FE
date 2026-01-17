"use client";

import { useEffect, useState } from "react";
import { getMyReviews } from "@/services/api/reviewApi";
import { ReviewType } from "@/types";
import { Star, Calendar, Package, Loader2, MessageCircle, ExternalLink } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

export default function MyReviewsPage() {
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const data = await getMyReviews();
            setReviews(data);
        } catch (error) {
            console.error("Failed to load reviews", error);
            toast.error("Không thể tải danh sách đánh giá");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-gray-500">Đang tải đánh giá của bạn...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Đánh giá của tôi</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Quản lý tất cả đánh giá bạn đã viết cho sản phẩm
                    </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 px-4 py-2 rounded-xl border border-orange-100">
                    <div className="text-center">
                        <p className="text-2xl font-black text-orange-600">{reviews.length}</p>
                        <p className="text-xs text-gray-600 font-medium">Tổng đánh giá</p>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Chưa có đánh giá nào</h3>
                    <p className="text-gray-500 mb-4">Hãy mua hàng và đánh giá để tích lũy điểm thưởng!</p>
                    <Link
                        href="/products"
                        className="inline-block px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
                    >
                        Khám phá sản phẩm
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-md transition-all group"
                        >
                            {/* Product Header with Link */}
                            <Link
                                href={`/products/${review.productId}`}
                                className="flex items-center gap-4 p-4 bg-gray-50 border-b border-gray-100 hover:bg-gray-100 transition-colors"
                            >
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                                    <Image
                                        src={review.productImage || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000"}
                                        alt={review.productName}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                                        {review.productName}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Bấm để xem chi tiết sản phẩm</p>
                                </div>
                                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                            </Link>

                            {/* Review Content */}
                            <div className="p-5 space-y-3">
                                {/* Rating & Date */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= review.rating
                                                            ? "fill-amber-400 text-amber-400"
                                                            : "fill-gray-100 text-gray-200"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">
                                            {review.rating === 5
                                                ? "Tuyệt vời!"
                                                : review.rating === 4
                                                    ? "Hài lòng"
                                                    : review.rating === 3
                                                        ? "Bình thường"
                                                        : "Cần cải thiện"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                                    </div>
                                </div>

                                {/* Comment */}
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                                </div>

                                {/* Review Image */}
                                {review.imageUrl && (
                                    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                        <Image
                                            src={review.imageUrl}
                                            alt="Review image"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}

                                {/* Admin Reply */}
                                {review.adminReply && (
                                    <div className="mt-4 ml-4 bg-orange-50/80 p-4 rounded-xl border-l-4 border-orange-500 relative">
                                        <div className="absolute -top-2 left-6 w-4 h-4 bg-orange-50/80 rotate-45 border-l border-t border-orange-100/50"></div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="bg-orange-100 p-1 rounded-full">
                                                <MessageCircle className="w-3 h-3 text-orange-600" />
                                            </div>
                                            <span className="font-bold text-orange-700 text-sm">Phản hồi từ Người bán</span>
                                            {review.adminRepliedAt && (
                                                <span className="text-xs text-orange-400">
                                                    • {new Date(review.adminRepliedAt).toLocaleDateString("vi-VN")}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">{review.adminReply}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
