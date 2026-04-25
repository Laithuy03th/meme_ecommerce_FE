"use client";

import { getOrders } from "@/services/api";
import { OrderType } from "@/types";
import { ChevronRight, Package, ShoppingBag, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getOrderStatusColor, getOrderStatusLabel } from "@/lib/orderUtils";
import { useEffect, useState } from "react";

const OrdersPage = () => {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                setOrders(data.content);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Order History</h2>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">No orders yet</h2>
                <p className="text-gray-500">Start shopping to see your orders here.</p>
                <Link
                    href="/products"
                    className="mt-2 bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary-dark transition-colors"
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Order History</h2>

            <div className="space-y-4">
                {orders.map((order) => (
                    <Link
                        href={`/account/orders/${order.id}`}
                        key={order.id}
                        className="block border border-gray-200 rounded-xl p-4 hover:border-primary transition-all hover:shadow-md bg-white group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                {order.firstItemImageUrl ? (
                                    <Image 
                                        src={order.firstItemImageUrl} 
                                        alt="Product" 
                                        fill 
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-6 h-6 text-gray-300" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-gray-900 truncate">Order #{order.id}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getOrderStatusColor(order.status)}`}>
                                        {getOrderStatusLabel(order.status)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                                    <span className="mx-1">•</span>
                                    <span>{order.itemCount || 0} sản phẩm</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-3">
                            <span className="text-gray-400 text-xs italic">Xem chi tiết đơn hàng</span>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900">{order.totalAmount.toLocaleString('vi-VN')}đ</span>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                    </Link>
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;
