
import { CategoryType, PaginatedResponse, ProductType } from "@/types";
import { BASE_URL } from "./base";

/**
 * Get all categories
 */
export const getCategories = async (): Promise<CategoryType[]> => {
    try {
        const res = await fetch(`${BASE_URL}/categories`, {
            cache: "no-store",
        });
        if (!res.ok) {
            throw new Error("Failed to fetch categories");
        }
        const data: CategoryType[] = await res.json();
        // Filter out category with id 5 as requested
        return data.filter(cat => cat.id !== 5);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

/**
 * Get products with filters and pagination
 */
/**
 * Get products with filters and pagination
 */
export const getProducts = async (
    page: number = 0,
    size: number = 20,
    sortBy: string = "newest",
    filters?: {
        minPrice?: number;
        maxPrice?: number;
        categorySlug?: string;
        keyword?: string; // Add keyword support
    }
): Promise<PaginatedResponse<ProductType>> => {
    try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("size", size.toString());
        params.append("sortBy", sortBy);

        if (filters?.minPrice !== undefined) params.append("minPrice", filters.minPrice.toString());
        if (filters?.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice.toString());
        // API expects 'category' not 'categorySlug'
        if (filters?.categorySlug) params.append("category", filters.categorySlug);
        if (filters?.keyword) params.append("keyword", filters.keyword);

        const res = await fetch(`${BASE_URL}/products?${params.toString()}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch products");
        }
        const data = await res.json();

        // Map content items to ensure consistent fields
        const mappedContent = data.content.map((item: any) => ({
            ...item,
            // UI Helpers
            price: item.price || item.basePrice,
            rating: item.averageRating || 0,
            reviews: item.reviewCount || 0,
            image: item.thumbnailUrl,
            images: item.images || [],
            // Ensure array fields exist
            colors: [], // List view doesn't return variants in this API
            sizes: [],
            isNew: (new Date().getTime() - new Date(item.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000, // < 7 days
            stockStatus: item.stockStatus
        }));

        return {
            ...data,
            content: mappedContent
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            content: [],
            number: 0,
            size: size,
            totalElements: 0,
            totalPages: 0,
        };
    }
};

/**
 * Get single product by ID
 * 
 * Note: For SEO-friendly URLs, consider using getProductBySlug() instead
 */
export const getProduct = async (id: string | number): Promise<ProductType | null> => {
    try {
        const res = await fetch(`${BASE_URL}/products/${id}`, {
            cache: "no-store",
        });
        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error("Failed to fetch product");
        }
        const data = await res.json();

        // 1. Process Images
        // API returns images: { id, imageUrl, thumbnail, sortOrder }[]
        const images = data.images?.sort((a: any, b: any) => a.sortOrder - b.sortOrder).map((img: any) => img.imageUrl) || [];
        // Add thumbnail if not present
        if (data.thumbnailUrl && !images.includes(data.thumbnailUrl)) {
            images.unshift(data.thumbnailUrl);
        }

        // 2. Process Variants for Colors/Sizes
        const colors = Array.from(new Set(data.variants?.map((v: any) => v.color))).filter(Boolean) as string[];
        const sizes = Array.from(new Set(data.variants?.map((v: any) => v.size))).filter(Boolean) as string[];

        // 3. Variant Images Map (if applicable, though API doesn't strictly link variant to image yet, 
        // we can try to guess or leave empty)
        const variantImages: Record<string, string> = {};

        return {
            ...data,
            // Mapping for UI components
            price: data.basePrice || data.price, // Detail view usually has basePrice
            rating: data.averageRating || 0,
            reviews: data.reviewCount || 0,
            description: data.longDesc || data.shortDesc,
            images: images,
            image: data.thumbnailUrl || images[0],
            colors: colors,
            sizes: sizes,
            variantImages: variantImages,
            isNew: (new Date().getTime() - new Date(data.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000,
        };
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
};

/**
 * Get single product by slug (SEO-friendly)
 * 
 * Recommended over getProduct() for better SEO.
 * Use slugs like "summer-dress-fashion-1" instead of numeric IDs.
 */
export const getProductBySlug = async (slug: string): Promise<ProductType | null> => {
    try {
        const res = await fetch(`${BASE_URL}/products/slug/${slug}`, {
            cache: "no-store",
        });
        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error("Failed to fetch product");
        }
        const data = await res.json();


        // Map API response to UI friendly format
        const images = data.images?.map((img: any) => img.imageUrl) || [];
        if (data.thumbnailUrl && !images.includes(data.thumbnailUrl)) {
            images.unshift(data.thumbnailUrl);
        }

        const mappedProduct = {
            ...data,
            price: data.basePrice || data.price,
            rating: data.averageRating || data.rating || 0,
            reviews: data.reviewCount ?? 0, // Use nullish coalescing to handle 0 correctly
            description: data.longDesc || data.shortDesc,
            images: images,
            image: data.thumbnailUrl || images[0],
            colors: Array.from(new Set(data.variants?.map((v: any) => v.color))).filter(Boolean),
            sizes: Array.from(new Set(data.variants?.map((v: any) => v.size))).filter(Boolean),
            variantImages: {},
        };

        console.log(`[API] Mapped Product - reviews:`, mappedProduct.reviews, 'rating:', mappedProduct.rating);
        return mappedProduct;
    } catch (error) {
        console.error(`Error fetching product by slug ${slug}:`, error);
        return null;
    }
};

/**
 * Get related products
 */
export const getRelatedProducts = async (id: string | number): Promise<ProductType[]> => {
    try {
        const res = await fetch(`${BASE_URL}/products/${id}/related?page=0&size=4`, {
            cache: "no-store",
        });
        if (!res.ok) {
            return [];
        }
        const data = await res.json();
        return data.content || [];
    } catch (error) {
        console.error(`Error fetching related products for ${id}:`, error);
        return [];
    }
};
