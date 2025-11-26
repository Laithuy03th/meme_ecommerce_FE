"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight, Package } from "lucide-react";
import { useEffect } from "react";
// @ts-ignore
import confetti from "canvas-confetti";

const SuccessPage = () => {
    useEffect(() => {
        // Fire confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        };

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 animate-in zoom-in duration-500">
                <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 max-w-md mb-8 text-lg">
                Thank you for your purchase. We have received your order and will send you a confirmation email shortly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/account/orders"
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg"
                >
                    <Package className="w-5 h-5" />
                    View Order
                </Link>
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                    Continue Shopping
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );
};

export default SuccessPage;
