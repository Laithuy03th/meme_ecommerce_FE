import { Package, Truck, CheckCircle, Clock, MapPin, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/mockData";

const OrderDetailPage = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}) => {
    const id = (await params).id;

    // Mock Order Data
    const order = {
        id: id,
        date: 'Oct 25, 2023',
        status: 'Shipping', // Processing, Shipping, Delivered, Cancelled
        total: 389.98,
        shippingAddress: {
            name: 'John Doe',
            address: '123 Main St, Apt 4B',
            city: 'New York, NY 10001',
            phone: '+1 234 567 890'
        },
        paymentMethod: 'Visa ending in 4242',
        items: [
            { ...products[0], quantity: 1, selectedColor: 'Black' },
            { ...products[3], quantity: 1 }
        ],
        timeline: [
            { status: 'Order Placed', date: 'Oct 25, 10:30 AM', completed: true },
            { status: 'Processing', date: 'Oct 25, 02:00 PM', completed: true },
            { status: 'Shipped', date: 'Oct 26, 09:00 AM', completed: true },
            { status: 'Out for Delivery', date: 'Pending', completed: false },
            { status: 'Delivered', date: 'Pending', completed: false },
        ]
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/account/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order {order.id}</h1>
                    <p className="text-sm text-gray-500">Placed on {order.date}</p>
                </div>
                <div className="ml-auto">
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                        {order.status}
                    </span>
                </div>
            </div>

            {/* TRACKING TIMELINE */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6">Order Status</h3>
                <div className="relative flex justify-between">
                    {/* Progress Bar Background */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0 hidden md:block" />

                    {/* Progress Bar Active */}
                    <div className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 hidden md:block transition-all duration-1000" style={{ width: '60%' }} />

                    {order.timeline.map((step, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center gap-2 bg-gray-50 md:bg-transparent px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step.completed ? "bg-primary border-primary text-white" : "bg-white border-gray-300 text-gray-300"
                                }`}>
                                {step.completed ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                            </div>
                            <div className="text-center">
                                <p className={`text-xs font-bold ${step.completed ? "text-gray-900" : "text-gray-400"}`}>{step.status}</p>
                                <p className="text-[10px] text-gray-500">{step.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* ITEMS */}
                <div className="md:col-span-2 space-y-6">
                    <h3 className="font-bold text-gray-900">Items</h3>
                    <div className="space-y-4">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex gap-4 border border-gray-100 rounded-xl p-4">
                                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            {item.selectedColor && <p className="text-sm text-gray-500">Color: {item.selectedColor}</p>}
                                        </div>
                                        <p className="font-bold text-gray-900">${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-4 pt-4">
                        {order.status === 'Processing' && (
                            <button className="text-red-600 font-medium hover:underline">Cancel Order</button>
                        )}
                        {order.status === 'Delivered' && (
                            <button className="text-primary font-medium hover:underline">Return / Refund</button>
                        )}
                    </div>
                </div>

                {/* SUMMARY */}
                <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                        <h3 className="font-bold text-gray-900">Order Summary</h3>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>${(order.total - 10).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Shipping</span>
                            <span>$10.00</span>
                        </div>
                        <div className="h-px bg-gray-200" />
                        <div className="flex justify-between font-bold text-gray-900">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="font-bold text-sm text-gray-900">Shipping Address</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {order.shippingAddress.name}<br />
                                    {order.shippingAddress.address}<br />
                                    {order.shippingAddress.city}<br />
                                    {order.shippingAddress.phone}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <CreditCard className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="font-bold text-sm text-gray-900">Payment Method</p>
                                <p className="text-sm text-gray-600 mt-1">{order.paymentMethod}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
