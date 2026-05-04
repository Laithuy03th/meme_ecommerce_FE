"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle2, Package, Clock, XCircle, Info } from "lucide-react";
import { notificationApi } from "@/services/api/notificationApi";
import { NotificationType } from "@/types/notification";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

// Custom time formatting function to replace date-fns
const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + " năm trước";
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + " tháng trước";
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + " ngày trước";
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " giờ trước";
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + " phút trước";
  
  return "Vừa xong";
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    } else {
      setUnreadCount(0);
      setNotifications([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationApi.getUnreadCount();
      setUnreadCount(res.count);
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getNotifications(0, 10);
      setNotifications(res.content);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const handleToggle = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      fetchNotifications();
    }
  };

  const handleNotificationClick = async (notif: NotificationType) => {
    if (!notif.isRead) {
      try {
        await notificationApi.markAsRead(notif.id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
      } catch (error) {
        console.error("Failed to mark as read", error);
      }
    }
    setIsOpen(false);
    if (notif.relatedId) {
      router.push(`/account/orders/${notif.relatedId}`);
    }
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationApi.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "order_created":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "order_confirmed":
        return <Package className="w-5 h-5 text-amber-500" />;
      case "order_shipping":
        return <Package className="w-5 h-5 text-purple-500" />;
      case "order_completed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "order_cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2.5 rounded-full hover:bg-white/80 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group border border-transparent hover:border-primary/20"
      >
        <Bell className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-bounce">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-800">Thông báo</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <Bell className="w-10 h-10 text-gray-200 mb-3" />
                <p className="text-sm">Bạn chưa có thông báo nào</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors flex gap-3 ${
                      !notif.isRead ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <div className={`p-2 rounded-full ${!notif.isRead ? "bg-white shadow-sm" : "bg-gray-50"}`}>
                        {getIcon(notif.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm mb-1 ${!notif.isRead ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                        {notif.title}
                      </h4>
                      <p className={`text-xs leading-relaxed line-clamp-2 ${!notif.isRead ? "text-gray-600" : "text-gray-500"}`}>
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-gray-400 block mt-2 font-medium">
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
