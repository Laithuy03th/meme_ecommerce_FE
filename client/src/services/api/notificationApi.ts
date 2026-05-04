import { NotificationType } from '@/types/notification';
import { BASE_URL, authenticatedFetch } from './base';

export const notificationApi = {
  getNotifications: async (page = 0, size = 10): Promise<{ content: NotificationType[]; totalElements: number; totalPages: number }> => {
    const res = await authenticatedFetch(`/notifications?page=${page}&size=${size}`, { method: 'GET' });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const res = await authenticatedFetch(`/notifications/unread-count`, { method: 'GET' });
    if (!res.ok) throw new Error('Failed to fetch unread count');
    return res.json();
  },

  markAsRead: async (id: number): Promise<void> => {
    const res = await authenticatedFetch(`/notifications/${id}/read`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to mark as read');
  },

  markAllAsRead: async (): Promise<void> => {
    const res = await authenticatedFetch(`/notifications/read-all`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to mark all as read');
  }
};
