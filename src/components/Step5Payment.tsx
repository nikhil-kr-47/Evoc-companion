"use client";

import React, { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  QrCode,
  Building,
  Lock,
  Sparkles,
} from "lucide-react";

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
  const upiVpa = process.env.NEXT_PUBLIC_UPI_VPA;
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const preferredGateway = (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || "cashfree").toLowerCase();

  const [selectedMethod, setSelectedMethod] = useState<string>(
    data.payment?.method || "UPI"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(data.payment?.status === "PAID");

  const basePrice = 999;
  const gstRate = 0.18;
  const gstAmount = Number((basePrice * gstRate).toFixed(2));
  const totalAmount = Number((basePrice + gstAmount).toFixed(2));

  const handleSelectMethod = (m: string) => {
    setSelectedMethod(m);
    setError(null);
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setError(null);

    // Try Cashfree first (as requested)
    if (preferredGateway === "cashfree" || !razorpayKeyId) {
      try {
        const cashfreeLoaded = await loadCashfreeScript();
        if (!cashfreeLoaded || !(window as any).Cashfree) {
          throw new Error("Unable to load Cashfree checkout SDK. Please verify your connection.");
        }

        // 1. Create order on server via Cashfree
        const orderRes = await fetch("/api/payment/cashfree/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totalAmount,
            customerName: "Evoc Merchant",
            customerEmail: "merchant@evoclabs.com",
            customerPhone: "9876543210",
          }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok || !orderData.success) {
          throw new Error(orderData.message || "Failed to initialize Cashfree payment order.");
        }

        const cashfree = (window as any).Cashfree({
          mode: orderData.environment === "production" ? "production" : "sandbox",
        });

        const checkoutResult = await cashfree.checkout({
          paymentSessionId: orderData.paymentSessionId,
          redirectTarget: "_modal",
        });

        if (checkoutResult?.error) {
          setError(checkoutResult.error.message || "Payment cancelled or dismissed.");
          setIsProcessing(false);
          return;
        }

        // 2. Verify with server
        const verifyRes = await fetch("/api/payment/cashfree/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: orderData.orderId }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success && verifyData.verified) {
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
          return;
        } else {
          throw new Error(verifyData.message || "Payment was not verified by gateway.");
        }
      } catch (cfErr: any) {
        console.warn("[Cashfree attempt failed, checking Razorpay fallback]:", cfErr.message);
        // If razorpay is not configured, show Cashfree error
        if (!razorpayKeyId) {
          setError(cfErr.message || "Payment gateway error.");
          setIsProcessing(false);
          return;
        }
      }
    }

    // Razorpay fallback / alternate
    if (razorpayKeyId) {
      try {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error("Unable to load Razorpay payment SDK.");
        }

        const orderRes = await fetch("/api/payment/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totalAmount,
            receipt: `ord_${Date.now()}`.slice(0, 40),
            notes: { method: selectedMethod },
          }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok || !orderData.success) {
          throw new Error(orderData.message || "Failed to initialize payment order.");
        }

        const options = {
          key: razorpayKeyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "Evoc Companion",
          description: "Meta Ads Launchpad Campaign Setup Fee",
          order_id: orderData.orderId,
          prefill: {
            name: "Evoc Merchant",
            email: "merchant@evoclabs.com",
            contact: "9876543210",
          },
          theme: { color: "#09090b" },
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch("/api/payment/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                onUpdate({
                  payment: {
                    status: "PAID",
                    method: selectedMethod,
                    transactionId: response.razorpay_payment_id,
                    amount: totalAmount,
                  },
                });
                setPaid(true);
                setIsProcessing(false);
              } else {
                throw new Error(verifyData.message || "Payment verification failed.");
              }
            } catch (vErr: any) {
              setError(vErr.message || "Payment verification failed.");
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
        rzp.on("payment.failed", function (response: any) {
          setError(response.error?.description || "Payment failed at gateway.");
          setIsProcessing(false);
        });
        rzp.open();
      } catch (payErr: any) {
        console.error("[Payment checkout error]", payErr);
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
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300 text-xs font-semibold mb-2 sm:mb-3">
          <Sparkles size={13} />
          <span>Step 6 • Campaign Setup Fee</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Make Payment
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
          One-time launch fee for end-to-end campaign architecture, ad targeting, and setup.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs flex items-center justify-center gap-2 font-medium">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Invoice Card */}
      <div className="mb-5 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Official Tax Invoice
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">Evoc Companion Setup</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
            One-Time Setup
          </span>
        </div>

        <div className="py-3.5 space-y-2.5 text-xs sm:text-sm border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex justify-between text-slate-700 dark:text-slate-300">
            <span>Professional Campaign Architecture &amp; CAPI Strategy</span>
            <span className="font-bold text-slate-900 dark:text-white">₹{basePrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500 text-xs">
            <span>Applicable GST (18%)</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">₹{gstAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="pt-3.5 flex items-baseline justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block">Total Payable</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">₹{totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck size={14} />
            <span>Inclusive of 18% GST</span>
          </div>
        </div>
      </div>

      {/* Features Included */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5 text-xs text-slate-700 dark:text-slate-300">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span className="font-medium">24-48h Kickoff</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span className="font-medium">Meta CAPI Verification</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span className="font-medium">Audience Matrix</span>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs mb-6 space-y-3.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Lock size={14} className="text-blue-600" />
            <span>Select Payment Mode <span className="text-rose-500">*</span></span>
          </span>
          {selectedMethod && (
            <span className="text-xs text-blue-600 font-semibold">{selectedMethod}</span>
          )}
        </label>

        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => handleSelectMethod("UPI")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedMethod === "UPI"
                ? "bg-blue-50 border-blue-600 text-blue-700 font-bold"
                : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300"
            }`}
          >
            <QrCode size={18} />
            <span className="text-xs">UPI / QR</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectMethod("CARD")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedMethod === "CARD"
                ? "bg-blue-50 border-blue-600 text-blue-700 font-bold"
                : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300"
            }`}
          >
            <CreditCard size={18} />
            <span className="text-xs">Cards</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectMethod("NETBANKING")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedMethod === "NETBANKING"
                ? "bg-blue-50 border-blue-600 text-blue-700 font-bold"
                : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300"
            }`}
          >
            <Building size={18} />
            <span className="text-xs">NetBanking</span>
          </button>
        </div>

        {/* UPI Details or Simulated Pay */}
        {selectedMethod && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            {paid ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-2.5">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold block">Payment Confirmed (₹{totalAmount.toFixed(2)})</span>
                  <span className="text-[11px] text-emerald-700 font-mono">
                    Txn ID: {data.payment?.transactionId || "TXN_EVOC_VERIFIED"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Secured Checkout:{" "}
                  <strong className="text-slate-900 dark:text-white font-medium">
                    {preferredGateway === "cashfree" ? "Cashfree PG Verified" : "Razorpay Verified"}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  {isProcessing ? "Opening Checkout..." : `Pay ₹${totalAmount.toFixed(2)}`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Continue Button */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all transform active:scale-[0.99] cursor-pointer"
        >
          <span>{paid ? "Continue to Ad Account Access" : "Proceed with Payment"}</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
