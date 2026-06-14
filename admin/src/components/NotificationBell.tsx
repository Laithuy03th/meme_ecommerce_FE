"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Clock, Package, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notificationApi, AdminNotificationType } from "@/services/notificationApi";

export default function NotificationBell() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<AdminNotificationType[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const fetchUnreadCount = async () => {
        try {
            const count = await notificationApi.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error("Failed to fetch unread count:", error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await notificationApi.getNotifications(0, 5); // Fetch top 5
            setNotifications(res.content);
            setUnreadCount(res.content.filter(n => !n.isRead).length); // sync local count
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    // Polling every 30 seconds for unread count
    useEffect(() => {
        fetchUnreadCount(); // Initial fetch
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    // Fetch full list when dropdown is opened
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const handleNotificationClick = async (notification: AdminNotificationType) => {
        if (!notification.isRead) {
            try {
                await notificationApi.markAsRead(notification.id);
                setUnreadCount(prev => Math.max(0, prev - 1));
                setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
            } catch (error) {
                console.error("Failed to mark as read:", error);
            }
        }
        
        // Navigate based on target type
        if (notification.actionUrl) {
            router.push(notification.actionUrl);
            setIsOpen(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "ORDER_CREATED":
                return <Package className="h-4 w-4 text-blue-500" />;
            case "REVIEW_CREATED":
                return <Star className="h-4 w-4 text-yellow-500" />;
            default:
                return <Bell className="h-4 w-4 text-gray-500" />;
        }
    };

    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (seconds < 60) return `${seconds}s trước`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m trước`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h trước`;
        const days = Math.floor(hours / 24);
        return `${days}d trước`;
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full border-2 border-background"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden rounded-xl shadow-xl border-slate-200">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                    <DropdownMenuLabel className="p-0 font-semibold text-slate-800">Thông báo</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => {
                                e.preventDefault();
                                handleMarkAllAsRead();
                            }}
                            className="h-auto p-0 text-xs text-primary hover:text-primary/80 hover:bg-transparent font-medium"
                        >
                            <Check className="mr-1 h-3 w-3" /> Đánh dấu đã đọc
                        </Button>
                    )}
                </div>
                
                <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                            <Bell className="h-8 w-8 mb-2 text-slate-300 opacity-50" />
                            <p className="text-sm">Không có thông báo nào</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem 
                                key={notification.id} 
                                className={`flex flex-col items-start p-4 cursor-pointer border-b border-slate-50 last:border-0 rounded-none focus:bg-slate-50 transition-colors ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex w-full gap-3">
                                    <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${!notification.isRead ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className={`text-sm font-medium leading-none ${!notification.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center pt-1 text-[11px] text-slate-400 font-medium">
                                            <Clock className="mr-1 h-3 w-3" />
                                            {timeAgo(notification.createdAt)}
                                        </div>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full flex-shrink-0 shadow-sm" />
                                    )}
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
                
                {notifications.length > 0 && (
                    <div className="p-2 border-t border-slate-100 bg-slate-50">
                        <Button 
                            variant="ghost" 
                            className="w-full text-xs text-slate-600 hover:text-slate-900"
                            onClick={() => {
                                // Mở modal hoặc trang xem toàn bộ nếu cần (để trống hoặc làm sau)
                                setIsOpen(false);
                            }}
                        >
                            Xem tất cả thông báo
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
