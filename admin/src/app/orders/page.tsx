"use client";

import { useState, useEffect } from "react";
import { orderApi } from "@/services/orderApi";
import { handleApiError } from "@/lib/error-handler";
import type { OrderSummary, OrderStatus } from "@/types/order";
import type { PageResponse } from "@/types/common";
import { ORDER_STATUS_TRANSITIONS } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, Eye, Loader2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function OrdersPage() {
    const [orders, setOrders] = useState<PageResponse<OrderSummary> | null>(null);
    const [page, setPage] = useState(0);
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, [page, statusFilter]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const filterStatus = statusFilter === "ALL" ? undefined : (statusFilter as OrderStatus);
            const data = await orderApi.list(filterStatus, page, 20);
            setOrders(data);
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const getOrderStatusColor = (status: OrderStatus) => {
        const colors: Record<OrderStatus, string> = {
            DELIVERED: "bg-green-100 text-green-700 border-green-200",
            SHIPPED: "bg-cyan-100 text-cyan-700 border-cyan-200",
            CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
            PACKED: "bg-purple-100 text-purple-700 border-purple-200",
            PENDING: "bg-amber-100 text-amber-700 border-amber-200",
            CANCELED: "bg-gray-100 text-gray-700 border-gray-200",
            RETURNED: "bg-slate-100 text-slate-700 border-slate-200",
            REFUNDED: "bg-emerald-100 text-emerald-700 border-emerald-200",
            RETURN_REQUESTED: "bg-orange-100 text-orange-700 border-orange-200",
        };
        return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
    };

    const getPaymentStatusColor = (status: string) => {
        return status === "PAID"
            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
            : "bg-red-100 text-red-700 border-red-200";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    const stats = {
        total: orders?.totalElements || 0,
        pending: orders?.content.filter(o => o.status === "PENDING").length || 0,
        shipped: orders?.content.filter(o => o.status === "SHIPPED").length || 0,
        delivered: orders?.content.filter(o => o.status === "DELIVERED").length || 0,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground mt-1">
                    Manage and track all customer orders
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Total Orders", value: stats.total, color: "bg-blue-500" },
                    { label: "Pending", value: stats.pending, color: "bg-amber-500" },
                    { label: "Shipped", value: stats.shipped, color: "bg-purple-500" },
                    { label: "Delivered", value: stats.delivered, color: "bg-emerald-500" },
                ].map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <div className={`${stat.color} w-8 h-8 rounded-md flex items-center justify-center`}>
                                <ShoppingCart className="w-4 h-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus | "ALL")}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                <SelectItem value="PACKED">Packed</SelectItem>
                                <SelectItem value="SHIPPED">Shipped</SelectItem>
                                <SelectItem value="DELIVERED">Delivered</SelectItem>
                                <SelectItem value="CANCELED">Canceled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders?.content.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium text-primary">
                                        #{order.id}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{order.shippingFullName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.userEmail}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {order.totalAmount.toLocaleString()}đ
                                        <span className="text-xs text-muted-foreground block">
                                            + {order.shippingFee.toLocaleString()}đ ship
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                                                {order.paymentStatus}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground">
                                                {order.paymentMethod}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getOrderStatusColor(order.status) + " border"}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/orders/${order.id}`}>
                                            <Button variant="ghost" size="sm" className="gap-2">
                                                <Eye className="h-4 w-4" />
                                                View
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {orders && orders.totalPages > 1 && (
                        <div className="flex items-center justify-between p-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Page {page + 1} of {orders.totalPages} ({orders.totalElements} total)
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === 0}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page >= orders.totalPages - 1}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
