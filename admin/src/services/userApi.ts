import { authenticatedFetch, buildQueryString } from './api';

// ==================== TYPES ====================

export interface Address {
    id: number;
    fullName: string;
    phone: string;
    addressLine1: string;
    ward: string;
    district: string;
    province: string;
    country: string;
    label: string;
    zipCode: string;
    isDefault: boolean;
    createdAt: string;
}

export interface Order {
    id: number;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    shippingFee: number;
    createdAt: string;
}

export interface User {
    id: number;
    email: string;
    fullName: string | null;
    phone: string | null;
    status: "ACTIVE" | "INACTIVE" | "LOCKED";
    roles: string[];
    createdAt: string;
    updatedAt?: string;
    gender?: string | null;
    dateOfBirth?: string | null;
    addresses?: Address[];
    orders?: Order[];
}

export interface UserListResponse {
    content: User[];
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
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    last: boolean;
    first: boolean;
    empty: boolean;
    numberOfElements: number;
}

// Request DTOs
export interface CreateUserRequest {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    roles: string[]; // e.g. ["CUSTOMER"], ["ADMIN"]
}

export interface UpdateUserStatusRequest {
    status: "ACTIVE" | "INACTIVE" | "LOCKED";
}

export interface UpdateUserRolesRequest {
    roles: string[];
}

export interface UpdateUserPasswordRequest {
    newPassword: string;
}

// ==================== API SERVICE ====================

export const userApi = {
    /**
     * GET /api/v1/admin/users
     * Get paginated list of users
     */
    async getUsers(page = 0, size = 20): Promise<UserListResponse> {
        const queryString = buildQueryString({ page, size });
        return authenticatedFetch<UserListResponse>(`/admin/users?${queryString}`);
    },

    /**
     * POST /api/v1/admin/users
     * Create new user
     */
    async createUser(data: CreateUserRequest): Promise<User> {
        return authenticatedFetch<User>('/admin/users', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * GET /api/v1/admin/users/{id}
     * Get user by ID
     */
    async getUser(id: number): Promise<User> {
        return authenticatedFetch<User>(`/admin/users/${id}`);
    },

    /**
     * PATCH /api/v1/admin/users/{id}/status
     * Update user status
     */
    async updateUserStatus(id: number, status: string): Promise<User> {
        return authenticatedFetch<User>(`/admin/users/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    },

    /**
     * PATCH /api/v1/admin/users/{id}/roles
     * Update user roles
     */
    async updateUserRoles(id: number, roles: string[]): Promise<User> {
        return authenticatedFetch<User>(`/admin/users/${id}/roles`, {
            method: 'PATCH',
            body: JSON.stringify({ roles }),
        });
    },

    /**
     * PATCH /api/v1/admin/users/{id}/password
     * Update user password
     */
    async updateUserPassword(id: number, newPassword: string): Promise<void> {
        return authenticatedFetch<void>(`/admin/users/${id}/password`, {
            method: 'PATCH',
            body: JSON.stringify({ newPassword }),
        });
    },

    /**
     * DELETE /api/v1/admin/users/{id}
     * Delete user
     */
    async deleteUser(id: number): Promise<void> {
        return authenticatedFetch<void>(`/admin/users/${id}`, {
            method: 'DELETE',
        });
    },
};
