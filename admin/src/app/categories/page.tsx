"use client";

import { useState, useEffect } from "react";
import { categoryApi } from "@/services/categoryApi";
import { handleApiError } from "@/lib/error-handler";
import type { Category } from "@/types/category";
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
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Loader2, Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import AddCategory from "@/components/AddCategory";
import EditCategory from "@/components/EditCategory";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryApi.list();
            setCategories(data);
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;

        try {
            await categoryApi.delete(id);
            alert("Xóa thành công");
            loadCategories();
        } catch (error) {
            handleApiError(error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    const activeCategories = categories.filter((c) => c.status === "ACTIVE");
    const inactiveCategories = categories.filter((c) => c.status === "INACTIVE");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage product categories and hierarchies
                    </p>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Category
                        </Button>
                    </SheetTrigger>
                    <AddCategory onSuccess={loadCategories} />
                </Sheet>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                        <FolderTree className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{categories.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <FolderTree className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeCategories.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                        <FolderTree className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inactiveCategories.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Categories Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Parent</TableHead>
                                <TableHead>Sort Order</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {category.slug}
                                    </TableCell>
                                    <TableCell>
                                        {category.parentName ? (
                                            <span className="text-sm">{category.parentName}</span>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">Root</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{category.sortOrder}</TableCell>
                                    <TableCell>
                                        <Badge variant={category.status === "ACTIVE" ? "default" : "secondary"}>
                                            {category.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setEditingCategory(category)}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </SheetTrigger>
                                                {editingCategory?.id === category.id && (
                                                    <EditCategory
                                                        category={editingCategory}
                                                        onSuccess={() => {
                                                            loadCategories();
                                                            setEditingCategory(null);
                                                        }}
                                                    />
                                                )}
                                            </Sheet>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(category.id)}
                                            >
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
