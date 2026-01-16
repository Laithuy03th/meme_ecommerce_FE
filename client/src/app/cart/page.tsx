"use client";

import PaymentForm from "@/components/PaymentForm";
import ShippingForm from "@/components/ShippingForm";
import VoucherInput from "@/components/VoucherInput";
import { validateVoucher } from "@/services/api";
import useCartStore from "@/stores/cartStore";
import { VoucherValidationResponse } from "@/types";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight, CheckSquare, Tag, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getSafeImageUrl } from "@/lib/imageUtils";
import SafeImage from "@/components/SafeImage";

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl flex items-center justify-center animate-float">
          <ShoppingBag className="w-16 h-16 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500 text-center max-w-md">Looks like you haven't added anything to your cart yet. Explore our products!</p>
        <Link
          href="/products"
          className="mt-4 bg-gradient-to-r from-primary to-secondary text-white px-10 py-4 rounded-full font-bold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center gap-2 group"
        >
          Start Shopping <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* STEPS */}
      <div className="flex items-center justify-center mb-16">
        <div className="flex items-center">
          <div className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${step === 'cart' ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30' : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/30'}`}>
            1
            {step !== 'cart' && <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>}
          </div>
          <span className={`ml-3 font-bold ${step === 'cart' ? 'text-gray-900' : 'text-gray-500'}`}>Cart</span>
        </div>
        <div className={`w-24 h-1 mx-6 rounded-full transition-all duration-500 ${step !== 'cart' ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-gray-200'}`} />
        <div className="flex items-center">
          <div className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${step === 'address' ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30' : (step === 'payment' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/30' : 'bg-gray-200 text-gray-500')}`}>
            2
            {step === 'payment' && <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>}
          </div>
          <span className={`ml-3 font-bold ${step === 'address' ? 'text-gray-900' : 'text-gray-500'}`}>Address</span>
        </div>
        <div className={`w-24 h-1 mx-6 rounded-full transition-all duration-500 ${step === 'payment' ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-gray-200'}`} />
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${step === 'payment' ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30' : 'bg-gray-200 text-gray-500'}`}>3</div>
          <span className={`ml-3 font-bold ${step === 'payment' ? 'text-gray-900' : 'text-gray-500'}`}>Payment</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {step === "cart" && (
            <>
              <div className="flex items-center justify-between mb-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                  <p className="text-gray-500 mt-1">{cart.length} items in your cart</p>
                </div>
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${isAllSelected ? 'bg-gradient-to-r from-primary to-secondary border-primary scale-110' : 'border-gray-300 bg-white group-hover:border-primary'}`}>
                    {isAllSelected && <CheckSquare className="w-4 h-4 text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isAllSelected}
                    onChange={isAllSelected ? clearSelection : selectAll}
                  />
                  <span className="font-bold text-gray-700 group-hover:text-primary transition-colors">Select All</span>
                </label>
              </div>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className={`flex gap-6 bg-white rounded-2xl p-6 transition-all duration-300 border shadow-sm hover:shadow-lg ${selectedItemIds.includes(item.id) ? 'border-primary shadow-primary/10' : 'border-slate-100 hover:border-primary/30'}`}>
                    {/* Checkbox */}
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleSelection(item.id)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${selectedItemIds.includes(item.id) ? 'bg-gradient-to-r from-primary to-secondary border-primary scale-110' : 'border-slate-300 bg-white hover:border-primary'}`}
                      >
                        {selectedItemIds.includes(item.id) && <CheckSquare className="w-4 h-4 text-white" />}
                      </button>
                    </div>

                    <div className="relative w-28 h-28 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden flex-shrink-0 shadow-md hover:shadow-xl transition-shadow duration-300">
                      <Link href={`/products/${item.productId}`}>
                        <SafeImage
                          src={item.thumbnailUrl}
                          productId={item.productId}
                          productName={item.productName}
                          alt={item.productName}
                          fill
                          className="object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </Link>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/products/${item.productId}`}>
                            <h3 className="text-lg font-bold text-slate-900 hover:text-primary transition-colors line-clamp-1">{item.productName}</h3>
                          </Link>
                          <div className="flex gap-3 text-sm text-slate-500 mt-2">
                            {(item.color || item.size) ? (
                              <>
                                {item.color && <span className="px-2 py-1 bg-slate-100 rounded-lg font-medium">Color: {item.color}</span>}
                                {item.size && <span className="px-2 py-1 bg-slate-100 rounded-lg font-medium">Size: {item.size}</span>}
                              </>
                            ) : (
                              <span className="px-2 py-1 bg-slate-100 rounded-lg font-medium italic">Standard</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-all duration-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity, "decrement")}
                            className="p-2 hover:bg-slate-50 text-slate-600 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-bold text-slate-900 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity, "increment")}
                            className="p-2 hover:bg-slate-50 text-slate-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            {item.totalPrice.toLocaleString('vi-VN')}đ
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-xs text-slate-400 font-medium">
                              {item.unitPrice.toLocaleString('vi-VN')}đ / item
                            </div>
                          )}
                        </div>
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
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 sticky top-24 space-y-6 shadow-2xl shadow-primary/10 border border-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
            </div>

            <div className="space-y-4 text-base">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Selected Items ({selectedItems.length})</span>
                <span className="font-bold text-gray-900">{selectedSubtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Shipping</span>
                <span className="font-bold text-gray-900">{shippingFee.toLocaleString('vi-VN')}đ</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-green-600 font-medium">Discount</span>
                  <span className="font-bold text-green-600">-{discount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-4">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">{finalTotal.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {/* VOUCHER INPUT */}
            {step === "cart" && (
              <div className="pt-6 border-t border-gray-200">
                <VoucherInput
                  cartTotal={selectedSubtotal}
                  onVoucherApplied={(discount, code) => {
                    setAppliedVoucher({
                      valid: true,
                      discountAmount: discount,
                      voucher: { code } as any,
                      message: "Voucher applied successfully"
                    });
                  }}
                />
              </div>
            )}

            {step === "cart" && (
              <button
                onClick={handleProceedToCheckout}
                disabled={selectedItems.length === 0}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                Checkout ({selectedItems.length}) <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {step !== "cart" && (
              <button
                onClick={() => setStep(step === 'payment' ? 'address' : 'cart')}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all"
              >
                ← Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
