"use client";

import { useState, useEffect } from "react";
import { OrderItemType } from "@/types";
import { X, Minus, Plus, ShoppingBag, ArrowRight, CheckSquare, Square } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

interface ReorderModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: OrderItemType[];
    onConfirm: (selectedItems: { item: OrderItemType; quantity: number }[]) => void;
    isLoading: boolean;
}

const ReorderModal = ({ isOpen, onClose, items, onConfirm, isLoading }: ReorderModalProps) => {
    // State to track selected items (Set of indices or IDs)
    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
    // State to track quantities for each item index
    const [quantities, setQuantities] = useState<Record<number, number>>({});

    // Initialize state when modal opens
    useEffect(() => {
        if (isOpen && items) {
            const allIndices = new Set(items.map((_, i) => i));
            setSelectedIndices(allIndices);

            const initialQuantities: Record<number, number> = {};
            items.forEach((item, i) => {
                initialQuantities[i] = item.quantity;
            });
            setQuantities(initialQuantities);
        }
    }, [isOpen, items]);

    if (!isOpen) return null;

    const toggleSelection = (index: number) => {
        const newSelected = new Set(selectedIndices);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedIndices(newSelected);
    };

    const updateQuantity = (index: number, delta: number) => {
        setQuantities(prev => {
            const currentQty = prev[index] || 1;
            const newQty = Math.max(1, currentQty + delta);
            return { ...prev, [index]: newQty };
        });
    };

    const handleConfirm = () => {
        if (selectedIndices.size === 0) {
            toast.warn("Vui lòng chọn ít nhất một sản phẩm để mua lại");
            return;
        }

        const itemsToReorder = Array.from(selectedIndices).map(index => ({
            item: items[index],
            quantity: quantities[index]
        }));

        onConfirm(itemsToReorder);
    };

    // Calculate total for selected items
    const totalAmount = Array.from(selectedIndices).reduce((sum, index) => {
        const item = items[index];
        const qty = quantities[index] || 1;
        const price = item.price || item.unitPrice || 0;
        return sum + (price * qty);
    }, 0);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-6 h-6 text-primary" />
                        <h3 className="text-xl font-bold text-gray-900">Mua lại đơn hàng</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body - List of items */}
                <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
                    {items.map((item, index) => {
                        const isSelected = selectedIndices.has(index);
                        const qty = quantities[index] || item.quantity;

                        return (
                            <div
                                key={index}
                                className={`flex items-center gap-4 p-4 border-b border-gray-100 transition-colors ${isSelected ? 'bg-blue-50/30' : 'bg-gray-50/50 opacity-60'}`}
                            >
                                {/* Checkbox */}
                                <button
                                    onClick={() => toggleSelection(index)}
                                    className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 hover:border-primary'}`}
                                >
                                    {isSelected && <CheckSquare className="w-4 h-4" />}
                                </button>

                                {/* Image */}
                                <div className="relative w-16 h-16 rounded-lg bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.productImageUrl || item.thumbnailUrl || "https://via.placeholder.com/100"}
                                        alt={item.productName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 truncate">{item.productName}</h4>
                                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                                        {(item.variantInfo || item.color || item.size) && (
                                            <span className="bg-white px-2 py-0.5 rounded border border-gray-200">
                                                {item.variantInfo || `${item.color || ''} ${item.size || ''}`}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-1 font-bold text-primary">
                                        {(item.price || item.unitPrice || 0).toLocaleString('vi-VN')}đ
                                    </div>
                                </div>

                                {/* Quantity Control */}
                                <div className={`flex items-center bg-white border border-gray-200 rounded-lg h-9 shadow-sm ${!isSelected && 'pointer-events-none opacity-50'}`}>
                                    <button
                                        onClick={() => updateQuantity(index, -1)}
                                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 rounded-l-lg disabled:opacity-30"
                                        disabled={qty <= 1}
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <div className="w-10 text-center text-sm font-bold text-gray-900">{qty}</div>
                                    <button
                                        onClick={() => updateQuantity(index, 1)}
                                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 rounded-r-lg"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 font-medium">{selectedIndices.size} sản phẩm đã chọn</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-gray-600 text-sm">Tổng cộng:</span>
                            <span className="text-2xl font-black text-primary">{totalAmount.toLocaleString('vi-VN')}đ</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3.5 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
                            disabled={isLoading}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading || selectedIndices.size === 0}
                            className="flex-[2] bg-gradient-to-r from-primary to-secondary text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>Đang xử lý...</>
                            ) : (
                                <>
                                    Thanh toán ngay <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReorderModal;
