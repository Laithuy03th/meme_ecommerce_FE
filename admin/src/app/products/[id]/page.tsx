"use client";

import { useState, useEffect, use } from "react";
import { productApi } from "@/services/productApi";
import { handleApiError } from "@/lib/error-handler";
import type { Product } from "@/types/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Package, ArrowLeft, Info, Tags, Box, ExternalLink, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await productApi.getById(parseInt(id));
            setProduct(data);
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-xl font-semibold">Product not found</p>
                <Link href="/products">
                    <Button>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/products">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            {product.name}
                            <a href={`http://localhost:3000/products/${product.id}`} target="_blank" rel="noopener noreferrer" title="View on Storefront">
                                <ExternalLink className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800" />
                            </a>
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm flex items-center gap-2">
                            ID: {product.id} • SKU: {product.sku || "N/A"}
                        </p>
                    </div>
                </div>
                <Badge className={`text-lg px-4 py-2 ${
                    product.status === 'ACTIVE' ? 'bg-emerald-600' :
                    product.status === 'DRAFT' ? 'bg-amber-500' : 'bg-gray-500'
                }`}>
                    {product.status}
                </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="w-5 h-5" />
                            Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Category</p>
                                <p className="font-medium">{product.categoryName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Brand</p>
                                <p className="font-medium">{product.brand || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Base Price</p>
                                <p className="font-semibold text-lg text-primary">{product.basePrice.toLocaleString()}đ</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Stock Quantity</p>
                                <p className={`font-medium ${product.stockQuantity < 10 ? "text-red-500 font-bold" : ""}`}>
                                    {product.stockQuantity}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Weight (kg)</p>
                                <p className="font-medium">{product.weight || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Featured</p>
                                <Badge variant={product.isFeatured ? "default" : "outline"}>
                                    {product.isFeatured ? "Yes" : "No"}
                                </Badge>
                            </div>
                        </div>
                        
                        <div className="pt-4 border-t">
                            <p className="text-sm text-muted-foreground mb-1">Short Description</p>
                            <p className="text-sm">{product.shortDesc}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Media */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5" />
                            Media Gallery
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">Thumbnail</p>
                        <div className="relative w-32 h-32 rounded-lg border overflow-hidden bg-gray-50 mb-6">
                            {product.thumbnailUrl ? (
                                <Image src={product.thumbnailUrl} alt="Thumbnail" fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <Package className="w-8 h-8 text-gray-300" />
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">Additional Images</p>
                        <div className="flex flex-wrap gap-3">
                            {product.imageUrls && product.imageUrls.length > 0 ? (
                                product.imageUrls.map((url, idx) => (
                                    <div key={idx} className="relative w-20 h-20 rounded-md border overflow-hidden bg-gray-50">
                                        <Image src={url} alt={`Image ${idx}`} fill className="object-cover" />
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No additional images.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Specifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Tags className="w-5 h-5" />
                            Specifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {product.specifications && Object.keys(product.specifications).length > 0 ? (
                            <div className="rounded-md border">
                                <table className="w-full text-sm">
                                    <tbody>
                                        {Object.entries(product.specifications).map(([key, value], idx) => (
                                            <tr key={key} className={idx % 2 === 0 ? "bg-muted/50" : "bg-background"}>
                                                <td className="px-4 py-3 font-medium border-r w-1/3">{key}</td>
                                                <td className="px-4 py-3">{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">No specifications provided.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-dashed border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-muted-foreground">
                            <Box className="w-5 h-5" />
                            Variants (Coming Soon)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                            <Package className="w-12 h-12 text-muted-foreground opacity-50" />
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Variant management (color, size, unique pricing/stock) will be available in a future update.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Long Description */}
            <Card>
                <CardHeader>
                    <CardTitle>Full Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                        {product.longDesc}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
