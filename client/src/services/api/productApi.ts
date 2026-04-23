import { CategoryType, PaginatedResponse, ProductType } from "@/types";
import { BASE_URL } from "./base";

const mapListProduct = (item: any): ProductType => ({
    ...item,
    price: item.price ?? item.basePrice ?? 0,
    basePrice: item.basePrice ?? item.price ?? 0,
    rating: item.averageRating ?? item.rating ?? 0,
    reviews: item.reviewCount ?? item.reviews ?? 0,
    image: item.thumbnailUrl,
    images: item.images || [],
    colors: item.colors || [],
    sizes: item.sizes || [],
    isNew: item.createdAt
        ? new Date().getTime() - new Date(item.createdAt).getTime() <
        7 * 24 * 60 * 60 * 1000
        : false,
    stockStatus: item.stockStatus,
});

const mapDetailProduct = (data: any): ProductType => {
    const images =
        data.images
            ?.sort((a: any, b: any) => a.sortOrder - b.sortOrder)
            .map((img: any) => img.imageUrl) || [];

    if (data.thumbnailUrl && !images.includes(data.thumbnailUrl)) {
        images.unshift(data.thumbnailUrl);
    }

    const colors = Array.from(
        new Set(data.variants?.map((v: any) => v.color).filter(Boolean))
    ) as string[];

    const sizes = Array.from(
        new Set(data.variants?.map((v: any) => v.size).filter(Boolean))
    ) as string[];

    return {
        ...data,
        price: data.basePrice ?? data.price ?? 0,
        basePrice: data.basePrice ?? data.price ?? 0,
        rating: data.averageRating ?? 0,
        reviews: data.reviewCount ?? 0,
        description: data.longDesc || data.shortDesc,
        images,
        image: data.thumbnailUrl || images[0],
        colors,
        sizes,
        variantImages: {},
        isNew: data.createdAt
            ? new Date().getTime() - new Date(data.createdAt).getTime() <
            7 * 24 * 60 * 60 * 1000
            : false,
    };
};

export const getCategories = async (): Promise<CategoryType[]> => {
    try {
        const res = await fetch(`${BASE_URL}/categories`, {
            cache: "no-store",
        });
        if (!res.ok) {
            throw new Error("Failed to fetch categories");
        }
        const data: CategoryType[] = await res.json();
        return data.filter((cat) => cat.id !== 5);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export const getProducts = async (
    page: number = 0,
    size: number = 20,
    sortBy: string = "newest",
    filters?: {
        minPrice?: number;
        maxPrice?: number;
        categorySlug?: string;
        keyword?: string;
        brand?: string;
        minRating?: number;
    }
): Promise<PaginatedResponse<ProductType>> => {
    try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("size", size.toString());
        params.append("sortBy", sortBy);

        if (filters?.minPrice !== undefined) params.append("minPrice", String(filters.minPrice));
        if (filters?.maxPrice !== undefined) params.append("maxPrice", String(filters.maxPrice));
        if (filters?.categorySlug) params.append("category", filters.categorySlug);
        if (filters?.keyword) params.append("keyword", filters.keyword);
        if (filters?.brand) params.append("brand", filters.brand);
        if (filters?.minRating !== undefined) params.append("minRating", String(filters.minRating));

        const res = await fetch(`${BASE_URL}/products?${params.toString()}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        return {
            ...data,
            content: Array.isArray(data.content) ? data.content.map(mapListProduct) : [],
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            content: [],
            number: 0,
            size,
            totalElements: 0,
            totalPages: 0,
        };
    }
};

export const getProduct = async (
    id: string | number
): Promise<ProductType | null> => {
    try {
        const res = await fetch(`${BASE_URL}/products/${id}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error("Failed to fetch product");
        }

        const data = await res.json();
        return mapDetailProduct(data);
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
};

export const getProductBySlug = async (
    slug: string
): Promise<ProductType | null> => {
    try {
        const res = await fetch(`${BASE_URL}/products/slug/${slug}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error("Failed to fetch product by slug");
        }

        const data = await res.json();
        return mapDetailProduct(data);
    } catch (error) {
        console.error(`Error fetching product by slug ${slug}:`, error);
        return null;
    }
};

export const getRelatedProducts = async (
    id: string | number
): Promise<ProductType[]> => {
    try {
        const res = await fetch(`${BASE_URL}/products/${id}/related?page=0&size=4`, {
            cache: "no-store",
        });

        if (!res.ok) {
            return [];
        }

        const data = await res.json();
        return Array.isArray(data.content) ? data.content.map(mapListProduct) : [];
    } catch (error) {
        console.error(`Error fetching related products for ${id}:`, error);
        return [];
    }
};