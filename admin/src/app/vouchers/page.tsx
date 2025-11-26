"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Tag, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

// Mock vouchers data
const vouchers = [
    {
        id: 1,
        code: "SUMMER2024",
        discountType: "PERCENT",
        discountValue: 20,
        minOrderAmount: 50,
        maxDiscountAmount: 100,
        usageLimit: 1000,
        usedCount: 234,
        startDate: "2024-06-01",
        endDate: "2024-08-31",
        isActive: true,
    },
    {
        id: 2,
        code: "WELCOME10",
        discountType: "AMOUNT",
        discountValue: 10,
        minOrderAmount: 30,
        maxDiscountAmount: null,
        usageLimit: 500,
        usedCount: 89,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        isActive: true,
    },
    {
        id: 3,
        code: "FLASH50",
        discountType: "PERCENT",
        discountValue: 50,
        minOrderAmount: 100,
        maxDiscountAmount: 200,
        usageLimit: 100,
        usedCount: 100,
        startDate: "2024-01-10",
        endDate: "2024-01-15",
        isActive: false,
    },
];

const VouchersPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Vouchers & Promotions
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage discount codes and campaigns
                    </p>
                </div>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Voucher
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Voucher</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <Label>Voucher Code</Label>
                                    <Input placeholder="SUMMER2024" />
                                </div>
                                <div>
                                    <Label>Discount Type</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PERCENT">Percentage</SelectItem>
                                            <SelectItem value="AMOUNT">Fixed Amount</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Discount Value</Label>
                                    <Input type="number" placeholder="20" />
                                </div>
                                <div>
                                    <Label>Min Order Amount</Label>
                                    <Input type="number" placeholder="50" />
                                </div>
                                <div>
                                    <Label>Max Discount Amount</Label>
                                    <Input type="number" placeholder="100" />
                                </div>
                                <div>
                                    <Label>Usage Limit</Label>
                                    <Input type="number" placeholder="1000" />
                                </div>
                                <div>
                                    <Label>Start Date</Label>
                                    <Input type="date" />
                                </div>
                                <div>
                                    <Label>End Date</Label>
                                    <Input type="date" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1">
                                    Create Voucher
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Vouchers Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {vouchers.map((voucher) => (
                    <Card key={voucher.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Tag className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{voucher.code}</CardTitle>
                                        <Badge
                                            className={
                                                voucher.isActive
                                                    ? "bg-emerald-100 text-emerald-700 mt-1"
                                                    : "bg-gray-100 text-gray-700 mt-1"
                                            }
                                        >
                                            {voucher.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl">
                                <span className="text-sm text-muted-foreground">Discount</span>
                                <span className="font-bold text-primary">
                                    {voucher.discountType === "PERCENT"
                                        ? `${voucher.discountValue}%`
                                        : `$${voucher.discountValue}`}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Min Order</p>
                                    <p className="font-semibold">${voucher.minOrderAmount}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Max Discount</p>
                                    <p className="font-semibold">
                                        {voucher.maxDiscountAmount
                                            ? `$${voucher.maxDiscountAmount}`
                                            : "No limit"}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-3 border-t">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Usage</span>
                                    <span className="font-semibold">
                                        {voucher.usedCount} / {voucher.usageLimit}
                                    </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all"
                                        style={{
                                            width: `${(voucher.usedCount / voucher.usageLimit) * 100
                                                }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground pt-2">
                                <div>
                                    <p>Start: {voucher.startDate}</p>
                                </div>
                                <div className="text-right">
                                    <p>End: {voucher.endDate}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default VouchersPage;
