"use client";

import { cancelOrder, getOrder, returnOrder } from "@/services/api";
import { OrderType, OrderItemType } from "@/types";
import { ArrowLeft, CheckCircle, Clock, CreditCard, MapPin, Package, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ORDER_STATUS, getOrderStatusColor, getOrderStatusLabel } from "@/lib/orderUtils";
import useCartStore from "@/stores/cartStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReviewModal from "@/components/ReviewModal";
import ReorderModal from "@/components/ReorderModal";
import { AlertTriangle, Info, CheckCircle2, Star } from "lucide-react";

const OrderDetailPage = () => {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const [order, setOrder] = useState<OrderType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
    const [isReordering, setIsReordering] = useState(false);
    const [reviewModalItems, setReviewModalItems] = useState<OrderItemType[]>([]);
   
    const [localReviewedIds, setLocalReviewedIds] = useState<Set<number>>(new Set());

    const fetchOrder = async () => {
        try {
            const data = await getOrder(parseInt(id));
            console.log("Order Data:", data);
            console.log("Order Items:", data.items);
            setOrder(data);
        } catch (error) {
            console.error("Failed to fetch order", error);
            toast.error("Failed to load order details");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id]);

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel this order?")) return;
        try {
            await cancelOrder(parseInt(id));
            toast.success("Order cancelled successfully");
            fetchOrder();
        } catch (error: any) {
            toast.error(error.message || "Failed to cancel order");
        }
    };

    const handleReturn = async () => {
        const reason = prompt("Please enter a reason for return:");
        if (!reason) return;

        try {
            await returnOrder(parseInt(id), reason);
            toast.success("Return request submitted");
            fetchOrder();
        } catch (error: any) {
            toast.error(error.message || "Failed to submit return request");
        }
    };

    const { addToCart, setSelectedItems, cart } = useCartStore();

    const handleReOrderClick = () => {
        setIsReorderModalOpen(true);
    };

    const handleConfirmReorder = async (selectedItems: { item: OrderItemType; quantity: number }[]) => {
        setIsReordering(true);
        try {
            const newSelectedIds: number[] = [];

            for (const { item, quantity } of selectedItems) {
                if (item.productId) {
                    const mockProduct = { id: item.productId } as any;
                    const updatedItems = await addToCart(
                        mockProduct,
                        quantity,
                        item.variantId,
                        item.color,
                        item.size
                    );

                    const sourceItems = updatedItems || useCartStore.getState().cart;

                    const cartItem = sourceItems.find(c =>
                        Number(c.productId) === Number(item.productId) &&
                        Number(c.variantId || 0) === Number(item.variantId || 0)
                    );

                    if (cartItem) {
                        newSelectedIds.push(cartItem.id);
                    } else {
                        const itemsWithSameProduct = sourceItems.filter(c => Number(c.productId) === Number(item.productId));
                        if (itemsWithSameProduct.length === 1) {
                            newSelectedIds.push(itemsWithSameProduct[0].id);
                        }
                    }
                }
            }

            if (newSelectedIds.length > 0) {
                setSelectedItems(newSelectedIds);
                router.push("/cart?step=2");
            } else {
                toast.error("Could not select items for checkout");
                router.push("/cart"); 
            }

        } catch (error) {
            console.error("Re-order failed", error);
        } finally {
            setIsReordering(false);
            setIsReorderModalOpen(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading order details...</div>;
    }

    if (!order) {
        return <div className="p-8 text-center">Order not found</div>;
    }

    const steps = [
        { label: 'Đặt hàng', icon: Clock },
        { label: 'Xác nhận', icon: Package },
        { label: 'Đang Giao', icon: MapPin },
        { label: 'Thành công', icon: CheckCircle },
    ];

    const getTimelineStep = (status: string) => {
        switch (status) {
            case ORDER_STATUS.PENDING: return 0;
            case ORDER_STATUS.CONFIRMED:
            case ORDER_STATUS.PACKED: return 1;
            case ORDER_STATUS.SHIPPED: return 2;
            case ORDER_STATUS.DELIVERED:
            case ORDER_STATUS.RETURN_REQUESTED:
            case ORDER_STATUS.RETURNED:
            case ORDER_STATUS.REFUNDED: return 3;
            default: return -1;
        }
    };

    const currentStepIndex = getTimelineStep(order.status);
    const isCancelled = order.status === ORDER_STATUS.CANCELED;
    const isReturned = [ORDER_STATUS.RETURN_REQUESTED, ORDER_STATUS.RETURNED, ORDER_STATUS.REFUNDED].includes(order.status);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/account/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
                    <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="ml-auto">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusLabel(order.status)}
                    </span>
                </div>
            </div>

            {/* TRACKING TIMELINE */}
            {!isCancelled && (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Order Status</h3>
                    <div className="relative flex justify-between">
                        {/* Progress Bar Background */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0 hidden md:block" />

                        {/* Progress Bar Active */}
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 hidden md:block transition-all duration-1000"
                            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                        />

                        {steps.map((step, index) => {
                            const isCompleted = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            const Icon = step.icon;

                            let stepColorClass = isCompleted ? "bg-primary border-primary text-white" : "bg-white border-gray-300 text-gray-300";
                            if (isCancelled || isReturned) stepColorClass = "bg-red-100 border-red-500 text-red-500";

                            return (
                                <div key={index} className="relative z-10 flex flex-col items-center gap-2 bg-gray-50 md:bg-transparent px-2" style={{ width: '25%' }}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${stepColorClass} ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-center">
                                        <p className={`text-xs font-bold mt-2 ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* STATUS BANNERS */}

            {order.status === ORDER_STATUS.DELIVERED && (() => {
                const RETURN_WINDOW_DAYS = 7;
                const deliveredMs = order.deliveredAt ? new Date(order.deliveredAt).getTime() : null;
                const isExpired = deliveredMs !== null && (new Date().getTime() - deliveredMs > RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000);
                const deadlineDate = deliveredMs ? new Date(deliveredMs + RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN') : null;
                return (
                <div className={`${isExpired ? 'bg-gray-50 border-gray-200' : 'bg-emerald-50 border-emerald-200'} border rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2`}>
                    <CheckCircle2 className={`w-5 h-5 ${isExpired ? 'text-gray-400' : 'text-emerald-600'} mt-0.5 flex-shrink-0`} />
                    <div>
                        <h4 className={`font-bold ${isExpired ? 'text-gray-800' : 'text-emerald-800'}`}>Giao hàng thành công</h4>
                        <p className={`text-sm ${isExpired ? 'text-gray-500' : 'text-emerald-600'} mt-1`}>
                            {isExpired ? (
                                <>Đã quá thời gian {RETURN_WINDOW_DAYS} ngày để yêu cầu Trả hàng / Hoàn tiền. Nếu sản phẩm có lỗi phát sinh sau này, vui lòng liên hệ bộ phận Bảo hành.</>
                            ) : deadlineDate ? (
                                <>
                                    Vui lòng kiểm tra hàng. Nếu có vấn đề, hãy yêu cầu <b>Trả hàng/Hoàn tiền</b> trước ngày <b>{deadlineDate}</b>.
                                    <br />Nếu bạn hài lòng, hãy bấm <b>Đánh giá</b> để nhận xu tích lũy nhé!
                                </>
                            ) : (
                                <>Đơn hàng đã được giao. Bạn có thể yêu cầu trả hàng nếu cần.</>
                            )}
                        </p>
                    </div>
                </div>
                );
            })()}

            {order.status === ORDER_STATUS.RETURN_REQUESTED && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-orange-800">Yêu cầu trả hàng đang được xem xét</h4>
                        <p className="text-sm text-orange-600 mt-1">
                            Shop đang kiểm tra yêu cầu của bạn. Vui lòng chờ phản hồi trong vòng 24-48h.
                            Trong thời gian này, các chức năng khác sẽ bị tạm khóa.
                        </p>
                    </div>
                </div>
            )}

            {order.status === ORDER_STATUS.RETURNED && (
                <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-gray-800">Đã trả hàng thành công</h4>
                        <p className="text-sm text-gray-600 mt-1">
                            Yêu cầu trả hàng đã được chấp thuận. Tiền sẽ được hoàn về ví/tài khoản của bạn.
                        </p>
                    </div>
                </div>
            )}


            <div className="grid md:grid-cols-3 gap-8">
                {/* ITEMS */}
                <div className="md:col-span-2 space-y-6">
                    <h3 className="font-bold text-gray-900">Items</h3>
                    <div className="space-y-4">
                        {order.items?.map((item, i) => (
                            <div key={i} className="flex gap-4 border border-gray-100 rounded-xl p-4 relative bg-white items-center">
                                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 group">
                                    {item.productId ? (
                                        <Link href={`/products/${item.productId}`} className="block w-full h-full">
                                            <Image
                                                src={item.productImageUrl || item.thumbnailUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000"}
                                                alt={item.productName}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </Link>
                                    ) : (
                                        <Image
                                            src={item.productImageUrl || item.thumbnailUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000"}
                                            alt={item.productName}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-gray-900 line-clamp-2">
                                            {item.productId ? (
                                                <Link href={`/products/${item.productId}`} className="hover:text-primary transition-colors cursor-pointer">
                                                    {item.productName}
                                                </Link>
                                            ) : (
                                                <span>{item.productName}</span>
                                            )}
                                        </h4>
                                        <div className="text-sm text-gray-500">
                                            {item.variantInfo ? (
                                                <p>{item.variantInfo}</p>
                                            ) : (
                                                <div className="flex gap-3">
                                                    {item.color && <span>Màu: {item.color}</span>}
                                                    {item.size && <span>Size: {item.size}</span>}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">x{item.quantity}</p>
                                    </div>

                                    <div className="flex flex-col items-end gap-3 min-w-[120px]">
                                        <p className="font-bold text-gray-900 text-lg">{(item.price || item.unitPrice || 0).toLocaleString('vi-VN')}đ</p>

                                        {/* PER-ITEM ACTION BUTTON */}
                                        {order.status === ORDER_STATUS.DELIVERED && !isReturned && (
                                            <>
                                                {!(item.hasReviewed || localReviewedIds.has(item.id)) ? (
                                                    <button
                                                        onClick={() => {
                                                            setReviewModalItems([item]);
                                                            setIsReviewOpen(true);
                                                        }}
                                                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold rounded-lg hover:shadow-md hover:-translate-y-0.5 transition-all shadow-orange-200 cursor-pointer flex items-center gap-1.5"
                                                    >
                                                        <Star className="w-3.5 h-3.5" />
                                                        Đánh giá
                                                    </button>
                                                ) : (
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1">
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Đã đánh giá
                                                        </span>
                                                        <button 
                                                            onClick={handleReOrderClick}
                                                            className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <ShoppingBag className="w-3 h-3" /> Mua lại
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 mt-6">
                        {/* 1. STATE: PENDING */}
                        {order.status === ORDER_STATUS.PENDING && (
                            <button
                                onClick={handleCancel}
                                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200 transition-all cursor-pointer"
                            >
                                Hủy Đơn Hàng
                            </button>
                        )}

                        {/* 2. STATE: SHIPPED */}
                        {order.status === ORDER_STATUS.SHIPPED && (
                            <button className="px-6 py-2.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg font-bold hover:bg-blue-100 transition-all cursor-pointer">
                                Theo dõi đơn hàng
                            </button>
                        )}

                        {/* 3. STATE: DELIVERED (The Buffer Zone) */}
                        {order.status === ORDER_STATUS.DELIVERED && !isReturned && (() => {
                            const RETURN_WINDOW_DAYS = 7;
                            const deliveredMs = order.deliveredAt ? new Date(order.deliveredAt).getTime() : null;
                            // Neu khong co deliveredAt: an nut tra hang (fail-safe)
                            const isExpired = deliveredMs === null || (new Date().getTime() - deliveredMs > RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000);
                            const hasReviewedAny = order.items?.some(i => i.hasReviewed || localReviewedIds.has(i.id));
                            return (
                            <>
                                {!hasReviewedAny ? (
                                    <div className="flex flex-col gap-2 w-full md:w-auto">
                                        {isExpired ? (
                                            <div className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 flex items-center gap-2 text-gray-500 opacity-70">
                                                <AlertTriangle className="w-4 h-4" />
                                                <span className="font-bold text-sm text-gray-400">Đã quá thời gian {RETURN_WINDOW_DAYS} ngày trả hàng</span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleReturn}
                                                className="w-full px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-all cursor-pointer"
                                            >
                                                Yêu cầu Trả hàng / Hoàn tiền
                                            </button>
                                        )}
                                        <p className="text-xs text-gray-400 italic">
                                            {isExpired
                                              ? `*Bạn đã quá hạn ${RETURN_WINDOW_DAYS} ngày để yêu cầu hoàn tiền cho đơn hàng này.`
                                              : "*Lưu ý: Bạn sẽ mất quyền trả hàng nếu đã đánh giá sản phẩm."}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-lg border border-orange-100 flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        Bạn đã đánh giá sản phẩm nên không thể yêu cầu trả hàng.
                                    </p>
                                )}
                            </>
                            );
                        })()}

                        {/* 4. STATE: Final States for Re-ordering */}
                        {[ORDER_STATUS.CANCELED, ORDER_STATUS.RETURNED, ORDER_STATUS.REFUNDED, ORDER_STATUS.DELIVERED].includes(order.status) && (
                            <button
                                onClick={handleReOrderClick}
                                className="w-full md:w-auto px-8 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark shadow-lg shadow-primary/30 transition-all cursor-pointer"
                            >
                                Mua lại
                            </button>
                        )}
                    </div>
                </div>

                {/* SUMMARY */}
                <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                        <h3 className="font-bold text-gray-900">Order Summary</h3>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>{((order.subtotal || order.totalAmount) - (order.shippingFee || 0)).toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Shipping</span>
                            <span>{(order.shippingFee || 0).toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="h-px bg-gray-200" />
                        <div className="flex justify-between font-bold text-gray-900">
                            <span>Total</span>
                            <span>{(order.totalAmount || 0).toLocaleString('vi-VN')}đ</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="font-bold text-sm text-gray-900">Shipping Address</p>
                                {order.shippingAddress ? (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {order.shippingAddress.fullName}<br />
                                        {order.shippingAddress.addressLine}<br />
                                        {order.shippingAddress.phone}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-500 mt-1">No address info</p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <CreditCard className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="font-bold text-sm text-gray-900">Payment Method</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {typeof order.paymentMethod === 'string' ? order.paymentMethod : order.paymentMethod?.type}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* REVIEW MODAL */}
            <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                items={reviewModalItems}
                onReviewSuccess={(reviewedItemId: number) => {
                    setLocalReviewedIds(prev => new Set(prev).add(reviewedItemId));
                    setIsReviewOpen(false);
                    toast.success("Đánh giá thành công! Cảm ơn bạn 🎉");
                    fetchOrder();
                }}
            />

            {/* REORDER MODAL */}
            {order.items && (
                <ReorderModal
                    isOpen={isReorderModalOpen}
                    onClose={() => setIsReorderModalOpen(false)}
                    items={order.items}
                    onConfirm={handleConfirmReorder}
                    isLoading={isReordering}
                />
            )}
        </div>
    );
};

export default OrderDetailPage;
