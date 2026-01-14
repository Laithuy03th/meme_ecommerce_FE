/**
 * Chatbot Types
 */

export interface ChatMessage {
    id?: string | number; // ✅ Support cả backend ID (number) và frontend temp ID (string)
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
    sessionId?: string;
    intent?: string;
    quickReplies?: QuickReply[];
    data?: any; // For product data, order info, etc.
}

export interface QuickReply {
    label: string;
    value: string;
    icon?: string;
}

export interface ChatbotMessageRequest {
    message: string;
    sessionId: string;
    userId?: number | null;
}

export interface ChatbotMessageResponse {
    response: string;
    intent: string;
    sessionId: string;
    requiresAuth: boolean;
    quickReplies?: QuickReply[];
    data?: any;
}

export interface ChatHistoryItem {
    id: number;
    message: string;
    response: string;
    intent: string;
    sessionId: string;
    userId: number | null;
    messageType: 'USER' | 'BOT';
    createdAt: string;
}

export interface ChatSuggestion {
    title: string;
    description?: string;
    icon?: string;
}
