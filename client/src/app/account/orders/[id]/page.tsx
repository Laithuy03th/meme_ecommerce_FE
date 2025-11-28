"use client";

import { cancelOrder, getOrder, returnOrder } from "@/services/api";
import { OrderType } from "@/types";
import { ArrowLeft, CheckCircle, Clock, CreditCard, MapPin, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const OrderDetailPage = () => {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const [order, setOrder] = useState<OrderType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrder = async () => {
        try {
            const data = await getOrder(parseInt(id));
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

    if (isLoading) {
        return <div className="p-8 text-center">Loading order details...</div>;
    }

    if (!order) {
        return <div className="p-8 text-center">Order not found</div>;
    }

    // Timeline logic (simplified based on status)
    const steps = [
        { status: 'PENDING', label: 'Order Placed' },
        { status: 'PROCESSING', label: 'Processing' },
        { status: 'SHIPPING', label: 'Shipped' },
        { status: 'DELIVERED', label: 'Delivered' },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status) !== -1
        ? steps.findIndex(s => s.status === order.status)
        : (order.status === 'CANCELLED' ? -1 : 0);

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
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                        }`}>
                        {order.status}
                    </span>
                </div>
            </div>

            {/* TRACKING TIMELINE */}
            {order.status !== 'CANCELLED' && (
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
                            return (
                                <div key={index} className="relative z-10 flex flex-col items-center gap-2 bg-gray-50 md:bg-transparent px-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isCompleted ? "bg-primary border-primary text-white" : "bg-white border-gray-300 text-gray-300"
                                        }`}>
                                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                    </div>
                                    <div className="text-center">
                                        <p className={`text-xs font-bold ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-8">
                {/* ITEMS */}
                <div className="md:col-span-2 space-y-6">
                    <h3 className="font-bold text-gray-900">Items</h3>
                    <div className="space-y-4">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex gap-4 border border-gray-100 rounded-xl p-4">
                                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.thumbnailUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000"}
                                        alt={item.productName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{item.productName}</h4>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                                            {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                                        </div>
                                        <p className="font-bold text-gray-900">${item.unitPrice.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-4 pt-4">
                        {order.status === 'PENDING' && (
                            <button
                                onClick={handleCancel}
                                className="text-red-600 font-medium hover:underline"
                            >
                                Cancel Order
                            </button>
                        )}
                        {order.status === 'DELIVERED' && (
                            <button
                                onClick={handleReturn}
                                className="text-primary font-medium hover:underline"
                            >
                                Return / Refund
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
                            <span>${(order.totalAmount - order.shippingFee).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Shipping</span>
                            <span>${order.shippingFee.toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-gray-200" />
                        <div className="flex justify-between font-bold text-gray-900">
                            <span>Total</span>
                            <span>${order.totalAmount.toFixed(2)}</span>
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
        </div>
    );
};

export default OrderDetailPage;
