"use client";

import React, { useState } from "react";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

interface Step1Props {
  data: {
    phoneNumber: string;
    businessName?: string;
  };
  onUpdate: (fields: Partial<Step1Props["data"]>) => void;
  onNext: () => void;
}

export default function Step1Business({ data, onUpdate, onNext }: Step1Props) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = (data.phoneNumber || "").replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError(null);
    onUpdate({
      phoneNumber: cleanPhone,
      businessName: data.businessName || `Brand (${cleanPhone.slice(-4)})`,
    });

    // Asynchronously record user as a drop-off lead in admin under companion
    fetch("/api/track-step1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: cleanPhone }),
    }).catch((err) => console.warn("Step 1 lead tracking:", err));

    onNext();
  };

  return (
    <div className="w-full animate-slide-up">
      {/* Elevated Form Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        {/* Header with Minimalist Color Badge */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles size={13} className="text-blue-500" />
            <span>Quick Onboarding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Enter your mobile number
          </h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            We will use your mobile number to configure your Meta advertising profile and send direct WhatsApp updates.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Phone Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center rounded-xl bg-slate-50/50 border border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs">
              <span className="px-3.5 py-3 text-xs font-semibold text-slate-600 border-r border-slate-200/90 bg-slate-100/70 rounded-l-xl select-none flex items-center gap-1">
                <span>🇮🇳</span>
                <span>+91</span>
              </span>
              <input
                type="tel"
                required
                autoFocus
                maxLength={10}
                placeholder="98765 43210"
                value={data.phoneNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  onUpdate({ phoneNumber: val });
                  if (error) setError(null);
                }}
                className="w-full px-4 py-3 bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium outline-none"
              />
            </div>
          </div>

          {/* Minimalist Blue-Indigo Action Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/25 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Minimalist Trust Indicator */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Zero spam • Verified Meta advertising setup</span>
        </div>
      </div>
    </div>
  );
}
