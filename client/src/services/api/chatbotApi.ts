import { ChatbotMessageRequest, ChatbotMessageResponse, ChatHistoryItem, ChatSuggestion } from '@/types/chatbot';
import { BASE_URL } from './base';

// FIX: Chatbot API không nằm trong /api/v1
// Backend: http://localhost:8080/api/chatbot
// BASE_URL: http://localhost:8080/api/v1
const CHATBOT_BASE_URL = BASE_URL.replace('/api/v1', '');

/**
 * Helper to get access token from authStore
 * Phải dynamic import vì authStore dùng zustand với localStorage (client-only)
 */
const getAccessToken = async (): Promise<string | null> => {
    if (typeof window === 'undefined') return null;

    try {
        const { useAuthStore } = await import('@/stores/authStore');
        const token = useAuthStore.getState().accessToken;
        return token;
    } catch {
        return null;
    }
};

export const sendChatMessage = async (
    request: ChatbotMessageRequest
): Promise<ChatbotMessageResponse> => {
    // Lấy JWT token để gửi kèm (cần thiết cho "đơn hàng của tôi")
    const token = await getAccessToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    //  Gửi Authorization header nếu user đã login
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${CHATBOT_BASE_URL}/api/chatbot/message`, {
        method: 'POST',
        headers,
        credentials: 'include', //  Vẫn giữ để gửi cookies (hybrid auth)
        body: JSON.stringify(request),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to send message' }));
        throw new Error(error.message || 'Failed to send message');
    }

    return res.json();
};

export const getChatHistory = async (sessionId: string): Promise<ChatHistoryItem[]> => {
    try {
        const res = await fetch(`${CHATBOT_BASE_URL}/api/chatbot/history/${sessionId}`, {
            credentials: 'include',
        });

        if (!res.ok) {
            // Silently return empty array on failure to avoid UI disruption
            // (e.g. backend down or 404)
            if (res.status === 404) return [];
            console.warn(`[getChatHistory] Failed with status ${res.status}`);
            return [];
        }

        return res.json();
    } catch (error) {
        // Use warn instead of error to prevent Next.js Error Overlay popup
        console.warn('[getChatHistory] Network error:', error);
        return [];
    }
};

export const getChatSuggestions = async (): Promise<ChatSuggestion[]> => {
    try {
        const res = await fetch(`${CHATBOT_BASE_URL}/api/chatbot/suggestions`, {
            credentials: 'include',
        });

        if (!res.ok) {
            return getDefaultSuggestions();
        }

        // Backend trả về string[], cần convert
        const data: string[] = await res.json();

        return data.map((text, index) => ({
            title: text,
            description: getDescription(text),
            icon: getIcon(index),
        }));
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return getDefaultSuggestions();
    }
};

const getIcon = (index: number): string => {
    const icons = ['🔍', '📦', '💳', '🚚', '🎁', '📞'];
    return icons[index] || '💬';
};

const getDescription = (title: string): string => {
    const map: Record<string, string> = {
        'Tìm sản phẩm': 'Tìm áo, giày, phụ kiện...',
        'Kiểm tra đơn hàng': 'Theo dõi trạng thái đơn',
        'Thanh toán như thế nào?': 'Hướng dẫn thanh toán',
        'Chính sách giao hàng': 'Thời gian & phí ship',
        'Voucher giảm giá': 'Mã giảm giá hiện có',
    };
    return map[title] || '';
};

const getDefaultSuggestions = (): ChatSuggestion[] => [
    { title: 'Tìm sản phẩm', description: 'Tìm áo, giày, phụ kiện...', icon: '🔍' },
    { title: 'Theo dõi đơn hàng', description: 'Kiểm tra trạng thái đơn', icon: '📦' },
    { title: 'Hỗ trợ thanh toán', description: 'Hướng dẫn thanh toán', icon: '💳' },
    { title: 'Chính sách giao hàng', description: 'Thời gian & phí ship', icon: '🚚' },
];