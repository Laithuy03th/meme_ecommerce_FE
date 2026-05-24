"use client";

import {
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useForm, useFieldArray } from "react-hook-form";
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
import { categoryApi } from "@/services/categoryApi";
import { Loader2, Plus, Trash2 } from "lucide-react";
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
    specifications: z.array(z.object({
        key: z.string().min(1, { message: "Key required" }),
        value: z.string().min(1, { message: "Value required" })
    })).optional(),
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
            brand: "",
            sku: "",
            weight: 0,
            isFeatured: false,
            videoUrl: "",
            status: "DRAFT",
            specifications: [],
        },
    });

    const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
        control: form.control,
        name: "specifications"
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
                specifications: values.specifications?.reduce((acc, curr) => {
                    if (curr.key && curr.value) acc[curr.key] = curr.value;
                    return acc;
                }, {} as Record<string, string>) || null,
            };

            await productApi.create(productData);
            alert("Product created successfully!");
            form.reset();
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
        <SheetContent className="overflow-y-auto sm:max-w-2xl">
            <ScrollArea className="h-full pr-4">
                <SheetHeader>
                    <SheetTitle className="mb-4">Add New Product</SheetTitle>
                    <SheetDescription asChild>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control as any}
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
                                    control={form.control as any}
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
                                    control={form.control as any}
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
                                    control={form.control as any}
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
                                    control={form.control as any}
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
                                        control={form.control as any}
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
                                        control={form.control as any}
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
                                        control={form.control as any}
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
                                        control={form.control as any}
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
                                        control={form.control as any}
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
                                        control={form.control as any}
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
                                    control={form.control as any}
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
                                    control={form.control as any}
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
                                    control={form.control as any}
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

                                {/* SPECIFICATIONS DYNAMIC FIELDS */}
                                <div className="space-y-4 pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium leading-none">Specifications</h4>
                                            <p className="text-sm text-muted-foreground mt-1">Add technical details for the product</p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => appendSpec({ key: "", value: "" })}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Spec
                                        </Button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {specFields.map((field, index) => (
                                            <div key={field.id} className="flex gap-3 items-start">
                                                <FormField
                                                    control={form.control as any}
                                                    name={`specifications.${index}.key` as any}
                                                    render={({ field: inputField }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Input placeholder="e.g. Screen Size" {...inputField} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control as any}
                                                    name={`specifications.${index}.value` as any}
                                                    render={({ field: inputField }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Input placeholder="e.g. 6.1 inch OLED" {...inputField} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 mt-1"
                                                    onClick={() => removeSpec(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <FormField
                                    control={form.control as any}
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
