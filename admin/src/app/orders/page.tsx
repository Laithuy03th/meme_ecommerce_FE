"use client";

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
import { Search, Eye, Filter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock orders data
const orders = [
    {
        id: "ORD-001",
        customer: "John Doe",
        email: "john@example.com",
        items: 3,
        total: 120.00,
        paymentStatus: "PAID",
        paymentMethod: "COD",
        orderStatus: "PENDING",
        date: "2024-01-15 10:30",
    },
    {
        id: "ORD-002",
        customer: "Jane Smith",
        email: "jane@example.com",
        items: 1,
        total: 85.50,
        paymentStatus: "PAID",
        paymentMethod: "VNPAY",
        orderStatus: "SHIPPED",
        date: "2024-01-15 09:15",
    },
    {
        id: "ORD-003",
        customer: "Mike Johnson",
        email: "mike@example.com",
        items: 2,
        total: 299.99,
        paymentStatus: "PAID",
        paymentMethod: "Momo",
        orderStatus: "COMPLETED",
        date: "2024-01-14 16:20",
    },
    {
        id: "ORD-004",
        customer: "Sarah Williams",
        email: "sarah@example.com",
        items: 1,
        total: 45.00,
        paymentStatus: "UNPAID",
        paymentMethod: "COD",
        orderStatus: "PENDING",
        date: "2024-01-14 14:15",
    },
];

const OrdersPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const getOrderStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "bg-emerald-100 text-emerald-700";
            case "SHIPPED":
                return "bg-blue-100 text-blue-700";
            case "PENDING":
                return "bg-amber-100 text-amber-700";
            case "CANCELED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getPaymentStatusColor = (status: string) => {
        return status === "PAID"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-700";
    };

    // Stats calculation
    const stats = [
        { label: "Total Orders", value: "1,234", color: "bg-blue-500" },
        { label: "Pending", value: "89", color: "bg-amber-500" },
        { label: "Shipped", value: "156", color: "bg-purple-500" },
        { label: "Completed", value: "989", color: "bg-emerald-500" },
    ];

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
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <div className={`${stat.color} w-8 h-8 rounded-md`}></div>
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
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by order ID or customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="canceled">Canceled</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            More Filters
                        </Button>
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
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium text-primary">
                                        {order.id}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{order.customer}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.email}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{order.items} items</TableCell>
                                    <TableCell className="font-semibold">
                                        ${order.total.toFixed(2)}
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
                                        <Badge className={getOrderStatusColor(order.orderStatus)}>
                                            {order.orderStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {order.date}
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
                </CardContent>
            </Card>
        </div>
    );
};

export default OrdersPage;
