"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Check, Copy, MessageCircle, RotateCcw } from "lucide-react";

interface Step8Props {
  referenceId: string;
  data: any;
  onReset: () => void;
}

export default function Step8Success({ referenceId, data, onReset }: Step8Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#10b981", "#000000", "#64748b"],
      });
    } catch {
      // ignore
    }
  }, []);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
  const whatsappPhone = rawPhone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=Hi%20Evoc%20Team,%20I%20just%20submitted%20my%20campaign.%20Ref%20ID:%20${encodeURIComponent(
    referenceId
  )}`;

  return (
    <div className="w-full max-w-md mx-auto text-center animate-slide-up">
      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
        <Check size={28} strokeWidth={2.5} />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
        Campaign Submitted
      </h1>
      <p className="text-slate-500 text-sm mt-1 mb-6">
        Our Meta ad strategists are reviewing your campaign parameters.
      </p>

      {/* Reference Card */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white mb-6 text-left">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
          Reference ID
        </span>
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-semibold text-slate-900">{referenceId}</span>
          <button
            type="button"
            onClick={handleCopyRef}
            className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 cursor-pointer flex items-center gap-1"
          >
            {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* What happens next */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6 text-left text-xs text-slate-600 space-y-2">
        <div className="font-semibold text-slate-900">Next Steps:</div>
        <div className="flex items-start gap-2">
          <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
          <span>We verify your ad account permissions and audience segments.</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
          <span>Campaign preview is shared on your WhatsApp for final go-live confirmation.</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99]"
        >
          <MessageCircle size={17} />
          <span>Chat with Strategist on WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={onReset}
          className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw size={13} />
          <span>Start New Campaign</span>
        </button>
      </div>
    </div>
  );
}
