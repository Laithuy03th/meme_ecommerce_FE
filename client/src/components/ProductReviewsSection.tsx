"use client";

import { useState, useEffect } from "react";
import { Star, MessageCircle, Calendar, Trash2 } from "lucide-react";
import { ReviewType, ReviewSummaryType } from "@/types";
import { deleteMyReview } from "@/services/api/reviewApi";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "react-toastify";

interface ProductReviewsSectionProps {
    productId: number;
    initialReviews: ReviewType[];
    reviewSummary: ReviewSummaryType | null;
}

const ProductReviewsSection = ({ productId, initialReviews, reviewSummary }: ProductReviewsSectionProps) => {
    const [reviews, setReviews] = useState<ReviewType[]>(initialReviews);

    useEffect(() => {
        setReviews(initialReviews);
    }, [initialReviews]);

    const { user } = useAuthStore(); // Added useAuthStore hook

    const handleDeleteReview = async (reviewId: number) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        try {
            await deleteMyReview(reviewId);
            setReviews(reviews.filter(r => r.id !== reviewId));
            toast.success("Review deleted");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete");
        }
    };

    // Calculate display stats from Summary if available, else manual
    const totalReviews = reviewSummary ? reviewSummary.totalReviews : reviews.length;
    const averageRating = reviewSummary
        ? reviewSummary.averageRating
        : (reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0);

    // Star counts
    const starCounts: Record<string, number> = reviewSummary?.starCounts || { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
    if (!reviewSummary && reviews.length > 0) {
        // Fallback manual count
        reviews.forEach(r => {
            const k = Math.round(r.rating).toString();
            if (starCounts[k] !== undefined) starCounts[k]++;
        });
    }

    return (
        <section id="reviews" className="scroll-mt-24">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Đánh giá & Nhận xét</h2>
                <div className="h-1 flex-1 mx-8 bg-gradient-to-r from-gray-100 via-gray-200 to-transparent rounded-full" />
            </div>

            <div className="grid md:grid-cols-12 gap-8">
                {/* LEFT: STATS */}
                <div className="md:col-span-4 lg:col-span-3">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                        <div className="text-center mb-6">
                            <div className="text-5xl font-extrabold text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
                            <div className="flex justify-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        className={`w-5 h-5 ${s <= Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-100"}`}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-500 text-sm">Dựa trên {totalReviews} đánh giá</p>
                        </div>

                        {/* Bars */}
                        <div className="space-y-2 mb-8">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = starCounts[star.toString()] || 0;
                                const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-3 text-sm">
                                        <div className="flex items-center gap-1 w-12 text-gray-600 font-medium">
                                            {star} <Star className="w-3 h-3 text-gray-400" />
                                        </div>
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-400 rounded-full"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <div className="w-8 text-right text-gray-400 text-xs">{count}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* INFO BOX - Review từ Order */}
                        <div className="glass-effect p-4 rounded-xl border border-primary/10 bg-primary/5 text-center">
                            <h4 className="font-bold text-gray-900 mb-1">Bạn đã mua sản phẩm?</h4>
                            <p className="text-xs text-gray-500 mb-2">
                                Bạn có thể đánh giá sau khi nhận hàng tại trang <strong>Đơn hàng của tôi</strong>.
                            </p>
                            <a
                                href="/account/orders"
                                className="block w-full py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-all text-sm"
                            >
                                Xem đơn hàng →
                            </a>
                        </div>
                    </div>
                </div>

                {/* RIGHT: LIST */}
                <div className="md:col-span-8 lg:col-span-9 space-y-4">
                    {reviews.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-gray-900">Chưa có đánh giá nào</h3>
                            <p className="text-gray-500">Hãy là người đầu tiên trải nghiệm và để lại đánh giá!</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-gray-200 transition-all relative group">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        {review.user?.avatarUrl ? (
                                            <img
                                                src={review.user.avatarUrl}
                                                alt={review.userFullName}
                                                className="w-12 h-12 object-cover rounded-full border border-gray-100"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                                                {(review.userFullName || "A").charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-gray-900 text-base">{review.userFullName || "Someone"}</h4>
                                                    {user?.fullName === review.userFullName && ( // Simple name check or better ID check if available
                                                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold">You</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-gray-300">|</span>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* DELETE ACTION */}
                                            {/* Note: review.user?.id might be missing in some responses, falling back to name check or if API provides isMine */}
                                            {(user?.fullName === review.userFullName) && (
                                                <button
                                                    onClick={() => handleDeleteReview(review.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Xóa đánh giá"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="mt-3 text-gray-700 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                                            {review.comment}
                                        </div>

                                        {review.imageUrl && (
                                            <div className="mt-3">
                                                <img
                                                    src={review.imageUrl}
                                                    alt="Review image"
                                                    className="h-24 w-24 object-cover rounded-lg border border-gray-200 cursor-zoom-in"
                                                />
                                            </div>
                                        )}

                                        {/* ADMIN REPLY */}
                                        {review.adminReply && (
                                            <div className="mt-4 ml-2 sm:ml-6 bg-orange-50/80 p-4 rounded-xl border-l-4 border-orange-500 relative">
                                                <div className="absolute -top-2 left-6 w-4 h-4 bg-orange-50/80 rotate-45 border-l border-t border-orange-100/50"></div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="bg-orange-100 p-1 rounded-full">
                                                        <MessageCircle className="w-3 h-3 text-orange-600" />
                                                    </div>
                                                    <span className="font-bold text-orange-700 text-sm">Phản hồi từ Người bán</span>
                                                    {review.adminRepliedAt && (
                                                        <span className="text-xs text-orange-400">• {new Date(review.adminRepliedAt).toLocaleDateString('vi-VN')}</span>
                                                    )}
                                                </div>
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {review.adminReply}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductReviewsSection;
