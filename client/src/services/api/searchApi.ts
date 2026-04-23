import { ProductType, PaginatedResponse, SearchKeywordSuggestion } from "@/types";
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

export const getPopularSearchKeywords = async (): Promise<SearchKeywordSuggestion[]> => {
    try {
        const res = await fetch(`${BASE_URL}/products/search-keywords`, {
            cache: "no-store",
        });

        if (!res.ok) {
            console.error("Failed to fetch search keywords:", res.status);
            return [];
        }

        return res.json();
    } catch (error) {
        console.error("Error fetching search keywords:", error);
        return [];
    }
};

export const getSearchSuggestions = async (
    keyword: string,
    category?: string,
    limit: number = 5
): Promise<ProductType[]> => {
    try {
        if (keyword.length < 2) return [];

        const params = new URLSearchParams();
        params.append("keyword", keyword);
        if (category) params.append("category", category);
        params.append("limit", String(limit));

        const res = await fetch(`${BASE_URL}/products/suggestions?${params.toString()}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            console.error("Failed to fetch suggestions:", res.status);
            return [];
        }

        const data = await res.json();
        return Array.isArray(data) ? data.map(mapListProduct) : [];
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return [];
    }
};

export interface SearchProductsParams {
    keyword?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    minRating?: number;
    sortBy?: "newest" | "priceAsc" | "priceDesc" | "topRated" | "bestSelling";
    page?: number;
    size?: number;
}

export const searchProducts = async (
    params: SearchProductsParams = {}
): Promise<PaginatedResponse<ProductType>> => {
    try {
        const {
            keyword,
            category,
            minPrice,
            maxPrice,
            brand,
            minRating,
            sortBy = "newest",
            page = 0,
            size = 20,
        } = params;

        const urlParams = new URLSearchParams();
        urlParams.append("page", String(page));
        urlParams.append("size", String(size));
        urlParams.append("sortBy", sortBy);

        if (keyword) urlParams.append("keyword", keyword);
        if (category) urlParams.append("category", category);
        if (minPrice !== undefined) urlParams.append("minPrice", String(minPrice));
        if (maxPrice !== undefined) urlParams.append("maxPrice", String(maxPrice));
        if (brand) urlParams.append("brand", brand);
        if (minRating !== undefined) urlParams.append("minRating", String(minRating));

        const res = await fetch(`${BASE_URL}/products?${urlParams.toString()}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            console.error("Failed to search products:", res.status);
            return {
                content: [],
                number: 0,
                size,
                totalElements: 0,
                totalPages: 0,
                first: true,
                last: true,
                empty: true,
            };
        }

        const data = await res.json();

        return {
            ...data,
            content: Array.isArray(data.content) ? data.content.map(mapListProduct) : [],
        };
    } catch (error) {
        console.error("Error searching products:", error);
        return {
            content: [],
            number: 0,
            size: params.size || 20,
            totalElements: 0,
            totalPages: 0,
            first: true,
            last: true,
            empty: true,
        };
    }
};