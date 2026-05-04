export interface NotificationType {
  id: number;
  title: string;
  message: string;
  type: string;
  relatedId: number;
  isRead: boolean;
  createdAt: string;
}
