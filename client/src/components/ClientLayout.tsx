"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

interface ClientLayoutProps {
    children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <>
            <Navbar isChatOpen={isChatOpen} onChatToggle={setIsChatOpen} />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Chatbot isOpen={isChatOpen} onToggle={setIsChatOpen} />
        </>
    );
}
