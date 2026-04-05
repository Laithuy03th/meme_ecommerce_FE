/**
 * Search API Module
 * 
 * Handles all search-related API calls:
 * - Popular search keywords (when user clicks search box)
 * - Autocomplete suggestions (when user types)
 * - Full product search with filters
 * 
 * Follows API spec from FRONTEND_API_INTEGRATION_GUIDE.md
 */

import { ProductType, PaginatedResponse, SearchKeywordSuggestion } from "@/types";
import { BASE_URL } from "./base";

/**
 * 1. GET Popular Search Keywords
 * 
 * Endpoint: GET /api/v1/products/search-keywords
 * Auth: Public
 * 
 * Returns popular search keywords grouped by category.
 * Call this when user clicks into the search input box.
 * 
 * @returns Array of search keyword suggestions
 */
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

/**
 * 2. GET Search Suggestions (Autocomplete)
 * 
 * Endpoint: GET /api/v1/products/suggestions
 * Auth: Public
 * 
 * Returns product suggestions for autocomplete dropdown.
 * Call this when user is typing (with debounce).
 * 
 * @param keyword - Search term (minimum 2 chars recommended)
 * @param category - Optional category slug to filter
 * @param limit - Max number of results (default: 5)
 * @returns Array of matching products
 */
export const getSearchSuggestions = async (
    keyword: string,
    category?: string,
    limit: number = 5
): Promise<ProductType[]> => {
    try {
        if (keyword.length < 2) {
            return [];
        }

        const params = new URLSearchParams();
        params.append("keyword", keyword);
        // API expects 'category' not 'categorySlug'
        if (category) {
            params.append("category", category);
        }
        params.append("limit", limit.toString());

        const res = await fetch(`${BASE_URL}/products/suggestions?${params.toString()}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            console.error("Failed to fetch suggestions:", res.status);
            return [];
        }

        return res.json();
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return [];
    }
};

/**
 * 3. GET Products with Search & Filters (Main Search)
 * 
 * Endpoint: GET /api/v1/products
 * Auth: Public
 * 
 * Full product search with filters and pagination.
 * Use this for the main search results page.
 * 
 * @param params - Search and filter parameters
 * @returns Paginated response with products
 */
export interface SearchProductsParams {
    /** Search keyword (searches in name, description) */
    keyword?: string;
    /** Category slug (e.g., "fashion", "electronics") */
    category?: string;
    /** Minimum price filter */
    minPrice?: number;
    /** Maximum price filter */
    maxPrice?: number;
    /** Brand filter */
    brand?: string;
    /** Minimum rating filter */
    minRating?: number;
    /** Sort option: "newest" | "priceAsc" | "priceDesc" | "nameAsc" | "nameDesc" */
    sortBy?: "newest" | "priceAsc" | "priceDesc" | "nameAsc" | "nameDesc";
    /** Page number (0-indexed) */
    page?: number;
    /** Items per page */
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
            size = 20
        } = params;

        const urlParams = new URLSearchParams();
        urlParams.append("page", page.toString());
        urlParams.append("size", size.toString());
        urlParams.append("sortBy", sortBy);

        if (keyword) {
            urlParams.append("keyword", keyword);
        }
        if (category) {
            urlParams.append("category", category);
        }
        if (minPrice !== undefined) {
            urlParams.append("minPrice", minPrice.toString());
        }
        if (maxPrice !== undefined) {
            urlParams.append("maxPrice", maxPrice.toString());
        }
        if (brand) {
            urlParams.append("brand", brand);
        }
        if (minRating !== undefined) {
            urlParams.append("minRating", minRating.toString());
        }

        const res = await fetch(`${BASE_URL}/products?${urlParams.toString()}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            console.error("Failed to search products:", res.status);
            return {
                content: [],
                number: 0,
                size: size,
                totalElements: 0,
                totalPages: 0,
                first: true,
                last: true,
                empty: true,
            };
        }

        return res.json();
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
