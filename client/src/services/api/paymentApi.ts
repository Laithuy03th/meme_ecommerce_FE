import { authenticatedFetch } from "./base";

// DTO trả về từ Backend
export interface PaymentResponse {
    orderId: number;
    paymentMethod: string;
    paymentStatus: string; // "PAID", "UNPAID", "FAILED"
    amount: number;
    message?: string;
    paymentUrl?: string; // Chỉ có khi initiate thành công
}

export const paymentApi = {
    // 1. Tạo thanh toán (Gửi yêu cầu lên Server để lấy Link VNPAY)
    createVnPayPayment: async (orderId: number, amount: number): Promise<string> => {
        // Lấy domain hiện tại để làm Return URL (localhost:3000 hoặc production)
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const returnUrl = `${baseUrl}/payment/result`; // User sẽ được redirect về đây

        console.log("[PaymentAPI] Calling /payments/initiate...");

        const res = await authenticatedFetch("/payments/initiate", {
            method: "POST",
            body: JSON.stringify({
                orderId: orderId,
                returnUrl: returnUrl
                // Không cần gửi amount vì BE tự lấy từ DB để bảo mật
            }),
        });

        if (!res.ok) {
            let errorMsg = "Failed to initiate payment";
            try {
                const errorJson = await res.json();
                errorMsg = errorJson.message || errorMsg;
            } catch (e) { }
            console.error("[PaymentAPI] Error:", errorMsg);
            throw new Error(errorMsg);
        }

        const data: PaymentResponse = await res.json();
        console.log("[PaymentAPI] Received payment URL:", data.paymentUrl);

        if (!data.paymentUrl) {
            throw new Error("No payment URL returned from server");
        }

        return data.paymentUrl;
    },

    // 2. Xác thực kết quả (Gọi khi User quay về từ VNPAY)
    verifyVnPayCallback: async (params: Record<string, string>): Promise<PaymentResponse> => {
        console.log("[PaymentAPI] Verifying callback with params:", params);

        // Chuyển object params thành query string (vnp_Amount=...&vnp_Code=...)
        const queryString = new URLSearchParams(params).toString();

        const res = await authenticatedFetch(`/payments/vnpay-callback?${queryString}`, {
            method: "GET",
        });

        if (!res.ok) {
            let errorMsg = "Verification failed";
            try {
                const errorJson = await res.json();
                errorMsg = errorJson.message || errorMsg;
            } catch (e) { }
            console.error("[PaymentAPI] Verify Error:", errorMsg);
            throw new Error(errorMsg);
        }

        return await res.json();
    }
};

// Backwards compatibility if needed, or remove if refactoring all calls
export const createVnPayPayment = paymentApi.createVnPayPayment;
