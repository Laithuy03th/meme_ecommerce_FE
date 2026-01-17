"use client";

import { useState, useEffect } from "react";
import { voucherApi } from "@/services/voucherApi";
import { handleApiError } from "@/lib/error-handler";
import type { Voucher, CreateVoucherRequest } from "@/types/voucher";
import type { PageResponse } from "@/types/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Pencil, Trash2, Tag, Percent, DollarSign, Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function VouchersPage() {
    const [vouchers, setVouchers] = useState<PageResponse<Voucher> | null>(null);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState<CreateVoucherRequest>({
        code: "",
        discountType: "PERCENT",
        discountValue: 0,
        minOrderValue: 0,
        maxDiscountAmount: 0,
        startDate: new Date().toISOString().slice(0, 16),
        endDate: new Date().toISOString().slice(0, 16),
        usageLimit: 1,
        isActive: true,
    });

    useEffect(() => {
        loadVouchers();
    }, [page]);

    const loadVouchers = async () => {
        try {
            setLoading(true);
            const data = await voucherApi.list({ page, size: 20 });
            setVouchers(data);
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa voucher này?")) return;

        try {
            await voucherApi.delete(id);
            toast.success("Xóa voucher thành công");
            loadVouchers();
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleToggle = async (id: number, currentStatus: boolean) => {
        try {
            // Optimistic update
            if (vouchers) {
                const updatedContent = vouchers.content.map(v =>
                    v.id === id ? { ...v, isActive: !currentStatus } : v
                );
                setVouchers({ ...vouchers, content: updatedContent });
            }

            await voucherApi.toggle(id);
            toast.success("Cập nhật trạng thái thành công");
            // No need to reload if optimistic update was correct, but safely reload to sync
            loadVouchers();
        } catch (error) {
            handleApiError(error);
            loadVouchers(); // Revert on error
        }
    };

    const openCreateDialog = () => {
        setEditingVoucher(null);
        setFormData({
            code: "",
            discountType: "PERCENT",
            discountValue: 0,
            minOrderValue: 0,
            maxDiscountAmount: 0,
            startDate: new Date().toISOString().slice(0, 16),
            endDate: new Date().toISOString().slice(0, 16),
            usageLimit: 1,
            isActive: true
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (voucher: Voucher) => {
        setEditingVoucher(voucher);
        setFormData({
            code: voucher.code,
            discountType: voucher.discountType,
            discountValue: voucher.discountValue,
            minOrderValue: voucher.minOrderValue || 0,
            maxDiscountAmount: voucher.maxDiscountAmount || 0,
            startDate: voucher.startDate.slice(0, 16),
            endDate: voucher.endDate.slice(0, 16),
            usageLimit: voucher.usageLimit,
            isActive: voucher.isActive
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const errors: string[] = [];

        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);

            if (start >= end) {
                errors.push('Ngày bắt đầu phải trước ngày kết thúc');
            }
        }

        if (formData.discountType === 'PERCENT' && (formData.discountValue < 1 || formData.discountValue > 100)) {
            errors.push('Giảm % phải từ 1 đến 100');
        }

        if (errors.length > 0) {
            toast.error(errors.join('. '));
            return;
        }

        setIsSubmitting(true);

        try {
            const payload: CreateVoucherRequest = {
                code: formData.code,
                discountType: formData.discountType,
                discountValue: formData.discountValue,
                minOrderValue: formData.minOrderValue ?? 0,
                maxDiscountAmount: formData.discountType === 'PERCENT' ? formData.maxDiscountAmount : 0,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                usageLimit: formData.usageLimit,
                isActive: formData.isActive
            };

            if (editingVoucher) {
                await voucherApi.update(editingVoucher.id, payload);
                toast.success("Cập nhật voucher thành công");
            } else {
                await voucherApi.create(payload);
                toast.success("Tạo voucher thành công");
            }
            setIsDialogOpen(false);
            loadVouchers();
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (voucher: Voucher) => {
        const now = new Date();
        const start = new Date(voucher.startDate);
        const end = new Date(voucher.endDate);

        if (!voucher.isActive) {
            return <Badge variant="secondary">Inactive</Badge>;
        }
        if (now < start) {
            return <Badge className="bg-blue-500">Scheduled</Badge>;
        }
        if (now > end) {
            return <Badge variant="destructive">Expired</Badge>;
        }
        if (voucher.usedCount >= voucher.usageLimit) {
            return <Badge variant="outline" className="border-orange-500 text-orange-600">Limit Reached</Badge>;
        }
        return <Badge className="bg-green-500">Active</Badge>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Voucher Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Create and manage discount codes & promotions
                    </p>
                </div>
                <Button onClick={openCreateDialog} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Voucher
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Vouchers</CardTitle>
                        <Tag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vouchers?.totalElements || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">
                            {vouchers?.content.filter((v) => {
                                const now = new Date();
                                return v.isActive && new Date(v.startDate) <= now && new Date(v.endDate) >= now;
                            }).length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Currently running</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {vouchers?.content.reduce((sum, v) => sum + v.usedCount, 0) || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Times redeemed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Usage Rate</CardTitle>
                        <Percent className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                            {vouchers?.content.length
                                ? Math.round(
                                    (vouchers.content.reduce((sum, v) => sum + (v.usedCount / v.usageLimit) * 100, 0) /
                                        vouchers.content.length)
                                )
                                : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Redemption rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Vouchers Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead>Conditions</TableHead>
                                <TableHead>Usage</TableHead>
                                <TableHead>Valid Period</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Toggle Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vouchers?.content.map((voucher) => (
                                <TableRow key={voucher.id}>
                                    <TableCell className="font-mono font-bold">{voucher.code}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {voucher.discountType === 'PERCENT' ? (
                                                <Percent className="w-4 h-4 text-orange-500" />
                                            ) : (
                                                <DollarSign className="w-4 h-4 text-green-500" />
                                            )}
                                            <span className="font-semibold">
                                                {voucher.discountType === 'PERCENT'
                                                    ? `${voucher.discountValue}%`
                                                    : `${voucher.discountValue.toLocaleString()}đ`}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        <div className="space-y-1">
                                            {voucher.minOrderValue > 0 && (
                                                <div className="text-muted-foreground">
                                                    Min: {voucher.minOrderValue.toLocaleString()}đ
                                                </div>
                                            )}
                                            {voucher.maxDiscountAmount ? (
                                                <div className="text-muted-foreground">
                                                    Max: {voucher.maxDiscountAmount.toLocaleString()}đ
                                                </div>
                                            ) : null}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{voucher.usedCount}</span>
                                            <span className="text-muted-foreground">/</span>
                                            <span className="text-muted-foreground">{voucher.usageLimit}</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                                            <div
                                                className="bg-primary h-1.5 rounded-full transition-all"
                                                style={{ width: `${Math.min((voucher.usedCount / voucher.usageLimit) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            {format(new Date(voucher.startDate), 'dd/MM/yy HH:mm')}
                                        </div>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            {format(new Date(voucher.endDate), 'dd/MM/yy HH:mm')}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(voucher)}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={voucher.isActive}
                                            onCheckedChange={() => handleToggle(voucher.id, voucher.isActive)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(voucher)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(voucher.id)}
                                            >
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!vouchers?.content || vouchers.content.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center h-32 text-muted-foreground">
                                        No vouchers found. Create your first voucher!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {vouchers && vouchers.totalPages > 1 && (
                        <div className="flex items-center justify-between p-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Page {page + 1} of {vouchers.totalPages} ({vouchers.totalElements} total)
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
                                    disabled={page >= vouchers.totalPages - 1}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingVoucher ? "Edit Voucher" : "Create New Voucher"}</DialogTitle>
                        <DialogDescription>
                            {editingVoucher
                                ? "Update the voucher details below."
                                : "Fill in the details to create a new discount voucher."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Voucher Code *</Label>
                                    <Input
                                        id="code"
                                        placeholder="e.g., SALE50"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        required
                                        className="font-mono uppercase"
                                        disabled={!!editingVoucher} // Block editing code for consistency
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="discountType">Discount Type *</Label>
                                    <Select
                                        value={formData.discountType}
                                        onValueChange={(value: "PERCENT" | "FIXED") =>
                                            setFormData({
                                                ...formData,
                                                discountType: value,
                                                discountValue: 0 // Reset value on type change to avoid invalid 100+ percent
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PERCENT">Percentage (%)</SelectItem>
                                            <SelectItem value="FIXED">Fixed Amount (VNĐ)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="discountValue">
                                        Discount Value * {formData.discountType === "PERCENT" ? "(%)" : "(đ)"}
                                    </Label>
                                    <Input
                                        id="discountValue"
                                        type="number"
                                        min="0"
                                        max={formData.discountType === "PERCENT" ? 100 : undefined}
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="minOrderValue">Min Order (đ)</Label>
                                    <Input
                                        id="minOrderValue"
                                        type="number"
                                        min="0"
                                        value={formData.minOrderValue}
                                        onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                                    />
                                </div>
                                {formData.discountType === "PERCENT" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="maxDiscountAmount">Max Discount (đ)</Label>
                                        <Input
                                            id="maxDiscountAmount"
                                            type="number"
                                            min="0"
                                            value={formData.maxDiscountAmount}
                                            onChange={(e) =>
                                                setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })
                                            }
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="usageLimit">Usage Limit *</Label>
                                    <Input
                                        id="usageLimit"
                                        type="number"
                                        min="1"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date *</Label>
                                    <Input
                                        id="startDate"
                                        type="datetime-local"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date *</Label>
                                    <Input
                                        id="endDate"
                                        type="datetime-local"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Switch
                                    id="active-mode"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                                <Label htmlFor="active-mode">Active immediately</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingVoucher ? "Update Voucher" : "Create Voucher"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
