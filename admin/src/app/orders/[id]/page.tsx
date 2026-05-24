"use client";

import { useState, useEffect, use } from "react";
import { orderApi } from "@/services/orderApi";
import { handleApiError } from "@/lib/error-handler";
import type { OrderDetail, OrderStatus } from "@/types/order";
import { ORDER_STATUS_TRANSITIONS } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Package, MapPin, CreditCard, User, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        loadOrder();
    }, []);

    const loadOrder = async () => {
        try {
            setLoading(true);
            const data = await orderApi.getById(parseInt(id));
            setOrder(data);
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: OrderStatus) => {
        if (!order) return;

        let confirmMessage = `Xác nhận chuyển trạng thái đến "${newStatus}"?`;

        // Custom confirmation messages based on Backend logic
        if (newStatus === 'CANCELED') {
            confirmMessage = "Hủy đơn hàng? Hành động này sẽ cộng lại số lượng sản phẩm vào kho. Bạn có chắc chắn không?";
        } else if (newStatus === 'RETURNED') {
            if (order.status === 'SHIPPED') {
                confirmMessage = "Khách không nhận hàng? Hàng sẽ được nhập lại kho. Tiếp tục?";
            } else {
                confirmMessage = "Đồng ý nhận lại hàng? Hành động này sẽ cộng lại số lượng sản phẩm vào kho. Bạn có chắc chắn không?";
            }
        }

        if (!confirm(confirmMessage)) return;

        try {
            setUpdating(true);
            await orderApi.updateStatus(order.id, newStatus);
            alert("Cập nhật trạng thái thành công");
            loadOrder();
        } catch (error) {
            handleApiError(error);
        } finally {
            setUpdating(false);
        }
    };

    const renderActionButtons = () => {
        if (!order) return null;

        const buttons = [];

        switch (order.status) {
            case 'PENDING':
                const canConfirm = order.paymentMethod === 'COD' || order.paymentStatus === 'PAID';
                buttons.push(
                    <Button key="confirm" onClick={() => handleStatusChange('CONFIRMED')} disabled={updating || !canConfirm} className="bg-blue-600 hover:bg-blue-700" title={!canConfirm ? "Không thể xác nhận đơn thanh toán online chưa thanh toán" : ""}>
                        {canConfirm ? 'Xác nhận' : 'Chờ thanh toán'}
                    </Button>,
                    <Button key="cancel" onClick={() => handleStatusChange('CANCELED')} disabled={updating} variant="destructive">
                        Hủy đơn
                    </Button>
                );
                break;
            case 'CONFIRMED':
                buttons.push(
                    <Button key="pack" onClick={() => handleStatusChange('PACKED')} disabled={updating} className="bg-purple-600 hover:bg-purple-700">
                        Đóng gói
                    </Button>,
                    <Button key="cancel" onClick={() => handleStatusChange('CANCELED')} disabled={updating} variant="destructive">
                        Hủy đơn
                    </Button>
                );
                break;
            case 'PACKED':
                buttons.push(
                    <Button key="ship" onClick={() => handleStatusChange('SHIPPED')} disabled={updating} className="bg-cyan-600 hover:bg-cyan-700">
                        Giao cho Shipper
                    </Button>,
                    <Button key="cancel" onClick={() => handleStatusChange('CANCELED')} disabled={updating} variant="destructive">
                        Hủy đơn
                    </Button>
                );
                break;
            case 'SHIPPED':
                buttons.push(
                    <Button key="delivered" onClick={() => handleStatusChange('DELIVERED')} disabled={updating} className="bg-green-600 hover:bg-green-700 h-10 px-6 text-lg">
                        Giao thành công
                    </Button>,
                    <Button key="return_req" onClick={() => handleStatusChange('RETURN_REQUESTED')} disabled={updating} className="bg-orange-500 hover:bg-orange-600">
                        Khách trả hàng
                    </Button>,
                    <Button key="returned" onClick={() => handleStatusChange('RETURNED')} disabled={updating} className="bg-slate-700 hover:bg-slate-800">
                        Giao thất bại / Hoàn về
                    </Button>,
                    <Button key="cancel" onClick={() => handleStatusChange('CANCELED')} disabled={updating} variant="destructive">
                        Hủy giao
                    </Button>
                );
                break;
            case 'DELIVERED':
                buttons.push(
                    <Button key="return_req" onClick={() => handleStatusChange('RETURN_REQUESTED')} disabled={updating} className="bg-orange-500 hover:bg-orange-600">
                        Tạo yêu cầu trả hàng
                    </Button>,
                    <Button key="refund" onClick={() => handleStatusChange('REFUNDED')} disabled={updating} className="bg-emerald-700 hover:bg-emerald-800">
                        Hoàn tiền
                    </Button>
                );
                break;
            case 'RETURN_REQUESTED':
                buttons.push(
                    <Button key="returned" onClick={() => handleStatusChange('RETURNED')} disabled={updating} className="bg-green-600 hover:bg-green-700">
                        ✅ Đồng ý nhận lại
                    </Button>,
                    <Button key="reject_return" onClick={() => handleStatusChange('DELIVERED')} disabled={updating} variant="destructive">
                        ❌ Từ chối trả hàng
                    </Button>
                );
                break;
            case 'RETURNED':
                buttons.push(
                    <Button key="refund" onClick={() => handleStatusChange('REFUNDED')} disabled={updating} className="bg-emerald-700 hover:bg-emerald-800">
                        Hoàn tiền cho khách
                    </Button>
                );
                break;
            default:
                return <p className="text-muted-foreground italic">Order is in terminal state ({order.status}). No authorized actions.</p>;
        }

        return buttons;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return <div>Order not found</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header with Timeline */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/orders">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Order #{order.id}</h1>
                            <p className="text-muted-foreground mt-1 text-sm flex items-center gap-2">
                                Created {format(new Date(order.createdAt), 'PPpp')}
                                {order.updatedAt && (
                                    <>
                                        <span>•</span>
                                        <span>Last Updated: {format(new Date(order.updatedAt), 'PPpp')}</span>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                    <Badge className={`text-lg px-4 py-2 ${order.status === 'CANCELED' || order.status === 'RETURNED' ? 'bg-gray-500' :
                        order.status === 'CONFIRMED' ? 'bg-blue-500' :
                            order.status === 'SHIPPED' ? 'bg-cyan-600' :
                                order.status === 'DELIVERED' ? 'bg-green-600' :
                                    ''
                        }`}>
                        {order.status}
                    </Badge>
                </div>

                {/* Timeline */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4">
                            {/* Process Steps */}
                            {[
                                { status: 'PENDING', label: 'Đặt hàng', icon: '📝' },
                                { status: 'CONFIRMED', label: 'Xác nhận', icon: '✅' },
                                { status: 'SHIPPED', label: 'Giao hàng', icon: '🚚' },
                                { status: 'DELIVERED', label: 'Hoàn thành', icon: '🎉' }
                            ].map((step, index, arr) => {
                                const isCompleted = ['CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'RETURN_REQUESTED', 'RETURNED', 'REFUNDED'].includes(order.status) || (order.status === 'PENDING' && index === 0);
                                // Handle Canceled/Returned logic for visual
                                const isFailed = order.status === 'CANCELED' || (order.status === 'RETURNED' && step.status !== 'PENDING');

                                return (
                                    <div key={step.status} className="flex flex-col items-center relative z-10 bg-card px-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 ${isFailed ? 'border-gray-400 bg-gray-100 text-gray-500' :
                                            isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-muted text-muted-foreground'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <span className={`font-semibold text-sm ${isFailed ? 'text-gray-500' : ''}`}>{step.label}</span>
                                    </div>
                                );
                            })}

                            {/* Connecting Line */}
                            <div className="absolute top-4 left-0 w-full h-0.5 bg-muted -z-0 hidden md:block" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Action Bar */}
            <Card className="border-t-4 border-t-primary shadow-md">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Xử lý đơn hàng</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {renderActionButtons()}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Customer Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Customer Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{order.shippingFullName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{order.userEmail}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-medium">{order.shippingPhone}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Shipping Address
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{order.shippingAddressLine1}</p>
                        {order.shippingWard && <p>{order.shippingWard}</p>}
                        {order.shippingDistrict && <p>{order.shippingDistrict}</p>}
                        {order.shippingProvince && <p>{order.shippingProvince}</p>}
                        {order.shippingCountry && <p>{order.shippingCountry}</p>}
                    </CardContent>
                </Card>
            </div>

            {/* Payment Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Payment Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <p className="text-sm text-muted-foreground">Payment Method</p>
                            <p className="font-medium">{order.paymentMethod}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Payment Status</p>
                            <Badge>{order.paymentStatus}</Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Amount</p>
                            <p className="text-2xl font-bold">{order.totalAmount.toLocaleString()}đ</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Order Items
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center border-b pb-4">
                                <div>
                                    <Link href={`/products/${item.productId}`} className="font-medium hover:underline text-primary">
                                        {item.productName}
                                    </Link>
                                    <p className="text-sm text-muted-foreground">
                                        {item.unitPrice.toLocaleString()}đ × {item.quantity}
                                    </p>
                                </div>
                                <p className="font-semibold">{item.lineTotal.toLocaleString()}đ</p>
                            </div>
                        ))}
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{(order.totalAmount - order.shippingFee).toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping Fee</span>
                                <span>{order.shippingFee.toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>Total</span>
                                <span>{order.totalAmount.toLocaleString()}đ</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {order.note && (
                <Card>
                    <CardHeader>
                        <CardTitle>Order Note</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{order.note}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
