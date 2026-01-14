// Pagination Response
export interface PageResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        offset: number;
    };
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

// Error Response
export interface ApiError {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
}

// Base Entity
export interface BaseEntity {
    id: number;
    createdAt: string;
    updatedAt?: string;
}
