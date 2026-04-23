import {
    ChatbotMessageRequest,
    ChatbotMessageResponse,
    ChatHistoryItem,
    ChatSuggestion,
} from "@/types/chatbot";
import { BASE_URL } from "./base";

const CHATBOT_BASE_URL = BASE_URL.replace("/api/v1", "");

const getAccessToken = async (): Promise<string | null> => {
    if (typeof window === "undefined") return null;

    try {
        const { useAuthStore } = await import("@/stores/authStore");
        return useAuthStore.getState().accessToken;
    } catch {
        return null;
    }
};

export const sendChatMessage = async (
    request: ChatbotMessageRequest
): Promise<ChatbotMessageResponse> => {
    const token = await getAccessToken();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${CHATBOT_BASE_URL}/api/chatbot/message`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(request),
    });

    if (!res.ok) {
        const error = await res
            .json()
            .catch(() => ({ message: "Failed to send message" }));
        throw new Error(error.message || "Failed to send message");
    }

    return res.json();
};

export const getChatHistory = async (
    sessionId: string
): Promise<ChatHistoryItem[]> => {
    try {
        const token = await getAccessToken();

        const headers: Record<string, string> = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${CHATBOT_BASE_URL}/api/chatbot/history/${sessionId}`, {
            credentials: "include",
            headers,
        });

        if (!res.ok) {
            if (res.status === 404) return [];
            console.warn(`[getChatHistory] Failed with status ${res.status}`);
            return [];
        }

        return res.json();
    } catch (error) {
        console.warn("[getChatHistory] Network error:", error);
        return [];
    }
};

export const getChatSuggestions = async (): Promise<ChatSuggestion[]> => {
    try {
        const res = await fetch(`${CHATBOT_BASE_URL}/api/chatbot/suggestions`, {
            credentials: "include",
        });

        if (!res.ok) {
            return getDefaultSuggestions();
        }

        const data: string[] = await res.json();

        return data.map((text, index) => ({
            title: text,
            description: getDescription(text),
            icon: getIcon(index),
        }));
    } catch (error) {
        console.warn("Error fetching suggestions:", error);
        return getDefaultSuggestions();
    }
};

const getIcon = (index: number): string => {
    const icons = ["🔍", "📦", "💳", "🚚", "🎁", "📞"];
    return icons[index] || "💬";
};

const getDescription = (title: string): string => {
    const map: Record<string, string> = {
        "Tìm sản phẩm": "Tìm điện thoại, váy, ghế, mỹ phẩm...",
        "Kiểm tra đơn hàng": "Theo dõi trạng thái đơn",
        "Đơn hàng của tôi": "Xem các đơn gần đây",
        "Chính sách giao hàng": "Thời gian & phí ship",
        "Đổi trả hàng như thế nào?": "Xem chính sách đổi trả",
        "Có voucher gì không?": "Thông tin khuyến mãi",
    };
    return map[title] || "";
};

const getDefaultSuggestions = (): ChatSuggestion[] => [
    { title: "Tìm sản phẩm", description: "Tìm điện thoại, váy, ghế, mỹ phẩm...", icon: "🔍" },
    { title: "Kiểm tra đơn hàng", description: "Theo dõi trạng thái đơn", icon: "📦" },
    { title: "Chính sách giao hàng", description: "Thời gian & phí ship", icon: "🚚" },
    { title: "Đổi trả hàng như thế nào?", description: "Xem chính sách đổi trả", icon: "🔄" },
];