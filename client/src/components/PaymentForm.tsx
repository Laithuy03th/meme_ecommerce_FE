"use client";

import { checkout } from "@/services/api";
import useCartStore from "@/stores/cartStore";
import { ArrowRight, Banknote, CreditCard, Loader2, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface PaymentFormProps {
  addressId: number;
  voucherCode?: string;
  selectedItemIds?: number[];
}

type PaymentMethod = "COD" | "BANKING";

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
      await checkout({
        addressId,
        paymentMethod,
        voucherCode,
        note: "", // Add note field if needed
        selectedItemIds,
      });

      // If selectedItemIds provided, remove only those. Otherwise clear cart.
      if (selectedItemIds && selectedItemIds.length > 0) {
        // Remove selected items one by one (or implement bulk remove in store)
        // Since we don't have bulk remove, we can just fetchCart to sync with backend
        // assuming backend removes them from cart upon checkout.
        // But if backend doesn't support partial checkout natively and we are just sending IDs,
        // we might need to manually remove them if backend logic is "create order from these items".
        // Let's assume backend handles cart cleanup if it supports checkout.
        // If backend is standard, checkout usually clears the cart or the items ordered.
        // So fetching cart is safest.
        await fetchCart();
      } else {
        clearCart();
      }

      toast.success("Order placed successfully! 🎉");
      router.push("/account/orders"); // Redirect to orders page
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-lg font-semibold text-gray-900">Select Payment Method</h3>

      <div className="grid gap-4">
        <label
          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "COD"
            ? "border-primary bg-primary/5"
            : "border-gray-100 hover:border-gray-200"
            }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
            className="w-5 h-5 text-primary focus:ring-primary"
          />
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
            <Truck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="font-bold text-gray-900 block">Cash on Delivery (COD)</span>
            <span className="text-sm text-gray-500">Pay when you receive your order</span>
          </div>
        </label>

        <label
          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "BANKING"
            ? "border-primary bg-primary/5"
            : "border-gray-100 hover:border-gray-200"
            }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="BANKING"
            checked={paymentMethod === "BANKING"}
            onChange={() => setPaymentMethod("BANKING")}
            className="w-5 h-5 text-primary focus:ring-primary"
          />
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
            <Banknote className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="font-bold text-gray-900 block">Bank Transfer</span>
            <span className="text-sm text-gray-500">Transfer via QR Code or Bank App</span>
          </div>
        </label>
      </div>

      {paymentMethod === "BANKING" && (
        <div className="p-4 bg-blue-50 text-blue-800 rounded-xl text-sm">
          <p className="font-semibold mb-1">Bank Account Info:</p>
          <p>Bank: MB Bank</p>
          <p>Account No: 0000123456789</p>
          <p>Name: MEME SHOP</p>
          <p className="mt-2 text-xs opacity-80">Please include your phone number in the transfer content.</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-gray-900 hover:bg-black transition-all duration-300 text-white py-4 rounded-xl cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing Order...
          </>
        ) : (
          <>
            Place Order
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};

export default PaymentForm;
