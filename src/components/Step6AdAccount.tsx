"use client";

import React, { useState } from "react";
import { Check, ArrowRight, Shield } from "lucide-react";

interface Step6Props {
  data: {
    adAccount: {
      isReady: boolean | null;
      accountId: string;
      accessGranted: boolean;
      needAssistance: boolean;
    };
  };
  onUpdate: (fields: Partial<Step6Props["data"]>) => void;
  onNext: () => void;
}

export default function Step6AdAccount({ data, onUpdate, onNext }: Step6Props) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adAccount = data.adAccount || {
    isReady: null,
    accountId: "",
    accessGranted: false,
    needAssistance: false,
  };

  const updateAdAccount = (partial: Partial<typeof adAccount>) => {
    onUpdate({
      adAccount: {
        ...adAccount,
        ...partial,
      },
    });
    if (error) setError(null);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@evoclabs.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    if (adAccount.isReady === null) {
      setError("Please select an option to continue");
      return;
    }
    if (adAccount.isReady && !adAccount.accountId.trim()) {
      setError("Please enter your Ad Account ID or write 'Pending'");
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <div className="w-full animate-slide-up">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-3">
            <Shield size={13} className="text-blue-500" />
            <span>Meta Permissions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Meta Ad Account
          </h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Do you already have an active Meta Business Manager or Ad Account to run your ads?
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Selection Cards */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => updateAdAccount({ isReady: true })}
            className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
              adAccount.isReady === true
                ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-500/30 shadow-xs"
                : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50/50"
            }`}
          >
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900">
                Yes, my ad account is ready
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                I can provide my account ID and share advertiser access
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                adAccount.isReady === true
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {adAccount.isReady === true && <Check size={12} strokeWidth={3} />}
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateAdAccount({ isReady: false })}
            className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
              adAccount.isReady === false
                ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-500/30 shadow-xs"
                : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50/50"
            }`}
          >
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900">
                No, I need assistance setting up
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Guide me or configure Business Manager together
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                adAccount.isReady === false
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {adAccount.isReady === false && <Check size={12} strokeWidth={3} />}
            </div>
          </button>
        </div>

        {/* When Yes */}
        {adAccount.isReady === true && (
          <div className="mb-6 p-5 rounded-2xl border border-slate-200/90 bg-slate-50/60 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Meta Ad Account ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 123456789012345 or act_123456789"
                value={adAccount.accountId}
                onChange={(e) => updateAdAccount({ accountId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 font-mono outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 bg-white"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Partner email to add as Advertiser:</span>
                <span className="font-mono font-bold text-blue-700">contact@evoclabs.com</span>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs hover:bg-blue-100 cursor-pointer shadow-xs transition-colors"
              >
                {copied ? "Copied" : "Copy Email"}
              </button>
            </div>
          </div>
        )}

        {/* When No */}
        {adAccount.isReady === false && (
          <div className="mb-6 p-5 rounded-2xl border border-slate-200/90 bg-slate-50/60 space-y-2 text-xs text-slate-600">
            <p className="font-bold text-slate-900 text-sm">Guided Setup Support Included</p>
            <p className="leading-relaxed">
              Our onboarding team will connect with you directly on WhatsApp to walk you through creating your Business Manager and setting up your advertising account.
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={handleContinue}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/25 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>Continue to Creatives</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
