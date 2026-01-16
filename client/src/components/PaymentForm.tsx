"use client";

import { checkout, paymentApi } from "@/services/api";
import useCartStore from "@/stores/cartStore";
import { ArrowRight, Banknote, CreditCard, Loader2, Truck, Wallet, CheckCircle, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface PaymentFormProps {
  addressId: number;
  voucherCode?: string;
  selectedItemIds?: number[];
}

type PaymentMethod = "COD" | "BANKING" | "VNPAY";

const PaymentForm = ({ addressId, voucherCode, selectedItemIds }: PaymentFormProps) => {
  const { handleSubmit } = useForm();
  const router = useRouter();
  const { clearCart, removeFromCart, fetchCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  const onSubmit = async () => {
    if (!addressId) {
      toast.error("Shipping address is missing");
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Create Order
      const order = await checkout({
        addressId,
        paymentMethod,
        voucherCode,
        note: "",
        selectedItemIds,
      });

      // 2. Clear Cart (optimistic)
      if (selectedItemIds && selectedItemIds.length > 0) {
        await fetchCart();
      } else {
        clearCart();
      }

      // 3. Handle Payment Method
      if (paymentMethod === "VNPAY") {
        console.log("[PaymentForm] Selected VNPAY. Order ID:", order.id, "Total:", order.totalAmount);
        toast.info("Redirecting to VNPAY...");

        const paymentUrl = await paymentApi.createVnPayPayment(order.id, order.totalAmount);
        console.log("[PaymentForm] Received payment URL:", paymentUrl);

        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          console.error("[PaymentForm] URL is empty, cannot redirect");
          toast.error("Failed to get payment URL");
          setIsProcessing(false);
        }
        return; // Stop here, redirecting...
      }

      toast.success("Order placed successfully! 🎉");
      router.push("/account/orders");
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
      setIsProcessing(false);
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center gap-3 mb-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Payment Method</h3>
          <p className="text-gray-500 text-sm mt-0.5">Choose how you want to pay</p>
        </div>
      </div>

      <div className="grid gap-4">
        {/* COD */}
        <label
          className={`flex items-center gap-5 p-6 rounded-2xl border-2 cursor-pointer transition-all shadow-sm hover:shadow-lg bg-white ${paymentMethod === "COD"
            ? "border-primary shadow-primary/10"
            : "border-gray-100 hover:border-primary/30"
            }`}
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "COD" ? "border-primary bg-gradient-to-r from-primary to-secondary" : "border-gray-300"
            }`}>
            {paymentMethod === "COD" && (
              <CheckCircle className="w-4 h-4 text-white" />
            )}
          </div>
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
            className="hidden"
          />
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 shadow-sm">
            <Truck className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <span className="text-lg font-bold text-gray-900 block">Cash on Delivery (COD)</span>
            <span className="text-sm text-gray-500 mt-1">Pay when you receive your order at your doorstep</span>
          </div>
        </label>

        {/* VNPAY */}
        <label
          className={`flex items-center gap-5 p-6 rounded-2xl border-2 cursor-pointer transition-all shadow-sm hover:shadow-lg bg-white ${paymentMethod === "VNPAY"
            ? "border-primary shadow-primary/10"
            : "border-gray-100 hover:border-primary/30"
            }`}
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "VNPAY" ? "border-primary bg-gradient-to-r from-primary to-secondary" : "border-gray-300"
            }`}>
            {paymentMethod === "VNPAY" && (
              <CheckCircle className="w-4 h-4 text-white" />
            )}
          </div>
          <input
            type="radio"
            name="paymentMethod"
            value="VNPAY"
            checked={paymentMethod === "VNPAY"}
            onChange={() => setPaymentMethod("VNPAY")}
            className="hidden"
          />
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden p-1">
            {/* VNPAY Logo or Icon */}
            <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs rounded-xl">VNPAY</div>
          </div>
          <div className="flex-1">
            <span className="text-lg font-bold text-gray-900 block flex items-center gap-2">
              VNPAY e-Wallet / QR
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">HOT</span>
            </span>
            <span className="text-sm text-gray-500 mt-1">Scan QR code or use VNPAY app</span>
          </div>
        </label>

        {/* BANKING */}
        <label
          className={`flex items-center gap-5 p-6 rounded-2xl border-2 cursor-pointer transition-all shadow-sm hover:shadow-lg bg-white ${paymentMethod === "BANKING"
            ? "border-primary shadow-primary/10"
            : "border-gray-100 hover:border-primary/30"
            }`}
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "BANKING" ? "border-primary bg-gradient-to-r from-primary to-secondary" : "border-gray-300"
            }`}>
            {paymentMethod === "BANKING" && (
              <CheckCircle className="w-4 h-4 text-white" />
            )}
          </div>
          <input
            type="radio"
            name="paymentMethod"
            value="BANKING"
            checked={paymentMethod === "BANKING"}
            onChange={() => setPaymentMethod("BANKING")}
            className="hidden"
          />
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 shadow-sm">
            <Banknote className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <span className="text-lg font-bold text-gray-900 block">Bank Transfer</span>
            <span className="text-sm text-gray-500 mt-1">Transfer via Mobile Banking App</span>
          </div>
        </label>
      </div>

      {paymentMethod === "BANKING" && (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-blue-900">Bank Account Information</h4>
          </div>
          <div className="space-y-2 text-blue-900">
            <div className="flex justify-between py-2 border-b border-blue-200">
              <span className="font-medium">Bank Name:</span>
              <span className="font-bold">MB Bank</span>
            </div>
            <div className="flex justify-between py-2 border-b border-blue-200">
              <span className="font-medium">Account Number:</span>
              <span className="font-bold font-mono">0000123456789</span>
            </div>
            <div className="flex justify-between py-2 border-b border-blue-200">
              <span className="font-medium">Account Name:</span>
              <span className="font-bold">MEME SHOP</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-blue-700 bg-blue-100 px-3 py-2 rounded-lg">
            💡 <strong>Important:</strong> Please include your phone number in the transfer content for faster verification.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-primary to-secondary text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            {paymentMethod === "VNPAY" ? "Redirecting to VNPAY..." : "Processing Order..."}
          </>
        ) : (
          <>
            {paymentMethod === "VNPAY" ? "Pay with VNPAY" : "Place Order"}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
};

export default PaymentForm;
