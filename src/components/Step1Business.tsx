"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

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
    onNext();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Title & Description - Left Aligned */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Enter your mobile number
        </h1>
        <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
          Add your mobile number so we know where to share your campaign configuration and WhatsApp updates.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Mobile number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center rounded-xl bg-white border border-slate-300 focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900 transition-colors">
              <span className="px-3 py-2.5 text-xs font-semibold text-slate-600 border-r border-slate-200 bg-slate-50/70 rounded-l-xl select-none">
                +91
              </span>
              <input
                type="tel"
                required
                autoFocus
                maxLength={10}
                placeholder="e.g. 9876543210"
                value={data.phoneNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  onUpdate({ phoneNumber: val });
                  if (error) setError(null);
                }}
                className="w-full px-3.5 py-2.5 bg-transparent text-slate-900 placeholder:text-slate-400 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* Standard Full-width Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 rounded-xl bg-[#111827] hover:bg-black text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <span>Continue</span>
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
