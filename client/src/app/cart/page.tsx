"use client";

import PaymentForm from "@/components/PaymentForm";
import ShippingForm from "@/components/ShippingForm";
import { validateVoucher } from "@/services/api";
import useCartStore from "@/stores/cartStore";
import { VoucherValidationResponse } from "@/types";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight, CheckSquare, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CartPage = () => {
  const {
    cart,
    updateCartItem,
    removeFromCart,
    isLoading,
    selectedItemIds,
    toggleSelection,
    selectAll,
    clearSelection
  } = useCartStore();

  const searchParams = useSearchParams();
  const initialStep = searchParams.get("step") === "2" ? "address" : "cart";
  const [step, setStep] = useState<"cart" | "address" | "payment">(initialStep);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherValidationResponse | null>(null);
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);
  const router = useRouter();

  // Calculate totals based on selection
  const selectedItems = cart.filter(item => selectedItemIds.includes(item.id));
  const selectedSubtotal = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shippingFee = 10; // Hardcoded for now

  const discount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const finalTotal = Math.max(0, selectedSubtotal + shippingFee - discount);

  const isAllSelected = cart.length > 0 && selectedItemIds.length === cart.length;

  const handleQuantityChange = (itemId: number, currentQuantity: number, type: "increment" | "decrement") => {
    if (type === "increment") {
      updateCartItem(itemId, currentQuantity + 1);
    } else {
      if (currentQuantity > 1) {
        updateCartItem(itemId, currentQuantity - 1);
      }
    }
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode) return;
    setIsValidatingVoucher(true);
    try {
      const res = await validateVoucher(voucherCode, selectedSubtotal);
      if (res.valid) {
        setAppliedVoucher(res);
        toast.success("Voucher applied!");
      } else {
        setAppliedVoucher(null);
        toast.error(res.message || "Invalid voucher");
      }
    } catch (error: any) {
      setAppliedVoucher(null);
      toast.error(error.message || "Failed to apply voucher");
    } finally {
      setIsValidatingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode("");
  };

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to checkout");
      return;
    }
    setStep("address");
  };

  if (cart.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500">Looks like you haven't added anything to your cart yet.</p>
        <Link
          href="/products"
          className="mt-4 bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* STEPS */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 'cart' ? 'bg-primary text-white' : 'bg-green-500 text-white'}`}>1</div>
          <span className={`ml-2 font-medium ${step === 'cart' ? 'text-gray-900' : 'text-gray-500'}`}>Cart</span>
        </div>
        <div className={`w-20 h-1 mx-4 ${step !== 'cart' ? 'bg-green-500' : 'bg-gray-200'}`} />
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 'address' ? 'bg-primary text-white' : (step === 'payment' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500')}`}>2</div>
          <span className={`ml-2 font-medium ${step === 'address' ? 'text-gray-900' : 'text-gray-500'}`}>Address</span>
        </div>
        <div className={`w-20 h-1 mx-4 ${step === 'payment' ? 'bg-green-500' : 'bg-gray-200'}`} />
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 'payment' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
          <span className={`ml-2 font-medium ${step === 'payment' ? 'text-gray-900' : 'text-gray-500'}`}>Payment</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {step === "cart" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart ({cart.length} items)</h1>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isAllSelected ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white'}`}>
                    {isAllSelected && <CheckSquare className="w-3.5 h-3.5" />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isAllSelected}
                    onChange={isAllSelected ? clearSelection : selectAll}
                  />
                  <span className="text-sm font-medium text-gray-700">Select All</span>
                </label>
              </div>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className={`flex gap-4 border rounded-2xl p-4 transition-all ${selectedItemIds.includes(item.id) ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white'}`}>
                    {/* Checkbox */}
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleSelection(item.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedItemIds.includes(item.id) ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white'}`}
                      >
                        {selectedItemIds.includes(item.id) && <CheckSquare className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="relative w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <Link href={`/products/${item.productId}`}>
                        <Image src={item.thumbnailUrl} alt={item.productName} fill className="object-cover" />
                      </Link>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/products/${item.productId}`}>
                            <h3 className="font-semibold text-gray-900 hover:text-primary transition-colors">{item.productName}</h3>
                          </Link>
                          <div className="flex gap-2 text-sm text-gray-500 mt-1">
                            {item.color && <span>Color: {item.color}</span>}
                            {item.size && <span>Size: {item.size}</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity, "decrement")}
                            className="p-2 hover:bg-gray-50 text-gray-500"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity, "increment")}
                            className="p-2 hover:bg-gray-50 text-gray-500"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-gray-900">${item.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === "address" && (
            <ShippingForm
              onAddressSelect={(addressId) => {
                setSelectedAddressId(addressId);
                setStep("payment");
              }}
            />
          )}

          {step === "payment" && selectedAddressId && (
            <PaymentForm
              addressId={selectedAddressId}
              voucherCode={appliedVoucher?.voucher?.code}
              selectedItemIds={selectedItemIds}
            />
          )}
        </div>

        {/* RIGHT COLUMN - SUMMARY */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-24 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Selected Items ({selectedItems.length})</span>
                <span>${selectedSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${shippingFee.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* VOUCHER INPUT */}
            {step === "cart" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Voucher Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    disabled={!!appliedVoucher}
                  />
                  {appliedVoucher ? (
                    <button
                      onClick={handleRemoveVoucher}
                      className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyVoucher}
                      disabled={isValidatingVoucher || !voucherCode}
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isValidatingVoucher ? "..." : "Apply"}
                    </button>
                  )}
                </div>
                {appliedVoucher && (
                  <p className="text-xs text-green-600">
                    Voucher applied: {appliedVoucher.voucher?.code} (-${appliedVoucher.discountAmount})
                  </p>
                )}
              </div>
            )}

            {step === "cart" && (
              <button
                onClick={handleProceedToCheckout}
                disabled={selectedItems.length === 0}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout ({selectedItems.length}) <ArrowRight className="w-5 h-5" />
              </button>
            )}

            {step !== "cart" && (
              <button
                onClick={() => setStep(step === 'payment' ? 'address' : 'cart')}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
