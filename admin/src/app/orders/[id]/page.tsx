"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    Package,
    MapPin,
    CreditCard,
    User,
    CheckCircle2,
    Clock,
    Truck,
    Home as HomeIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const OrderDetailPage = ({ params }: { params: { id: string } }) => {
    const [orderStatus, setOrderStatus] = useState("PENDING");

    // Mock order data
    const order = {
        id: "ORD-001",
        customer: {
            name: "John Doe",
            email: "john@example.com",
            phone: "+1 234 567 890",
        },
        shipping: {
            fullName: "John Doe",
            phone: "+1 234 567 890",
            addressLine1: "123 Main Street, Apt 4B",
            ward: "Ward 1",
            district: "District 1",
            province: "New York",
            country: "United States",
        },
        payment: {
            method: "COD",
            status: "UNPAID",
            total: 120.0,
            subtotal: 110.0,
            shippingFee: 10.0,
        },
        items: [
            {
                id: 1,
                productName: "Wireless Headphones",
                sku: "WH-001",
                color: "Black",
                size: "",
                quantity: 2,
                unitPrice: 50.0,
                totalPrice: 100.0,
            },
            {
                id: 2,
                productName: "Cotton T-Shirt",
                sku: "TS-003",
                color: "White",
                size: "M",
                quantity: 1,
                unitPrice: 10.0,
                totalPrice: 10.0,
            },
        ],
        timeline: [
            {
                status: "Order Placed",
                date: "2024-01-15 10:30 AM",
                completed: true,
            },
            {
                status: "Payment Confirmed",
                date: "2024-01-15 10:31 AM",
                completed: true,
            },
            { status: "Processing", date: null, completed: false },
            { status: "Shipped", date: null, completed: false },
            { status: "Delivered", date: null, completed: false },
        ],
        createdAt: "2024-01-15 10:30 AM",
    };

    const statusOptions = ["PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELED"];

    const getStatusIcon = (completed: boolean) => {
        if (completed) return CheckCircle2;
        return Clock;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/orders">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Order {order.id}
                        </h1>
                        <p className="text-muted-foreground mt-1">{order.createdAt}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={orderStatus} onValueChange={setOrderStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button>Update Status</Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                                >
                                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                        <Package className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.productName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            SKU: {item.sku}
                                        </p>
                                        {item.color && (
                                            <p className="text-sm text-muted-foreground">
                                                Color: {item.color}
                                            </p>
                                        )}
                                        {item.size && (
                                            <p className="text-sm text-muted-foreground">
                                                Size: {item.size}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">
                                            ${item.totalPrice.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Order Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.timeline.map((item, index) => {
                                    const Icon = getStatusIcon(item.completed);
                                    return (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${item.completed
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted text-muted-foreground"
                                                        }`}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                {index < order.timeline.length - 1 && (
                                                    <div
                                                        className={`w-0.5 h-12 ${item.completed ? "bg-primary" : "bg-muted"
                                                            }`}
                                                    ></div>
                                                )}
                                            </div>
                                            <div className="flex-1 pb-8">
                                                <p
                                                    className={`font-semibold ${item.completed
                                                            ? "text-foreground"
                                                            : "text-muted-foreground"
                                                        }`}
                                                >
                                                    {item.status}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.date || "Pending"}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Customer
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-semibold">{order.customer.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {order.customer.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {order.customer.phone}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Shipping Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm">
                            <p className="font-semibold">{order.shipping.fullName}</p>
                            <p className="text-muted-foreground">
                                {order.shipping.addressLine1}
                            </p>
                            <p className="text-muted-foreground">
                                {order.shipping.ward}, {order.shipping.district}
                            </p>
                            <p className="text-muted-foreground">
                                {order.shipping.province}, {order.shipping.country}
                            </p>
                            <Separator className="my-2" />
                            <p className="text-muted-foreground">{order.shipping.phone}</p>
                        </CardContent>
                    </Card>

                    {/* Payment Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-semibold">
                                    ${order.payment.subtotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="font-semibold">
                                    ${order.payment.shippingFee.toFixed(2)}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="font-semibold">Total</span>
                                <span className="font-bold text-primary">
                                    ${order.payment.total.toFixed(2)}
                                </span>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Method: {order.payment.method}
                                </p>
                                <Badge
                                    className={
                                        order.payment.status === "PAID"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-red-100 text-red-700"
                                    }
                                >
                                    {order.payment.status}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
