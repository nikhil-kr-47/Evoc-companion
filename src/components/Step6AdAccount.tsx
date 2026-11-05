"use client";

import React, { useState } from "react";
import {
  Shield,
  CheckCircle2,
  Copy,
  ExternalLink,
  PlayCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";

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
      setError("Please select whether your Meta Ad Account is ready.");
      return;
    }
    if (adAccount.isReady && !adAccount.accountId.trim()) {
      setError("Please provide your Meta Ad Account ID or enter 'Pending Access'.");
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300 text-xs font-semibold mb-2 sm:mb-3">
          <Sparkles size={13} />
          <span>Step 7 • Meta Access</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Is your Business Manager or Ad Account ready?
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
          We need advertiser permissions to configure campaigns, tracking pixels, and targeting inside your official Meta account.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs flex items-center justify-center gap-2 font-medium">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Primary Yes / No Decision: 1 Col on phone, 2 Col on tablet/laptop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-6">
        <button
          type="button"
          onClick={() => updateAdAccount({ isReady: true })}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            adAccount.isReady === true
              ? "bg-blue-50/90 dark:bg-blue-950/40 border-blue-600 ring-2 ring-blue-500/20 text-slate-900 dark:text-white shadow-sm"
              : "bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                adAccount.isReady === true
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}
            >
              ✓
            </span>
            {adAccount.isReady === true && (
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Selected
              </span>
            )}
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Yes, it&apos;s ready</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            I have an active Ad Account and can share advertiser access.
          </p>
        </button>

        <button
          type="button"
          onClick={() => updateAdAccount({ isReady: false })}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            adAccount.isReady === false
              ? "bg-blue-50/90 dark:bg-blue-950/40 border-blue-600 ring-2 ring-blue-500/20 text-slate-900 dark:text-white shadow-sm"
              : "bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                adAccount.isReady === false
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}
            >
              ✕
            </span>
            {adAccount.isReady === false && (
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Selected
              </span>
            )}
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">No, need tutorial</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Guide me on setting up Meta Business Manager step by step.
          </p>
        </button>
      </div>

      {/* Conditional Branch A: YES -> Enter ID & Send Access */}
      {adAccount.isReady === true && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 mb-6 animate-slide-up">
          <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="text-xs">
              <span className="font-bold text-blue-900 dark:text-blue-300 block">
                Send Partner / Agency Access to our Official Meta Email:
              </span>
              <span className="font-mono text-blue-700 dark:text-blue-400 font-semibold text-sm">
                contact@evoclabs.com
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer self-start sm:self-auto"
            >
              {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              <span>{copied ? "Copied" : "Copy Email"}</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 block">
              Meta Ad Account ID / Act Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. act_123456789012345 or 123456789"
              value={adAccount.accountId}
              onChange={(e) => updateAdAccount({ accountId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-mono outline-none focus:border-blue-600 shadow-xs"
            />
          </div>

          <label className="flex items-center gap-2.5 pt-1 text-xs text-slate-700 dark:text-slate-300 cursor-pointer leading-snug">
            <input
              type="checkbox"
              checked={adAccount.accessGranted}
              onChange={(e) => updateAdAccount({ accessGranted: e.target.checked })}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 shrink-0"
            />
            <span>I have shared Advertiser access to contact@evoclabs.com in Meta Business Manager</span>
          </label>
        </div>
      )}

      {/* Conditional Branch B: NO -> Step-by-Step Video Tutorial */}
      {adAccount.isReady === false && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5 mb-6 animate-slide-up">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              <PlayCircle size={17} className="text-blue-600" />
              <span>Step-by-Step Meta Business Setup Tutorial</span>
            </div>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              4 Min Setup
            </span>
          </div>

          <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="How to create Meta Business Manager and grant ad access"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <p className="font-semibold text-slate-900 dark:text-white">Don&apos;t worry if you get stuck!</p>
            <p className="text-xs leading-relaxed">
              Our team will initiate a screen-share or WhatsApp support call to configure your account together.
            </p>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all transform active:scale-[0.99] cursor-pointer"
        >
          <span>Continue to Creative Assets</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
