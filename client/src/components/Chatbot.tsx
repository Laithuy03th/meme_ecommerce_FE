"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Send, Loader2, Trash2, BotMessageSquare, Plus, History } from "lucide-react";
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
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef({ startX: 0, startY: 0, currentX: 0, currentY: 0 });

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { user } = useAuthStore();

    // Tạo localStorage key riêng theo userId để tránh nhầm lẫn session giữa các tài khoản
    const getSessionStorageKey = () =>
        user?.id ? `chatbot_session_id_${user.id}` : "chatbot_session_id_guest";
    const router = useRouter();

    useEffect(() => {
        initializeSession();
        loadSuggestions();

        const wasOpen = sessionStorage.getItem("chatbot_is_open") === "true";
        if (wasOpen) onToggle(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]); // Re-init khi user thay đổi (đăng nhập / đăng xuất / đổi tài khoản)

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    }, [messages, isLoading, isOpen]);

    const initializeSession = async () => {
        // Reset state trước khi init (quan trọng khi switch account)
        setMessages([]);
        setShowWelcome(true);

        const storageKey = getSessionStorageKey();

        if (!user) {
            // Khách vãng lai: luôn tạo session mới, KHÔNG restore lịch sử
            const sid = generateSessionId();
            localStorage.setItem(storageKey, sid);
            console.log("🆕 Guest new session:", sid);
            setSessionId(sid);
            return;
        }

        // Người dùng đã đăng nhập: khôi phục session riêng của họ
        let sid = localStorage.getItem(storageKey);
        if (!sid) {
            sid = generateSessionId();
            localStorage.setItem(storageKey, sid);
            console.log("🆕 New session for user", user.id, ":", sid);
        } else {
            console.log("♻️ Restored session for user", user.id, ":", sid);
            await loadChatHistory(sid);
        }

        setSessionId(sid);
    };

    const loadChatHistory = async (sid: string) => {
        try {
            const history = await getChatHistory(sid);

            // Guard: nếu API trả về không phải mảng hợp lệ thì bỏ qua
            if (!Array.isArray(history) || history.length === 0) return;

            const loadedMessages: ChatMessage[] = [];

            history.forEach((h: any) => {
                if (!h || typeof h !== "object") return; // skip null/invalid items

                const isBotRow =
                    h.role === "bot" || h.messageType === "BOT" ||
                    (typeof h.response === "string" && h.response.trim().length > 0) ||
                    (typeof h.content === "string" && h.role === "bot");

                const baseId = h.id ? String(h.id) : crypto.randomUUID();

                if (isBotRow) {
                    loadedMessages.push({
                        id: `${baseId}_bot`,
                        type: "bot",
                        content: h.content || h.response || "",
                        timestamp: h.createdAt ? new Date(h.createdAt) : new Date(),
                        sessionId: h.sessionId,
                        intent: h.intent,
                        data: h.data,
                        quickReplies: h.quickReplies,
                    });
                } else if (h.role === "user" || h.messageType === "USER" || h.message) {
                    loadedMessages.push({
                        id: `${baseId}_user`,
                        type: "user",
                        content: h.content || h.message || "",
                        timestamp: h.createdAt ? new Date(h.createdAt) : new Date(),
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
            id: `${crypto.randomUUID()}_user`,
            type: "user",
            content: textToSend,
            timestamp: new Date(),
            sessionId,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
        setIsLoading(true);

        try {
            const response = await sendChatMessage({
                message: textToSend,
                sessionId,
            });

            const botMessage: ChatMessage = {
                id: `${crypto.randomUUID()}_bot`,
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
            const storageKey = getSessionStorageKey();
            localStorage.removeItem(storageKey);
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

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('button')) return;
        setIsDragging(true);
        dragRef.current.startX = e.clientX;
        dragRef.current.startY = e.clientY;
        dragRef.current.currentX = position.x;
        dragRef.current.currentY = position.y;
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const deltaX = e.clientX - dragRef.current.startX;
            const deltaY = e.clientY - dragRef.current.startY;
            setPosition({
                x: dragRef.current.currentX + deltaX,
                y: dragRef.current.currentY + deltaY,
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <>
            {isOpen && (
                <div
                    className={`fixed bottom-6 right-6 z-50 w-[420px] h-[600px] bg-white rounded-2xl flex flex-col overflow-hidden border border-gray-200 transition-shadow duration-200 ${isDragging ? 'shadow-2xl shadow-blue-500/20' : 'shadow-2xl'}`}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px)`,
                    }}
                >
                    <div
                        className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                        onMouseDown={handleMouseDown}
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <BotMessageSquare className="w-8 h-8" />
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Meme Assistant</h3>
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
                                    <BotMessageSquare className="w-10 h-10 text-white" />
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
                                        <BotMessageSquare className="w-4 h-4 text-white" />
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
                                                    {msg.data.products.slice(0, 5).map((product) => (
                                                        <a
                                                            key={product.id ?? product.slug ?? product.name}
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
                                    <BotMessageSquare className="w-4 h-4 text-white" />
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

                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="relative flex items-end w-full border border-gray-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] bg-gray-50/50 hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-400 transition-all duration-300 group">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    e.target.style.height = 'auto';
                                    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                                }}
                                onKeyDown={handleKeyPress}
                                placeholder="Hỏi Meme Assistant bất cứ điều gì..."
                                disabled={!sessionId || isLoading}
                                rows={1}
                                className="w-full max-h-[150px] px-4 py-3.5 pr-[52px] bg-transparent focus:outline-none resize-none disabled:cursor-not-allowed text-[15px] leading-relaxed text-gray-700 placeholder-gray-400"
                                style={{ minHeight: "52px" }}
                            />

                            <button
                                onClick={() => handleSendMessage()}
                                disabled={!input.trim() || !sessionId || isLoading}
                                className={`absolute right-2 bottom-2 w-9 h-9 rounded-xl transition-all duration-300 flex items-center justify-center ${input.trim() && !isLoading
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                                    : "bg-gray-200/80 text-gray-400"
                                    }`}
                            >
                                <Send className="w-[18px] h-[18px] ml-[2px] mb-[1px]" />
                            </button>
                        </div>
                        <div className="text-center text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1.5 opacity-80">
                            <BotMessageSquare className="w-3.5 h-3.5 text-purple-400" />
                            <span>Meme Assistant có thể đưa ra thông tin hỗ trợ bạn!.</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}