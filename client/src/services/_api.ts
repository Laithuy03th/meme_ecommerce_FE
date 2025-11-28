import { CartType, CategoryType, LoginResponse, PaginatedResponse, ProductType, RegisterResponse, SearchKeywordSuggestion } from "@/types";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const getCategories = async (): Promise<CategoryType[]> => {
    try {
        const res = await fetch(`${BASE_URL}/categories`, {
            cache: "no-store",
        });
        if (!res.ok) {
            throw new Error("Failed to fetch categories");
        }
        return res.json();
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
        return {
            ...data,
            price: data.basePrice || data.price, // Ensure price is available
            description: data.longDesc || data.shortDesc,
            images: data.images?.map((img: any) => img.imageUrl) || [],
            colors: Array.from(new Set(data.variants?.map((v: any) => v.color))).filter(Boolean),
            sizes: Array.from(new Set(data.variants?.map((v: any) => v.size))).filter(Boolean),
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

// Auth API
export const login = async (data: { email: string; password: string }): Promise<LoginResponse> => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
    }

    return res.json();
};

export const register = async (data: { email: string; password: string; fullName: string; phone?: string }): Promise<RegisterResponse> => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
    }

    return res.json();
};

export const refreshToken = async (refreshToken: string): Promise<LoginResponse> => {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
        throw new Error("Failed to refresh token");
    }

    return res.json();
};

export const logout = async (token: string): Promise<void> => {
    try {
        await fetch(`${BASE_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

// Cart API
// Helper to throw error with status
class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

// Helper for authenticated requests with interceptor
const authenticatedFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const { useAuthStore } = await import("@/stores/authStore");
    const store = useAuthStore.getState();
    let token = store.accessToken;

    const getHeaders = (t: string | null) => ({
        "Content-Type": "application/json",
        ...options.headers,
        ...(t ? { "Authorization": `Bearer ${t}` } : {}),
    });

    let res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: getHeaders(token),
    });

    if (res.status === 401) {
        const refreshTokenStr = store.refreshToken;
        if (!refreshTokenStr) {
            store.logout();
            throw new ApiError("Session expired", 401);
        }

        try {
            // Attempt to refresh token
            const refreshResponse = await refreshToken(refreshTokenStr);

            // Update store with new tokens
            store.login(refreshResponse.user, refreshResponse.accessToken, refreshResponse.refreshToken);

            // Retry original request with new token
            res = await fetch(`${BASE_URL}${endpoint}`, {
                ...options,
                headers: getHeaders(refreshResponse.accessToken),
            });
        } catch (error) {
            // Refresh failed
            store.logout();
            throw new ApiError("Session expired", 401);
        }
    }

    return res;
};

export const getCart = async (): Promise<CartType> => {
    try {
        const res = await authenticatedFetch("/users/me/cart", {
            cache: "no-store",
        });

        if (!res.ok) {
            if (res.status === 401) throw new ApiError("Unauthorized", 401);
            throw new ApiError("Failed to fetch cart", res.status);
        }
        return res.json();
    } catch (error) {
        console.error("Get Cart Error:", error);
        throw error;
    }
};

export const addToCart = async (data: { productId: number; variantId?: number | null; quantity: number }): Promise<CartType> => {
    // Ensure variantId is null if undefined/missing
    const payload = {
        ...data,
        variantId: data.variantId ?? null
    };

    console.log("Adding to cart payload:", payload);

    try {
        const res = await authenticatedFetch("/users/me/cart/items", {
            method: "POST",
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error("Add to cart failed response:", res.status, errorData);

            if (res.status === 401) throw new ApiError("Session expired", 401);
            throw new ApiError(errorData.message || "Failed to add to cart", res.status);
        }
        return res.json();
    } catch (error) {
        console.error("Add to Cart Network Error:", error);
        throw error;
    }
};

export const updateCartItem = async (itemId: number, quantity: number): Promise<CartType> => {
    try {
        const res = await authenticatedFetch(`/users/me/cart/items/${itemId}`, {
            method: "PUT",
            body: JSON.stringify({ quantity }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            if (res.status === 401) throw new ApiError("Session expired", 401);
            throw new ApiError(errorData.message || "Failed to update cart item", res.status);
        }
        return res.json();
    } catch (error) {
        console.error("Update Cart Item Error:", error);
        throw error;
    }
};

export const removeCartItem = async (itemId: number): Promise<CartType> => {
    try {
        const res = await authenticatedFetch(`/users/me/cart/items/${itemId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            if (res.status === 401) throw new ApiError("Session expired", 401);
            throw new ApiError(errorData.message || "Failed to remove cart item", res.status);
        }
        return res.json();
    } catch (error) {
        console.error("Remove Cart Item Error:", error);
        throw error;
    }
};
