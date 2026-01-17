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
import { createProductAction } from "@/actions/productActions";
import { handleApiError } from "@/lib/error-handler";
import { useState, useEffect } from "react";
import type { Category } from "@/types/category";
import { categoryApi } from "@/services/categoryApi";
import { Loader2 } from "lucide-react";

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
    status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]),
});

interface AddProductProps {
    onSuccess?: () => void;
}

const AddProduct = ({ onSuccess }: AddProductProps) => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
            shortDesc: "",
            longDesc: "",
            basePrice: 0,
            stockQuantity: 0,
            thumbnailUrl: "",
            imageUrls: "",
            status: "DRAFT",
        },
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);
            const data = await categoryApi.list();
            setCategories(data.filter(c => c.status === "ACTIVE"));
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
                status: values.status,
            };

            const result = await createProductAction(productData);

            if (result.success) {
                alert("Product created successfully!");
                form.reset();
                onSuccess?.();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    if (loadingCategories) {
        return (
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="sr-only">Loading</SheetTitle>
                    <SheetDescription className="sr-only">
                        Loading categories...
                    </SheetDescription>
                </SheetHeader>
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </SheetContent>
        );
    }

    return (
        <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
            <ScrollArea className="h-full pr-4">
                <SheetHeader>
                    <SheetTitle className="mb-4">Add New Product</SheetTitle>
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
                                                <Input {...field} placeholder="Enter product name" />
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
                                                <Input {...field} placeholder="auto-generated-slug" />
                                            </FormControl>
                                            <FormDescription>
                                                URL-friendly identifier. Leave empty to auto-generate.
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
                                                <Input {...field} maxLength={200} placeholder="Brief summary" />
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
                                                <Textarea {...field} rows={4} placeholder="Detailed product description" />
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
                                                value={field.value ? field.value.toString() : undefined}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
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

                                <FormField
                                    control={form.control}
                                    name="thumbnailUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Thumbnail Image *</FormLabel>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                try {
                                                                    // Using fileApi defined in services
                                                                    const { fileApi } = await import("@/services/fileApi");
                                                                    const res = await fileApi.uploadImage(file);
                                                                    field.onChange(res.fileUrl);
                                                                } catch (error) {
                                                                    console.error("Upload failed", error);
                                                                    alert("Upload failed");
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    {field.value && (
                                                        <div className="relative w-32 h-32 mt-2 border rounded-md overflow-hidden">
                                                            <img
                                                                src={field.value}
                                                                alt="Thumbnail preview"
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </div>
                                                    )}
                                                    {/* Hidden input to store the URL if needed explicitly, but field.value tracks it */}
                                                    <Input {...field} className="hidden" />
                                                </div>
                                            </FormControl>
                                            <FormDescription>Upload main product image</FormDescription>
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
                                                <Textarea
                                                    {...field}
                                                    rows={3}
                                                    placeholder="https://image1.jpg, https://image2.jpg"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Comma-separated URLs for additional images
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
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Product"
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

export default AddProduct;
