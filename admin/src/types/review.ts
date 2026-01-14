
export interface Review {
    id: number;
    userFullName: string;
    productId: number;
    productName: string;
    productImage: string;
    rating: number;
    comment: string;
    imageUrl?: string;
    adminReply?: string;
    adminRepliedAt?: string;
    createdAt: string;
}

export interface ReviewResponse {
    content: Review[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}
