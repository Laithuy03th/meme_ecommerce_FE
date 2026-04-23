"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Send, Loader2, Trash2, Sparkles, Plus, History } from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
    sendChatMessage,
    getChatHistory,
    getChatSuggestions,
} from "@/services/api/chatbotApi";
import { ChatMessage, ChatSuggestion, ChatSearchMeta, QuickReply } from "@/types/chatbot";
import { useAuthStore } from "@/stores/authStore";

const generateSessionId = (): string => {
    if (
        typeof window !== "undefined" &&
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

interface ChatbotProps {
    isOpen: boolean;
    onToggle: (open: boolean) => void;
}

export default function Chatbot({ isOpen, onToggle }: ChatbotProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [suggestions, setSuggestions] = useState<ChatSuggestion[]>([]);
    const [showWelcome, setShowWelcome] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        initializeSession();
        loadSuggestions();

        const wasOpen = sessionStorage.getItem("chatbot_is_open") === "true";
        if (wasOpen) onToggle(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const initializeSession = async () => {
        let sid = localStorage.getItem("chatbot_session_id");

        if (!sid) {
            sid = generateSessionId();
            localStorage.setItem("chatbot_session_id", sid);
            console.log("🆕 New chat session:", sid);
        } else {
            console.log("♻️ Restored session:", sid);
            await loadChatHistory(sid);
        }

        setSessionId(sid);
    };

    const loadChatHistory = async (sid: string) => {
        try {
            const history = await getChatHistory(sid);

            if (history.length > 0) {
                const loadedMessages: ChatMessage[] = [];

                history.forEach((h) => {
                    const isBotRow =
                        h.messageType === "BOT" ||
                        (typeof h.response === "string" && h.response.trim().length > 0);

                    if (isBotRow) {
                        loadedMessages.push({
                            id: `${h.id}_bot`,
                            type: "bot",
                            content: h.response || "",
                            timestamp: new Date(h.createdAt),
                            sessionId: h.sessionId,
                            intent: h.intent as any,
                        });
                    } else if (h.message) {
                        loadedMessages.push({
                            id: `${h.id}_user`,
                            type: "user",
                            content: h.message,
                            timestamp: new Date(h.createdAt),
                            sessionId: h.sessionId,
                        });
                    }
                });

                loadedMessages.sort(
                    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
                );

                setMessages(loadedMessages);
                setShowWelcome(false);
                console.log(`📜 Loaded ${loadedMessages.length} messages`);
            }
        } catch (error) {
            console.error("Failed to load history:", error);
        }
    };

    const loadSuggestions = async () => {
        const sug = await getChatSuggestions();
        setSuggestions(sug);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleToggleChat = (open: boolean) => {
        onToggle(open);
        if (open) {
            sessionStorage.setItem("chatbot_is_open", "true");
        } else {
            sessionStorage.removeItem("chatbot_is_open");
        }
    };

    const buildProductsUrl = (searchMeta?: ChatSearchMeta) => {
        const params = new URLSearchParams();

        if (searchMeta?.keyword) params.set("keyword", searchMeta.keyword);
        if (searchMeta?.category) params.set("category", searchMeta.category);
        if (!searchMeta?.category && searchMeta?.categorySlug) {
            params.set("category", searchMeta.categorySlug);
        }
        if (searchMeta?.brand) params.set("brand", searchMeta.brand);
        if (typeof searchMeta?.minPrice === "number") {
            params.set("minPrice", String(searchMeta.minPrice));
        }
        if (typeof searchMeta?.maxPrice === "number") {
            params.set("maxPrice", String(searchMeta.maxPrice));
        }
        if (typeof searchMeta?.minRating === "number") {
            params.set("minRating", String(searchMeta.minRating));
        }
        if (searchMeta?.sortBy) {
            params.set("sort", searchMeta.sortBy);
        }

        const query = params.toString();
        return query ? `/products?${query}` : "/products";
    };

    const shouldOpenProductsPage = (reply: QuickReply, msg: ChatMessage) => {
        if (msg.intent !== "product") return false;
        if (!msg.data?.searchMeta) return false;

        const label = reply.label.toLowerCase();
        const value = reply.value.toLowerCase();

        return (
            label.includes("xem thêm") ||
            label.includes("xem tất cả") ||
            value.includes("xem thêm") ||
            value.includes("xem tất cả")
        );
    };

    const handleQuickReplyClick = (reply: QuickReply, msg: ChatMessage) => {
        if (shouldOpenProductsPage(reply, msg)) {
            router.push(buildProductsUrl(msg.data?.searchMeta));
            return;
        }
        handleSendMessage(reply.value);
    };

    const handleSendMessage = async (messageText?: string) => {
        const textToSend = messageText || input.trim();

        if (!textToSend || !sessionId || isLoading) return;

        setShowWelcome(false);

        const userMessage: ChatMessage = {
            id: `${Date.now()}_user`,
            type: "user",
            content: textToSend,
            timestamp: new Date(),
            sessionId,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await sendChatMessage({
                message: textToSend,
                sessionId,
            });

            const botMessage: ChatMessage = {
                id: `${Date.now()}_bot`,
                type: "bot",
                content: response.response,
                timestamp: new Date(),
                sessionId,
                intent: response.intent,
                quickReplies: response.quickReplies,
                data: response.data,
            };

            setMessages((prev) => [...prev, botMessage]);

            if (response.requiresAuth && !user) {
                setTimeout(() => {
                    const redirectUrl =
                        "/login?redirect=" + encodeURIComponent(window.location.pathname);
                    router.push(redirectUrl);
                }, 1500);
            }
        } catch (error) {
            console.error("Failed to send message:", error);

            setMessages((prev) => [
                ...prev,
                {
                    id: `${Date.now()}_error`,
                    type: "bot",
                    content: "❌ Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
                    timestamp: new Date(),
                    sessionId,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSession = () => {
        if (
            window.confirm(
                "Bạn có chắc chắn muốn xóa lịch sử hiện tại và bắt đầu cuộc hội thoại mới không?"
            )
        ) {
            localStorage.removeItem("chatbot_session_id");
            setMessages([]);
            setShowWelcome(true);
            initializeSession();
        }
    };

    const handleSuggestionClick = (title: string) => {
        handleSendMessage(title);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Sparkles className="w-8 h-8" />
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">MyWeb Assistant</h3>
                                <p className="text-xs opacity-90">Hỗ trợ mua sắm 24/7</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleResetSession}
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                                title="Cuộc hội thoại mới"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => alert("Tính năng lịch sử đang phát triển")}
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                                title="Lịch sử hội thoại"
                            >
                                <History className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleToggleChat(false)}
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                        {showWelcome && messages.length === 0 && (
                            <div className="text-center py-8 space-y-4">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-10 h-10 text-white" />
                                </div>

                                <div>
                                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                                        Chào mừng đến MyWeb! 👋
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                        Tôi có thể giúp bạn tìm sản phẩm, theo dõi đơn hàng và giải đáp chính sách.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-6">
                                    {suggestions.map((sug, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSuggestionClick(sug.title)}
                                            className="p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all duration-200 text-left group"
                                        >
                                            <div className="text-2xl mb-1">{sug.icon}</div>
                                            <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600">
                                                {sug.title}
                                            </div>
                                            {sug.description && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {sug.description}
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div
                                key={msg.id || idx}
                                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} mb-4`}
                            >
                                {msg.type === "bot" && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-2 flex-shrink-0 shadow-sm mt-auto">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[80%] px-4 py-3 ${msg.type === "user"
                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-br-sm shadow-md"
                                        : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-sm shadow-sm"
                                        }`}
                                >
                                    <div className="text-sm leading-relaxed">
                                        {msg.type === "bot" ? (
                                            <div className="markdown-body space-y-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>h3]:font-bold [&>h3]:text-lg [&>p>strong]:font-bold">
                                                <ReactMarkdown>{msg.content || ""}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            <div className="whitespace-pre-wrap">{msg.content}</div>
                                        )}
                                    </div>

                                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {msg.quickReplies.map((reply, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleQuickReplyClick(reply, msg)}
                                                    className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-xs font-semibold transition-colors border border-blue-200 shadow-sm"
                                                >
                                                    {reply.icon && <span className="mr-1.5">{reply.icon}</span>}
                                                    {reply.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {msg.intent === "product" &&
                                        msg.data?.products &&
                                        msg.data.products.length > 0 && (
                                            <div className="mt-4">
                                                <div className="flex gap-3 overflow-x-auto pb-3 snap-x">
                                                    {msg.data.products.slice(0, 5).map((product, i) => (
                                                        <a
                                                            key={i}
                                                            href={`/products/${product.id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="min-w-[160px] bg-white border border-gray-200 rounded-lg p-2 hover:shadow-md transition-shadow flex-shrink-0"
                                                        >
                                                            <img
                                                                src={product.imageUrl || "/placeholder-product.png"}
                                                                alt={product.name}
                                                                className="w-full h-24 object-cover rounded mb-2"
                                                            />

                                                            <h4 className="text-xs font-medium text-gray-800 line-clamp-2 mb-1">
                                                                {product.name}
                                                            </h4>

                                                            {product.brand && (
                                                                <p className="text-[11px] text-gray-500 mb-1">
                                                                    {product.brand}
                                                                </p>
                                                            )}

                                                            <p className="text-sm font-bold text-blue-600">
                                                                {new Intl.NumberFormat("vi-VN", {
                                                                    style: "currency",
                                                                    currency: "VND",
                                                                }).format(product.price)}
                                                            </p>

                                                            {typeof product.rating === "number" && (
                                                                <p className="text-[11px] text-amber-600 mt-1">
                                                                    ★ {product.rating.toFixed(1)}
                                                                </p>
                                                            )}
                                                        </a>
                                                    ))}
                                                </div>

                                                {msg.data?.searchMeta && (
                                                    <button
                                                        onClick={() => router.push(buildProductsUrl(msg.data?.searchMeta))}
                                                        className="mt-2 w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-black transition-colors"
                                                    >
                                                        Xem tất cả kết quả
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                    {msg.intent === "order" && msg.data?.order && (
                                        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <span className="text-gray-600">Mã đơn:</span>
                                                    <span className="ml-2 font-mono font-bold">
                                                        #{msg.data.order.id}
                                                    </span>
                                                </div>

                                                <div>
                                                    <span className="text-gray-600">Trạng thái:</span>
                                                    <span
                                                        className={`ml-2 font-semibold ${msg.data.order.status === "DELIVERED"
                                                            ? "text-green-600"
                                                            : msg.data.order.status === "CANCELED"
                                                                ? "text-red-600"
                                                                : "text-yellow-600"
                                                            }`}
                                                    >
                                                        {msg.data.order.status}
                                                    </span>
                                                </div>

                                                <div className="col-span-2">
                                                    <span className="text-gray-600">Tổng tiền:</span>
                                                    <span className="ml-2 font-bold text-blue-600">
                                                        {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }).format(msg.data.order.totalAmount)}
                                                    </span>
                                                </div>
                                            </div>

                                            <a
                                                href={`/account/orders/${msg.data.order.id}`}
                                                className="block mt-2 text-center text-blue-600 hover:underline text-xs"
                                            >
                                                Xem chi tiết →
                                            </a>
                                        </div>
                                    )}

                                    {msg.intent === "order" &&
                                        msg.data?.orders &&
                                        msg.data.orders.length > 0 && (
                                            <div className="mt-4 space-y-2">
                                                {msg.data.orders.slice(0, 3).map((order, i) => (
                                                    <a
                                                        key={i}
                                                        href={`/account/orders/${order.id}`}
                                                        className="block bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="font-semibold">Đơn #{order.id}</span>
                                                            <span className="text-gray-500">{order.status}</span>
                                                        </div>
                                                        <div className="mt-1 text-xs text-blue-600 font-bold">
                                                            {new Intl.NumberFormat("vi-VN", {
                                                                style: "currency",
                                                                currency: "VND",
                                                            }).format(order.totalAmount)}
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        )}

                                    <div className="text-xs mt-2 opacity-70">
                                        {msg.timestamp.toLocaleTimeString("vi-VN", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start mb-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-2 flex-shrink-0 shadow-sm mt-auto">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-sm shadow-sm px-4 py-3 flex items-center h-[42px]">
                                    <div className="flex space-x-1.5 items-center">
                                        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-white border-t border-gray-200">
                        <div className="flex items-end gap-2">
                            <div className="flex-1 relative">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Nhập tin nhắn..."
                                    disabled={!sessionId || isLoading}
                                    rows={1}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    style={{ minHeight: "48px", maxHeight: "120px" }}
                                />
                            </div>

                            <button
                                onClick={() => handleSendMessage()}
                                disabled={!input.trim() || !sessionId || isLoading}
                                className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>

                        {process.env.NODE_ENV === "development" && sessionId && (
                            <div className="mt-2 text-xs text-gray-400 font-mono">
                                Session: {sessionId.substring(0, 8)}...
                                {user && ` | User: ${user.fullName}`}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}