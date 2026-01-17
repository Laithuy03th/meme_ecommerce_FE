"use client";

import { useState, useEffect, useRef } from "react";
import { Star, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { OrderItemType } from "@/types";
import { createReview } from "@/services/api/reviewApi";
import { uploadFile } from "@/services/api/fileApi";
import { toast } from "react-toastify";

// Helper Star Component
const StarRating = ({ rating, setRating }: { rating: number, setRating: (r: number) => void }) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                >
                    <Star
                        className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                    />
                </button>
            ))}
        </div>
    );
};

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: OrderItemType[];
    onReviewSuccess: () => void;
}

const ReviewModal = ({ isOpen, onClose, items, onReviewSuccess }: ReviewModalProps) => {
    const [selectedItem, setSelectedItem] = useState<OrderItemType | null>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // File input ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && items.length > 0) {
            setSelectedItem(items[0]);
            setPreviewImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setComment("");
            setRating(5);
        }
    }, [isOpen, items]);

    // Handle File Selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng chọn file ảnh (JPG, PNG, ...)");
            return;
        }

        const url = URL.createObjectURL(file);
        setPreviewImage(url);
    };

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!selectedItem) {
            toast.error("Lỗi: Không có sản phẩm nào được chọn.");
            return;
        }

        const productId = selectedItem.productId;
        const orderItemId = selectedItem.id;  // ✅ GET orderItemId từ item

        console.log("Review Debug:", { selectedItem, productId, orderItemId }); // Debug log

        if (!productId) {
            toast.error("Lỗi: Không tìm thấy ID sản phẩm. Vui lòng thử lại sau.");
            console.error("Missing productId in selectedItem:", selectedItem);
            return;
        }

        if (!orderItemId) {  // VALIDATE orderItemId
            toast.error("Lỗi: Thiếu thông tin đơn hàng. Vui lòng thử lại.");
            console.error("Missing orderItemId (item.id) in selectedItem:", selectedItem);
            return;
        }

        if (!comment.trim()) {
            toast.error("Vui lòng nhập nội dung đánh giá");
            return;
        }

        setIsSubmitting(true);
        try {
            let imageUrlToSend = undefined;

            // ✅ REAL UPLOAD LOGIC
            const file = fileInputRef.current?.files?.[0];
            if (file) {
                imageUrlToSend = await uploadFile(file);
            }

            await createReview(productId, {
                orderItemId,      // ✅ SEND orderItemId - REQUIRED by BE
                rating,
                comment,
                imageUrl: imageUrlToSend,
            });

            toast.success("Cảm ơn đánh giá và hình ảnh feedback của bạn!");
            onReviewSuccess();

            // ✅ Close modal - parent will handle data refresh

        } catch (error: any) {
            console.error("Submit Error:", error);
            toast.error(error.message || "Gửi đánh giá thất bại");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Đánh giá sản phẩm</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {items.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {items.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    className={`relative w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 cursor-pointer transition-all ${selectedItem?.id === item.id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                                >
                                    <Image
                                        src={item.productImageUrl || item.thumbnailUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000"}
                                        alt=""
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {selectedItem && (
                        <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white border border-gray-200">
                                <Image
                                    src={selectedItem.productImageUrl || selectedItem.thumbnailUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000"}
                                    alt={selectedItem.productName}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 line-clamp-1">{selectedItem.productName}</h4>
                                <p className="text-xs text-gray-500">{selectedItem.variantInfo || "Màu sắc / Kích thước tiêu chuẩn"}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col items-center gap-2 py-2">
                        <p className="text-sm font-medium text-gray-600">Chất lượng sản phẩm thế nào?</p>
                        <StarRating rating={rating} setRating={setRating} />
                        <p className={`text-sm font-bold ${rating === 5 ? 'text-yellow-500' : rating === 1 ? 'text-red-500' : 'text-gray-700'}`}>
                            {rating === 5 ? "Tuyệt vời!" : rating === 4 ? "Hài lòng" : rating === 3 ? "Bình thường" : rating === 2 ? "Không hài lòng" : "Tệ"}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Hãy chia sẻ nhận xét cho sản phẩm này nhé..."
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none min-h-[120px] text-sm"
                        />

                        <div className="flex gap-4 items-center flex-wrap">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer"
                            >
                                <Upload className="w-4 h-4" />
                                {previewImage ? "Thay đổi ảnh" : "Thêm hình ảnh"}
                            </button>

                            {previewImage && (
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group">
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => {
                                            setPreviewImage(null);
                                            if (fileInputRef.current) fileInputRef.current.value = "";
                                        }}
                                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors cursor-pointer"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}

                            <span className="text-xs text-gray-400 ml-auto">{comment.length}/500</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
                    >
                        Trở lại
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Hoàn thành
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
