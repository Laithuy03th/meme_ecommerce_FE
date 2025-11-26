"use client";

import { PaymentFormInputs, paymentFormSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ShoppingCart, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useCartStore from "@/stores/cartStore";
import { toast } from "react-toastify";

const PaymentForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormInputs>({
    resolver: zodResolver(paymentFormSchema),
  });

  const router = useRouter();
  const { clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentForm: SubmitHandler<PaymentFormInputs> = async (data) => {
    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    clearCart();
    toast.success("Order placed successfully!");
    router.push("/success");
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(handlePaymentForm)}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="cardHolder" className="text-xs text-gray-500 font-medium">
          Name on card
        </label>
        <input
          className="border-b border-gray-200 py-2 outline-none text-sm focus:border-primary transition-colors"
          type="text"
          id="cardHolder"
          placeholder="John Doe"
          {...register("cardHolder")}
        />
        {errors.cardHolder && (
          <p className="text-xs text-red-500">{errors.cardHolder.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="cardNumber" className="text-xs text-gray-500 font-medium">
          Card Number
        </label>
        <input
          className="border-b border-gray-200 py-2 outline-none text-sm focus:border-primary transition-colors"
          type="text"
          id="cardNumber"
          placeholder="1234567891234567"
          maxLength={16}
          {...register("cardNumber")}
        />
        {errors.cardNumber && (
          <p className="text-xs text-red-500">{errors.cardNumber.message}</p>
        )}
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="expirationDate" className="text-xs text-gray-500 font-medium">
            Expiration Date
          </label>
          <input
            className="border-b border-gray-200 py-2 outline-none text-sm focus:border-primary transition-colors"
            type="text"
            id="expirationDate"
            placeholder="MM/YY"
            {...register("expirationDate")}
          />
          {errors.expirationDate && (
            <p className="text-xs text-red-500">{errors.expirationDate.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="cvv" className="text-xs text-gray-500 font-medium">
            CVV
          </label>
          <input
            className="border-b border-gray-200 py-2 outline-none text-sm focus:border-primary transition-colors"
            type="text"
            id="cvv"
            placeholder="123"
            maxLength={3}
            {...register("cvv")}
          />
          {errors.cvv && (
            <p className="text-xs text-red-500">{errors.cvv.message}</p>
          )}
        </div>
      </div>

      <div className='flex items-center gap-2 mt-4'>
        <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-500">VISA</div>
        <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-500">MC</div>
        <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-500">AMEX</div>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-gray-900 hover:bg-black transition-all duration-300 text-white py-3 rounded-xl cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Pay & Place Order
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};

export default PaymentForm;
