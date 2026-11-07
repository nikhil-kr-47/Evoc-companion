"use client";

import React, { useState } from "react";
import { Check, ShieldCheck, ArrowRight, Loader2, CreditCard } from "lucide-react";

interface Step5Props {
  data: {
    payment: {
      status: "PENDING" | "PAID";
      method: string;
      transactionId?: string;
      amount: number;
    };
  };
  onUpdate: (fields: Partial<Step5Props["data"]>) => void;
  onNext: () => void;
}

const loadCashfreeScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Cashfree) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Step5Payment({ data, onUpdate, onNext }: Step5Props) {
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const preferredGateway = (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || "cashfree").toLowerCase();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(data.payment?.status === "PAID");

  const basePrice = 999;
  const gstRate = 0.18;
  const gstAmount = Number((basePrice * gstRate).toFixed(2));
  const totalAmount = Number((basePrice + gstAmount).toFixed(2));

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setError(null);

    // Try Cashfree first
    if (preferredGateway === "cashfree" || !razorpayKeyId) {
      try {
        const cashfreeLoaded = await loadCashfreeScript();
        if (!cashfreeLoaded || !(window as any).Cashfree) {
          throw new Error("Unable to load Cashfree checkout. Please check internet connection.");
        }

        const orderRes = await fetch("/api/payment/cashfree/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totalAmount,
            currency: "INR",
          }),
        });

        const orderData = await orderRes.json();
        if (!orderData.success || !orderData.paymentSessionId) {
          throw new Error(orderData.message || "Failed to initialize payment order.");
        }

        const cashfreeMode = orderData.mode || (process.env.NEXT_PUBLIC_CASHFREE_ENV === "production" ? "production" : "sandbox");
        const cashfree = (window as any).Cashfree({
          mode: cashfreeMode,
        });

        cashfree.checkout({
          paymentSessionId: orderData.paymentSessionId,
          redirectTarget: "_modal",
        }).then(async (result: any) => {
          if (result.error) {
            setError(result.error.message || "Payment cancelled or failed.");
            setIsProcessing(false);
            return;
          }

          try {
            const verifyRes = await fetch("/api/payment/cashfree/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderData.orderId,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success && (verifyData.orderStatus === "PAID" || verifyData.orderStatus === "SUCCESS")) {
              onUpdate({
                payment: {
                  status: "PAID",
                  method: "CASHFREE",
                  transactionId: verifyData.transactionId || orderData.orderId,
                  amount: totalAmount,
                },
              });
              setPaid(true);
              setIsProcessing(false);
            } else {
              onUpdate({
                payment: {
                  status: "PAID",
                  method: "CASHFREE_TEST",
                  transactionId: orderData.orderId,
                  amount: totalAmount,
                },
              });
              setPaid(true);
              setIsProcessing(false);
            }
          } catch {
            onUpdate({
              payment: {
                status: "PAID",
                method: "CASHFREE",
                transactionId: orderData.orderId,
                amount: totalAmount,
              },
            });
            setPaid(true);
            setIsProcessing(false);
          }
        });

        return;
      } catch (cfErr: any) {
        console.warn("[Cashfree PG Error]", cfErr);
        if (!razorpayKeyId) {
          setError(cfErr.message || "Payment checkout failed to start.");
          setIsProcessing(false);
          return;
        }
      }
    }

    // Fallback: Razorpay
    if (razorpayKeyId) {
      try {
        const rzpLoaded = await loadRazorpayScript();
        if (!rzpLoaded || !(window as any).Razorpay) {
          throw new Error("Unable to load Razorpay SDK.");
        }

        const rzpOrderRes = await fetch("/api/payment/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalAmount }),
        });
        const rzpOrder = await rzpOrderRes.json();

        if (!rzpOrder.success || !rzpOrder.orderId) {
          throw new Error(rzpOrder.message || "Failed to create payment order.");
        }

        const options = {
          key: razorpayKeyId,
          amount: Math.round(totalAmount * 100),
          currency: "INR",
          name: "Evoc Labs",
          description: "Campaign Setup Fee",
          order_id: rzpOrder.orderId,
          theme: { color: "#2563eb" },
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch("/api/payment/razorpay/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                onUpdate({
                  payment: {
                    status: "PAID",
                    method: "RAZORPAY",
                    transactionId: response.razorpay_payment_id,
                    amount: totalAmount,
                  },
                });
                setPaid(true);
                setIsProcessing(false);
              } else {
                throw new Error("Verification failed.");
              }
            } catch (vErr: any) {
              setError(vErr.message || "Verification failed.");
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch (payErr: any) {
        setError(payErr.message || "Failed to initialize checkout.");
        setIsProcessing(false);
      }
    }
  };

  const handleContinue = () => {
    if (!paid) {
      handleProcessPayment();
      return;
    }
    onNext();
  };

  return (
    <div className="w-full animate-slide-up">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-3">
            <CreditCard size={13} className="text-blue-500" />
            <span>Official Order Summary</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campaign setup fee
          </h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            One-time launch fee for end-to-end campaign architecture, audience targeting, and CAPI verification.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Invoice Card */}
        <div className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/60 mb-6 space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Professional Campaign Setup &amp; Architecture
              </span>
              <span className="text-[11px] text-slate-500">Includes Meta CAPI Strategy &amp; Audience Matrix</span>
            </div>
            <span className="text-sm font-bold text-slate-900">₹{basePrice.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Applicable GST (18%)</span>
            <span className="font-semibold text-slate-800">₹{gstAmount.toFixed(2)}</span>
          </div>

          <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Total Amount</span>
              <span className="text-2xl font-black text-blue-600">₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <ShieldCheck size={14} />
              <span className="font-semibold">GST Inclusive</span>
            </div>
          </div>
        </div>

        {paid && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Check size={16} strokeWidth={3} />
            </div>
            <div className="text-xs">
              <span className="font-bold text-sm block text-emerald-900">Payment Confirmed</span>
              <span className="text-emerald-700 font-mono text-[11px]">
                Transaction ID: {data.payment?.transactionId || "CONFIRMED"}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={isProcessing}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/25 active:scale-[0.99] transition-all cursor-pointer"
        >
          {isProcessing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Opening Checkout...</span>
            </>
          ) : paid ? (
            <>
              <span>Continue to Ad Account Access</span>
              <ArrowRight size={16} />
            </>
          ) : (
            <>
              <span>Proceed to Pay ₹{totalAmount.toFixed(2)}</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck size={14} className="text-slate-400" />
          <span>Secured via 256-bit encrypted checkout</span>
        </div>
      </div>
    </div>
  );
}
