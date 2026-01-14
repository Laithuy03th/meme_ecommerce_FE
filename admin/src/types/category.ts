export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    parentId: number | null;
    parentName: string | null;
    sortOrder: number;
    status: 'ACTIVE' | 'INACTIVE';
    imageUrl: string | null;
}

export interface CreateCategoryRequest {
    name: string;
    slug?: string;
    description?: string | null;
    imageUrl?: string | null;
    parentId?: number | null;
    parentName?: string | null; // Backend cũng nhận parentName trong PUT request
    sortOrder?: number;
    status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateCategoryRequest {
    name: string;
    slug?: string;
    description?: string | null;
    imageUrl?: string | null;
    parentId?: number | null;
    parentName?: string | null;
    sortOrder?: number;
    status?: 'ACTIVE' | 'INACTIVE';
}
