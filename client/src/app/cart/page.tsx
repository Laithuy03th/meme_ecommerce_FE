"use client";

import PaymentForm from "@/components/PaymentForm";
import ShippingForm from "@/components/ShippingForm";
import useCartStore from "@/stores/cartStore";
import { ShippingFormInputs } from "@/types";
import { ArrowRight, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

const steps = [
  { id: 1, title: "Shopping Cart" },
  { id: 2, title: "Shipping Address" },
  { id: 3, title: "Payment Method" },
];

const CartPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [shippingForm, setShippingForm] = useState<ShippingFormInputs>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeStep = parseInt(searchParams.get("step") || "1");
  const { cart, removeFromCart, totalAmount } = useCartStore();

  if (!mounted) return null;

  const subtotal = totalAmount || cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const shippingFee = 10;
  const discount = 0; // Implement logic if needed
  const total = subtotal + shippingFee - discount;

  if (cart.length === 0 && activeStep === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500">Looks like you haven't added anything to your cart yet.</p>
        <Link
          href="/products"
          className="mt-4 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      {/* STEPS INDICATOR */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center gap-2 ${step.id === activeStep ? "text-primary" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step.id === activeStep ? "border-primary bg-primary text-white" :
                  step.id < activeStep ? "border-primary bg-primary text-white" : "border-gray-300"
                  }`}>
                  {step.id < activeStep ? "✓" : step.id}
                </div>
                <span className="font-medium hidden sm:block">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${step.id < activeStep ? "bg-primary" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* MAIN CONTENT */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            {activeStep === 1 ? (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-6 py-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      <Link href={`/products/${item.productId}`}>
                        <Image
                          src={item.thumbnailUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000"}
                          alt={item.productName}
                          fill
                          className="object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </Link>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/products/${item.productId}`} className="hover:text-primary transition-colors">
                            <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                          </Link>
                          <div className="text-sm text-gray-500 mt-1 space-y-1">
                            {item.size && <p>Size: {item.size}</p>}
                            {item.color && <p>Color: {item.color}</p>}
                          </div>
                        </div>
                        <p className="font-bold text-gray-900">${item.totalPrice.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => useCartStore.getState().updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                              className="px-3 py-1 hover:bg-gray-50 transition-colors"
                            >
                              -
                            </button>
                            <span className="px-2 font-medium">{item.quantity}</span>
                            <button
                              onClick={() => useCartStore.getState().updateCartItem(item.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-gray-50 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeStep === 2 ? (
              <ShippingForm setShippingForm={setShippingForm} />
            ) : activeStep === 3 ? (
              shippingForm ? <PaymentForm /> : <p>Please complete shipping details first.</p>
            ) : null}
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${shippingFee.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              {/* Voucher Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Voucher Code"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                />
                <button className="px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
                  Apply
                </button>
              </div>

              <div className="h-px bg-gray-100 my-4" />
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {activeStep === 1 && (
              <button
                onClick={() => router.push("/cart?step=2")}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
              >
                Checkout <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
