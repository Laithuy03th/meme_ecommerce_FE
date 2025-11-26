import { Package, ChevronRight } from "lucide-react";
import Link from "next/link";

const OrdersPage = () => {
    // Mock orders
    const orders = [
        { id: 'ORD-001', date: '2023-10-25', status: 'Delivered', total: 129.99, items: 3 },
        { id: 'ORD-002', date: '2023-10-10', status: 'Processing', total: 59.50, items: 1 },
    ];

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
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Package className="w-5 h-5 text-gray-500 group-hover:text-primary" />
                                </div>
                                <div>
                                    <span className="font-bold text-gray-900 block">Order #{order.id}</span>
                                    <span className="text-xs text-gray-500">{order.date}</span>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                                    order.status === 'Processing' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
                            <span className="text-gray-500">{order.items} items</span>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
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
