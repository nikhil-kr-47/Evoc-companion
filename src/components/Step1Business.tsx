"use client";

import React, { useState } from "react";
import { Building2, User, Phone, Mail, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

interface Step1Props {
  data: {
    businessName: string;
    contactPerson: string;
    phoneNumber: string;
    email: string;
  };
  onUpdate: (fields: Partial<Step1Props["data"]>) => void;
  onNext: () => void;
}

export default function Step1Business({ data, onUpdate, onNext }: Step1Props) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.businessName.trim()) {
      setError("Please enter your business or brand name.");
      return;
    }
    const cleanPhone = data.phoneNumber.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-slide-up">
      {/* Top Title Pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300 text-xs font-semibold mb-3 sm:mb-4">
        <Sparkles size={13} />
        <span>Step 1 • Business Identity</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
        Let’s start with your business basics
      </h1>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 sm:mb-8 leading-relaxed">
        We use this information to customize your ad campaign structure, billing receipts, and audience routing.
      </p>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs flex items-center gap-2 font-medium">
          <span>⚠️ {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Business Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span>Business / Brand Name <span className="text-rose-500">*</span></span>
            <span className="text-[11px] font-normal text-slate-400 hidden sm:inline">e.g. Swarajya Jewels, ZenFit Studio</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Building2 size={17} />
            </div>
            <input
              type="text"
              required
              placeholder="Enter your registered business or brand name"
              value={data.businessName}
              onChange={(e) => {
                onUpdate({ businessName: e.target.value });
                if (error) setError(null);
              }}
              autoFocus
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-medium transition-all outline-none shadow-xs"
            />
          </div>
        </div>

        {/* Contact Person Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Contact Person / Founder Name
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <User size={17} />
            </div>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={data.contactPerson}
              onChange={(e) => onUpdate({ contactPerson: e.target.value })}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-medium transition-all outline-none shadow-xs"
            />
          </div>
        </div>

        {/* Phone / WhatsApp */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span>WhatsApp / Phone Number <span className="text-rose-500">*</span></span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck size={12} /> Instant Campaign Updates
            </span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 flex items-center gap-1 text-slate-600 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700 pr-2.5">
              <Phone size={15} className="text-slate-400" />
              <span className="text-xs font-bold">+91</span>
            </div>
            <input
              type="tel"
              required
              maxLength={10}
              placeholder="95488 33953"
              value={data.phoneNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                onUpdate({ phoneNumber: val });
                if (error) setError(null);
              }}
              className="w-full pl-22 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-medium tracking-wider transition-all outline-none shadow-xs"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span>Email Address <span className="text-rose-500">*</span></span>
            <span className="text-[11px] font-normal text-slate-400">For reports &amp; invoices</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Mail size={17} />
            </div>
            <input
              type="email"
              required
              placeholder="contact@yourbusiness.com"
              value={data.email}
              onChange={(e) => {
                onUpdate({ email: e.target.value });
                if (error) setError(null);
              }}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-medium transition-all outline-none shadow-xs"
            />
          </div>
        </div>

        {/* Submit / Continue Button */}
        <div className="pt-3">
          <button
            type="submit"
            className="w-full py-3.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all transform active:scale-[0.99] cursor-pointer"
          >
            <span>Continue to Campaign Goal</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </form>
    </div>
  );
}
