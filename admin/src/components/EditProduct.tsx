"use client";

import {
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { productApi } from "@/services/productApi";
import { handleApiError } from "@/lib/error-handler";
import { useState, useEffect } from "react";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { categoryApi } from "@/services/categoryApi";
import { Loader2 } from "lucide-react";
import ImageUploader from "./ImageUploader";
import MultiImageUploader from "./MultiImageUploader";

const formSchema = z.object({
    name: z.string().min(1, { message: "Product name is required!" }),
    slug: z.string().optional(),
    shortDesc: z.string().min(1, { message: "Short description is required!" }).max(200),
    longDesc: z.string().min(1, { message: "Description is required!" }),
    categoryId: z.number({ required_error: "Category is required!" }),
    basePrice: z.number().min(0, { message: "Price must be positive!" }),
    stockQuantity: z.number().min(0, { message: "Stock must be positive!" }),
    thumbnailUrl: z.string().url({ message: "Must be a valid URL!" }),
    imageUrls: z.string().optional(),
    brand: z.string().optional(),
    sku: z.string().optional(),
    weight: z.number().min(0).optional(),
    isFeatured: z.boolean().optional(),
    videoUrl: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]),
});

interface EditProductProps {
    product: Product;
    onSuccess?: () => void;
}

const EditProduct = ({ product, onSuccess }: EditProductProps) => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: product.name,
            slug: product.slug,
            shortDesc: product.shortDesc,
            longDesc: product.longDesc,
            categoryId: product.categoryId,
            basePrice: product.basePrice,
            stockQuantity: product.stockQuantity,
            thumbnailUrl: product.thumbnailUrl,
            imageUrls: product.imageUrls.join(', '),
            brand: product.brand || "",
            sku: product.sku || "",
            weight: product.weight || 0,
            isFeatured: product.isFeatured || false,
            videoUrl: product.videoUrl || "",
            status: product.status,
        },
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);
            const data = await categoryApi.list();
            // Next.js fallback check in case BE returns Page object { content: [...] } instead of direct array
            const categoryList = Array.isArray(data) ? data : (data as any)?.content || [];
            if (Array.isArray(categoryList)) {
                setCategories(categoryList);
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            // Parse imageUrls from comma-separated string to array
            const imageUrlsArray = values.imageUrls
                ? values.imageUrls.split(',').map(url => url.trim()).filter(url => url)
                : [];

            const productData = {
                name: values.name,
                slug: values.slug,
                shortDesc: values.shortDesc,
                longDesc: values.longDesc,
                categoryId: values.categoryId,
                basePrice: values.basePrice,
                stockQuantity: values.stockQuantity,
                thumbnailUrl: values.thumbnailUrl,
                imageUrls: imageUrlsArray,
                brand: values.brand,
                sku: values.sku,
                weight: values.weight,
                isFeatured: values.isFeatured,
                videoUrl: values.videoUrl,
                status: values.status,
            };

            await productApi.update(product.id, productData);
            alert("Product updated successfully!");
            onSuccess?.();
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    if (loadingCategories) {
        return (
            <SheetContent className="sm:max-w-2xl">
                <SheetHeader>
                    <SheetTitle className="sr-only">Loading</SheetTitle>
                    <SheetDescription className="sr-only">
                        Loading product data...
                    </SheetDescription>
                </SheetHeader>
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </SheetContent>
        );
    }

    return (
        <SheetContent className="overflow-y-auto sm:max-w-2xl">
            <ScrollArea className="h-full pr-4">
                <SheetHeader>
                    <SheetTitle className="mb-4">Edit Product</SheetTitle>
                    <SheetDescription asChild>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name *</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                URL-friendly identifier
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="shortDesc"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Short Description *</FormLabel>
                                            <FormControl>
                                                <Input {...field} maxLength={200} />
                                            </FormControl>
                                            <FormDescription>Max 200 characters</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="longDesc"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Description *</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} rows={4} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category *</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(parseInt(value))}
                                                value={field.value?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="basePrice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Base Price *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="stockQuantity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Stock Quantity *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="brand"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Brand</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="e.g. Apple, Samsung" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="sku"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>SKU</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Product SKU" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="weight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Weight (kg)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="isFeatured"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-8">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Featured</FormLabel>
                                                    <FormDescription>Show on homepage</FormDescription>
                                                </div>
                                                <FormControl>
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.value}
                                                            onChange={(e) => field.onChange(e.target.checked)}
                                                            className="w-5 h-5 accent-primary"
                                                        />
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="videoUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Video URL</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="YouTube or video link" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="thumbnailUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Thumbnail Image *</FormLabel>
                                            <FormControl>
                                                <ImageUploader
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onRemove={() => field.onChange("")}
                                                />
                                            </FormControl>
                                            <FormDescription>Upload or paste main product image URL</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="imageUrls"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Additional Images</FormLabel>
                                            <FormControl>
                                                <MultiImageUploader
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Upload or add URLs for additional images
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Product"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </SheetDescription>
                </SheetHeader>
            </ScrollArea>
        </SheetContent>
    );
};

export default EditProduct;
