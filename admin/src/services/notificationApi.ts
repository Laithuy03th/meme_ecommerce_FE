import { authenticatedFetch } from "./api";

export interface AdminNotificationType {
    id: number;
    title: string;
    message: string;
    type: string;
    targetType: string;
    targetId: number;
    actionUrl: string;
    createdBy: string;
    isRead: boolean;
    createdAt: string;
}

export interface PaginatedNotifications {
    content: AdminNotificationType[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export const notificationApi = {
    getNotifications: (page: number = 0, size: number = 10) =>
        authenticatedFetch<PaginatedNotifications>(`/admin/notifications?page=${page}&size=${size}`),

    getUnreadCount: () =>
        authenticatedFetch<number>(`/admin/notifications/unread-count`),

    markAsRead: (id: number) =>
        authenticatedFetch<void>(`/admin/notifications/${id}/read`, { method: "PUT" }),

    markAllAsRead: () =>
        authenticatedFetch<void>(`/admin/notifications/read-all`, { method: "PUT" })
};
