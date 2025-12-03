import { CategoryType, PaginatedResponse, ProductType, SearchKeywordSuggestion } from "@/types";
import { BASE_URL } from "./base";

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

export const getProducts = async (
    page: number = 0,
    size: number = 20,
    sortBy: string = "newest",
    filters?: {
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        categorySlug?: string;
    }
): Promise<PaginatedResponse<ProductType>> => {
    try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("size", size.toString());
        params.append("sortBy", sortBy);

        if (filters?.search) params.append("search", filters.search);
        if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString());
        if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
        if (filters?.categorySlug) params.append("category", filters.categorySlug);

        const res = await fetch(`${BASE_URL}/products?${params.toString()}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch products");
        }
        return res.json();
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

        // Map API response to UI friendly format if needed
        // Map API response to UI friendly format
        const images = data.images?.map((img: any) => img.imageUrl) || [];
        if (data.thumbnailUrl && !images.includes(data.thumbnailUrl)) {
            images.unshift(data.thumbnailUrl);
        }

        return {
            ...data,
            price: data.basePrice || data.price, // Ensure price is available
            description: data.longDesc || data.shortDesc,
            images: images,
            image: data.thumbnailUrl || images[0], // Main image for display
            colors: Array.from(new Set(data.variants?.map((v: any) => v.color))).filter(Boolean),
            sizes: Array.from(new Set(data.variants?.map((v: any) => v.size))).filter(Boolean),
            // Create a map of color -> image if your backend supports it, or just use main images
            variantImages: {},
        };
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
};

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

export const getProductSuggestions = async (keyword: string, category?: string, limit: number = 5): Promise<ProductType[]> => {
    try {
        const params = new URLSearchParams();
        params.append("keyword", keyword);
        if (category) params.append("category", category);
        params.append("limit", limit.toString());

        const res = await fetch(`${BASE_URL}/products/suggestions?${params.toString()}`, {
            cache: "no-store",
        });
        if (!res.ok) {
            return [];
        }
        return res.json();
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return [];
    }
};

export const getPopularSearchKeywords = async (): Promise<SearchKeywordSuggestion[]> => {
    try {
        const res = await fetch(`${BASE_URL}/products/search-keywords`, {
            cache: "no-store",
        });
        if (!res.ok) {
            return [];
        }
        return res.json();
    } catch (error) {
        console.error("Error fetching search keywords:", error);
        return [];
    }
};
