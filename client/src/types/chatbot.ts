export type QuickReply = {
    label: string;
    value: string;
    icon?: string;
};

export type ChatSearchMeta = {
    keyword?: string;
    category?: string;
    categorySlug?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: string;
};

export type ChatProductCard = {
    id: number;
    slug?: string;
    name: string;
    price: number;
    imageUrl?: string;
    brand?: string | null;
    rating?: number | null;
};

export type ChatOrderData = {
    id: number;
    status: string;
    paymentStatus?: string;
    totalAmount: number;
    createdAt: string;
};

export type ChatbotMessageRequest = {
    message: string;
    sessionId: string;
    userId?: number | null;
};

export type ChatbotMessageResponse = {
    response: string;
    intent: "product" | "policy" | "order" | "greeting" | "other";
    sessionId: string;
    quickReplies?: QuickReply[];
    data?: {
        products?: ChatProductCard[];
        searchMeta?: ChatSearchMeta;
        order?: ChatOrderData;
        orders?: Array<{
            id: number;
            status: string;
            totalAmount: number;
            createdAt: string;
        }>;
    };
    requiresAuth?: boolean;
};

export type ChatHistoryItem = {
    id: number | string;
    sessionId: string;
    message: string;
    response: string;
    intent?: string;
    messageType?: "USER" | "BOT";
    userId?: number | null;
    createdAt: string;
};

export type ChatSuggestion = {
    title: string;
    description?: string;
    icon?: string;
};

export type ChatMessage = {
    id?: string | number;
    type: "user" | "bot";
    content: string;
    timestamp: Date;
    sessionId?: string;
    intent?: "product" | "policy" | "order" | "greeting" | "other";
    quickReplies?: QuickReply[];
    data?: {
        products?: ChatProductCard[];
        searchMeta?: ChatSearchMeta;
        order?: ChatOrderData;
        orders?: Array<{
            id: number;
            status: string;
            totalAmount: number;
            createdAt: string;
        }>;
    };
};