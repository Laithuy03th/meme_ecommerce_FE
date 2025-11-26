"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Package,
    AlertTriangle,
    TrendingDown,
    TrendingUp,
    Plus,
    Search,
} from "lucide-react";
import { useState } from "react";

// Mock inventory data
const inventoryItems = [
    {
        id: 1,
        productName: "Wireless Headphones",
        sku: "WH-001",
        variant: "Black",
        currentStock: 45,
        minStock: 20,
        maxStock: 100,
        location: "Warehouse A - Shelf 12",
        lastUpdated: "2024-01-15",
        status: "Good",
    },
    {
        id: 2,
        productName: "Smart Watch",
        sku: "SW-002",
        variant: "White",
        currentStock: 12,
        minStock: 20,
        maxStock: 80,
        location: "Warehouse A - Shelf 8",
        lastUpdated: "2024-01-14",
        status: "Low",
    },
    {
        id: 3,
        productName: "Cotton T-Shirt",
        sku: "TS-003",
        variant: "White - M",
        currentStock: 0,
        minStock: 30,
        maxStock: 150,
        location: "Warehouse B - Shelf 3",
        lastUpdated: "2024-01-10",
        status: "Out of Stock",
    },
    {
        id: 4,
        productName: "Desk Lamp",
        sku: "DL-004",
        variant: "Black",
        currentStock: 89,
        minStock: 15,
        maxStock: 100,
        location: "Warehouse A - Shelf 15",
        lastUpdated: "2024-01-15",
        status: "Overstock",
    },
];

const stockHistory = [
    {
        type: "Import",
        sku: "WH-001",
        quantity: 50,
        date: "2024-01-15 09:00",
    },
    { type: "Sale", sku: "SW-002", quantity: -8, date: "2024-01-14 14:30" },
    { type: "Return", sku: "TS-003", quantity: 5, date: "2024-01-14 11:20" },
    { type: "Sale", sku: "WH-001", quantity: -5, date: "2024-01-13 16:45" },
];

const InventoryPage = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Good":
                return "bg-emerald-100 text-emerald-700";
            case "Low":
                return "bg-amber-100 text-amber-700";
            case "Out of Stock":
                return "bg-red-100 text-red-700";
            case "Overstock":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStockPercentage = (current: number, max: number) => {
        return Math.min((current / max) * 100, 100);
    };

    const stats = [
        {
            label: "Total Items",
            value: "1,234",
            icon: Package,
            color: "bg-blue-500",
        },
        {
            label: "Low Stock",
            value: "12",
            icon: AlertTriangle,
            color: "bg-amber-500",
        },
        {
            label: "Out of Stock",
            value: "3",
            icon: TrendingDown,
            color: "bg-red-500",
        },
        {
            label: "Overstock",
            value: "8",
            icon: TrendingUp,
            color: "bg-purple-500",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Inventory Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Track stock levels and warehouse operations
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Stock Adjustment
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.label}
                                </CardTitle>
                                <div className={`${stat.color} p-2 rounded-lg`}>
                                    <Icon className="h-4 w-4 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by product name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Inventory Items */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Stock</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Stock Level</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inventoryItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-semibold">{item.productName}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        SKU: {item.sku}
                                                        {item.variant && ` - ${item.variant}`}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="font-semibold">
                                                            {item.currentStock} / {item.maxStock}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            Min: {item.minStock}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-muted rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all ${item.currentStock === 0
                                                                    ? "bg-red-500"
                                                                    : item.currentStock < item.minStock
                                                                        ? "bg-amber-500"
                                                                        : item.currentStock > item.maxStock * 0.8
                                                                            ? "bg-blue-500"
                                                                            : "bg-emerald-500"
                                                                }`}
                                                            style={{
                                                                width: `${getStockPercentage(
                                                                    item.currentStock,
                                                                    item.maxStock
                                                                )}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {item.location}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(item.status)}>
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Stock History */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {stockHistory.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex gap-3 p-3 bg-muted/50 rounded-lg"
                                >
                                    <div
                                        className={`w-2 h-2 rounded-full mt-2 ${activity.type === "Import"
                                                ? "bg-emerald-500"
                                                : activity.type === "Sale"
                                                    ? "bg-blue-500"
                                                    : "bg-amber-500"
                                            }`}
                                    ></div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-1">
                                            <p className="font-semibold text-sm">{activity.type}</p>
                                            <span
                                                className={`text-sm font-semibold ${activity.quantity > 0
                                                        ? "text-emerald-600"
                                                        : "text-red-600"
                                                    }`}
                                            >
                                                {activity.quantity > 0 ? "+" : ""}
                                                {activity.quantity}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            SKU: {activity.sku}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {activity.date}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default InventoryPage;
