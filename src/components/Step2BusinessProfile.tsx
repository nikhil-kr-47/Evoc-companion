"use client";

import React, { useState } from "react";
import { ArrowRight, Building2, User, Sparkles, ShieldCheck } from "lucide-react";

interface Step2BusinessProfileProps {
  data: {
    phoneNumber: string;
    businessName: string;
    contactPerson: string;
  };
  onUpdate: (fields: Partial<Step2BusinessProfileProps["data"]>) => void;
  onNext: () => void;
}

export default function Step2BusinessProfile({
  data,
  onUpdate,
  onNext,
}: Step2BusinessProfileProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanBizName = (data.businessName || "").trim();
    const cleanOwner = (data.contactPerson || "").trim();

    if (!cleanBizName || cleanBizName.length < 2) {
      setError("Please enter your business or brand name.");
      return;
    }

    if (!cleanOwner || cleanOwner.length < 2) {
      setError("Please enter the owner or primary contact's name.");
      return;
    }

    setError(null);
    onUpdate({
      businessName: cleanBizName,
      contactPerson: cleanOwner,
    });

    // Update drop-off lead in admin with business & owner details
    fetch("/api/track-step1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber: data.phoneNumber,
        businessName: cleanBizName,
        contactPerson: cleanOwner,
        stepReached: 2,
      }),
    }).catch((err) => console.warn("Step 2 lead update:", err));

    onNext();
  };

  return (
    <div className="w-full animate-slide-up">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-3">
            <Building2 size={13} className="text-blue-500" />
            <span>Brand Identity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tell us about your business
          </h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Enter your business or brand name and the business owner&apos;s name so our Meta strategists can tailor your campaign.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Business / Brand Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Business / Brand Name <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center rounded-xl bg-slate-50/50 border border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs">
              <span className="pl-3.5 pr-2 text-slate-400 flex items-center">
                <Building2 size={17} />
              </span>
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. Nirvana Organics, Urban Kicks"
                value={data.businessName}
                onChange={(e) => {
                  onUpdate({ businessName: e.target.value });
                  if (error) setError(null);
                }}
                className="w-full px-2 py-3 bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium outline-none"
              />
            </div>
          </div>

          {/* Owner / Founder Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Owner / Contact Name <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center rounded-xl bg-slate-50/50 border border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs">
              <span className="pl-3.5 pr-2 text-slate-400 flex items-center">
                <User size={17} />
              </span>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={data.contactPerson}
                onChange={(e) => {
                  onUpdate({ contactPerson: e.target.value });
                  if (error) setError(null);
                }}
                className="w-full px-2 py-3 bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium outline-none"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/25 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>Continue to Campaign Goal</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-500 text-xs">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Your brand and contact info remain private &amp; encrypted.</span>
        </div>
      </div>
    </div>
  );
}
