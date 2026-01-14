"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Send, MessageCircle, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { sendChatMessage, getChatHistory, getChatSuggestions } from '@/services/api/chatbotApi';
import { ChatMessage, ChatSuggestion } from '@/types/chatbot';
import { useAuthStore } from '@/stores/authStore';

/**
 * Generate UUID for session tracking
 * Using crypto.randomUUID() - supported in modern browsers
 */
const generateSessionId = (): string => {
    if (typeof window !== 'undefined' && typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    // Fallback for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

interface ChatbotProps {
    isOpen: boolean;
    onToggle: (open: boolean) => void;
}

export default function Chatbot({ isOpen, onToggle }: ChatbotProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [suggestions, setSuggestions] = useState<ChatSuggestion[]>([]);
    const [showWelcome, setShowWelcome] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuthStore();
    const router = useRouter();

    // Initialize session when component mounts
    useEffect(() => {
        initializeSession();
        loadSuggestions();

        // Restore open state
        const wasOpen = sessionStorage.getItem('chatbot_is_open') === 'true';
        if (wasOpen) onToggle(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const initializeSession = async () => {
        // Get or create sessionId
        let sid = sessionStorage.getItem('chatbot_session_id');

        if (!sid) {
            sid = generateSessionId();
            sessionStorage.setItem('chatbot_session_id', sid);
            console.log('🆕 New chat session:', sid);
        } else {
            console.log('♻️ Restored session:', sid);
            // Load chat history
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
                    // Add user message
                    if (h.message) {
                        loadedMessages.push({
                            id: h.id,
                            type: 'user',
                            content: h.message,
                            timestamp: new Date(h.createdAt),
                            sessionId: h.sessionId,
                        });
                    }

                    // Add bot response
                    if (h.response) {
                        loadedMessages.push({
                            id: h.id,
                            type: 'bot',
                            content: h.response,
                            timestamp: new Date(h.createdAt),
                            sessionId: h.sessionId,
                            intent: h.intent,
                        });
                    }
                });

                // Sort by timestamp if needed (API should assume order but let's be safe)
                // loadedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

                setMessages(loadedMessages);
                setShowWelcome(false);
                console.log(`📜 Loaded ${loadedMessages.length} messages`);
            }
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    };

    const loadSuggestions = async () => {
        const sug = await getChatSuggestions();
        setSuggestions(sug);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleToggleChat = (open: boolean) => {
        onToggle(open);
        if (open) {
            sessionStorage.setItem('chatbot_is_open', 'true');
        } else {
            sessionStorage.removeItem('chatbot_is_open');
        }
    };

    const handleSendMessage = async (messageText?: string) => {
        const textToSend = messageText || input.trim();

        if (!textToSend || !sessionId || isLoading) return;

        // Hide welcome screen
        setShowWelcome(false);

        // Add user message (Optimistic UI)
        const userMessage: ChatMessage = {
            id: Date.now().toString(), // Helper ID for key
            type: 'user',
            content: textToSend,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // ✅ Backend sẽ tự extract userId từ JWT token (trong Authorization header)
            // Không cần gửi userId trong body nữa
            const response = await sendChatMessage({
                message: textToSend,
                sessionId: sessionId,
                // userId: null // Backend tự lấy từ token
            });

            // Add bot response
            const botMessage: ChatMessage = {
                id: Date.now().toString() + '_bot',
                type: 'bot',
                content: response.response,
                timestamp: new Date(),
                intent: response.intent,
                quickReplies: response.quickReplies,
                data: response.data,
            };

            setMessages((prev) => [...prev, botMessage]);

            // Handle requiresAuth
            if (response.requiresAuth && !user) {
                setTimeout(() => {
                    const redirectUrl = '/login?redirect=' + encodeURIComponent(window.location.pathname);
                    router.push(redirectUrl);
                }, 2000);
            }
        } catch (error) {
            console.error('Failed to send message:', error);

            // Error message
            setMessages((prev) => [
                ...prev,
                {
                    type: 'bot',
                    content: '❌ Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSession = () => {
        sessionStorage.removeItem('chatbot_session_id');
        setMessages([]);
        setShowWelcome(true);
        initializeSession();
    };

    const handleSuggestionClick = (title: string) => {
        handleSendMessage(title);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Sparkles className="w-8 h-8" />
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">MyWeb Assistant</h3>
                                <p className="text-xs opacity-90">Hỗ trợ 24/7</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleResetSession}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                title="Cuộc hội thoại mới"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleToggleChat(false)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                        {/* Welcome Screen */}
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
                                        Tôi có thể giúp bạn tìm sản phẩm, theo dõi đơn hàng, và nhiều hơn nữa!
                                    </p>
                                </div>

                                {/* Quick Suggestions */}
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

                        {/* Messages */}
                        {messages.map((msg, idx) => (
                            <div
                                key={msg.id || idx}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.type === 'user'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none'
                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                        }`}
                                >
                                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                        {msg.content}
                                    </div>

                                    {/* Quick replies */}
                                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {msg.quickReplies.map((reply, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleSendMessage(reply.value)}
                                                    className="block w-full text-left px-3 py-2 bg-gray-50 hover:bg-blue-50 text-blue-600 rounded-lg text-sm transition-colors"
                                                >
                                                    {reply.icon && <span className="mr-2">{reply.icon}</span>}
                                                    {reply.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Product Cards (nếu intent = product_inquiry) */}
                                    {msg.intent === 'product_inquiry' && msg.data?.products && msg.data.products.length > 0 && (
                                        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                                            {msg.data.products.slice(0, 5).map((product: any, i: number) => (
                                                <a
                                                    key={i}
                                                    href={`/products/${product.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="min-w-[140px] bg-white border border-gray-200 rounded-lg p-2 hover:shadow-md transition-shadow flex-shrink-0"
                                                >
                                                    <img
                                                        src={product.imageUrl || '/placeholder-product.png'}
                                                        alt={product.name}
                                                        className="w-full h-24 object-cover rounded mb-2"
                                                    />
                                                    <h4 className="text-xs font-medium text-gray-800 line-clamp-2 mb-1">
                                                        {product.name}
                                                    </h4>
                                                    <p className="text-sm font-bold text-blue-600">
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(product.price)}
                                                    </p>
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    {/* Order Info (nếu intent = order_tracking) */}
                                    {msg.intent === 'order_tracking' && msg.data?.order && (
                                        <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <span className="text-gray-600">Mã đơn:</span>
                                                    <span className="ml-2 font-mono font-bold">#{msg.data.order.id}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Trạng thái:</span>
                                                    <span className={`ml-2 font-semibold ${msg.data.order.status === 'DELIVERED' ? 'text-green-600' :
                                                        msg.data.order.status === 'CANCELLED' ? 'text-red-600' :
                                                            'text-yellow-600'
                                                        }`}>
                                                        {msg.data.order.status}
                                                    </span>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="text-gray-600">Tổng tiền:</span>
                                                    <span className="ml-2 font-bold text-blue-600">
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(msg.data.order.totalPrice)}
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

                                    <div className="text-xs mt-2 opacity-70">
                                        {msg.timestamp.toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                        <span className="text-sm text-gray-600">Đang trả lời...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-200">
                        <div className="flex items-end gap-2">
                            <div className="flex-1 relative">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Nhập tin nhắn..."
                                    disabled={!sessionId || isLoading}
                                    rows={1}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    style={{ minHeight: '48px', maxHeight: '120px' }}
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

                        {/* Session Info (Dev mode) */}
                        {process.env.NODE_ENV === 'development' && sessionId && (
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
