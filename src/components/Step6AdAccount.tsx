"use client";

import React, { useState } from "react";
import { Check, ArrowRight } from "lucide-react";

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
    <div className="w-full max-w-md mx-auto">
      {/* Title & Description - Left Aligned */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Meta Ad Account
        </h1>
        <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
          Do you already have an active Meta Business Manager or Ad Account?
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Selectable Cards */}
      <div className="space-y-3 mb-6">
        <button
          type="button"
          onClick={() => updateAdAccount({ isReady: true })}
          className={`w-full p-4 rounded-xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
            adAccount.isReady === true
              ? "border-slate-900 bg-slate-50/80 shadow-xs ring-1 ring-slate-900"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div>
            <div className="text-sm font-semibold text-slate-900">Yes, it&apos;s ready</div>
            <div className="text-xs text-slate-500 mt-0.5">I have an active Ad Account</div>
          </div>
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
              adAccount.isReady === true ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white"
            }`}
          >
            {adAccount.isReady === true && <Check size={12} strokeWidth={2.5} />}
          </div>
        </button>

        <button
          type="button"
          onClick={() => updateAdAccount({ isReady: false })}
          className={`w-full p-4 rounded-xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
            adAccount.isReady === false
              ? "border-slate-900 bg-slate-50/80 shadow-xs ring-1 ring-slate-900"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div>
            <div className="text-sm font-semibold text-slate-900">No, need setup assistance</div>
            <div className="text-xs text-slate-500 mt-0.5">Guide me or configure together</div>
          </div>
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
              adAccount.isReady === false ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white"
            }`}
          >
            {adAccount.isReady === false && <Check size={12} strokeWidth={2.5} />}
          </div>
        </button>
      </div>

      {/* When Yes: Ad account details */}
      {adAccount.isReady === true && (
        <div className="mb-6 p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Meta Ad Account ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 123456789012345"
              value={adAccount.accountId}
              onChange={(e) => updateAdAccount({ accountId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 font-mono outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Partner email to add as Advertiser:</span>
              <span className="font-mono font-semibold text-slate-800">contact@evoclabs.com</span>
            </div>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-50 cursor-pointer shadow-xs"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {/* When No: Guide preview */}
      {adAccount.isReady === false && (
        <div className="mb-6 p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2 text-xs text-slate-600">
          <p className="font-semibold text-slate-900">Setup Support Included</p>
          <p className="leading-relaxed">
            Our team will connect with you directly after form submission to set up and verify your Meta Business Account together.
          </p>
        </div>
      )}

      {/* Action Button */}
      <button
        type="button"
        onClick={handleContinue}
        className="w-full py-3.5 px-4 rounded-xl bg-[#111827] hover:bg-black text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
      >
        <span>Continue</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
