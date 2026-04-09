import { BaseEntity } from "./common";

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT';

export interface Product extends BaseEntity {
    brand?: string;
    sku?: string;
    weight?: number;
    isFeatured?: boolean;
    videoUrl?: string;
    averageRating?: number;
    reviewCount?: number;
    soldCount?: number;
    viewCount?: number;
    name: string;
    slug: string;
    shortDesc: string;
    longDesc: string;
    categoryId: number;
    categoryName: string;
    categorySlug: string;
    basePrice: number;
    stockQuantity: number;
    thumbnailUrl: string;
    imageUrls: string[];
    status: ProductStatus;
}

export interface CreateProductRequest {
    brand?: string;
    sku?: string;
    weight?: number;
    isFeatured?: boolean;
    videoUrl?: string;
    name: string;
    slug?: string;
    shortDesc: string;
    longDesc: string;
    categoryId: number;
    basePrice: number;
    stockQuantity: number;
    thumbnailUrl: string;
    imageUrls: string[];
    status?: ProductStatus;
}

export interface ProductVariant extends BaseEntity {
    sku: string;
    color?: string;
    size?: string;
    price?: number;
    stock: number;
    status: string;
}

export interface CreateVariantRequest {
    sku?: string;
    color?: string;
    size?: string;
    price: number;
    stock: number;
    status?: string;
}
