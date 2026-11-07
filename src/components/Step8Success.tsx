"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Check, Copy, MessageCircle, RotateCcw, Sparkles, ShieldCheck } from "lucide-react";

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
        particleCount: 60,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#2563eb", "#4f46e5", "#10b981", "#3b82f6"],
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
    <div className="w-full animate-slide-up text-center">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        {/* Animated Badge */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm shadow-emerald-500/10">
          <Check size={32} strokeWidth={3} />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-2">
          <Sparkles size={12} className="text-emerald-500" />
          <span>Synced to Evoc Ops Engine</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Campaign Intake Received!
        </h1>
        <p className="text-slate-500 text-sm mt-2 mb-6 max-w-sm mx-auto leading-relaxed">
          Your parameters and targeting structure have been synced to our internal ad console.
        </p>

        {/* Reference Card */}
        <div className="p-4 rounded-xl border border-blue-200/80 bg-blue-50/50 mb-6 text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
            Campaign Reference ID
          </span>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-sm sm:text-base font-extrabold text-blue-950 truncate">
              {referenceId}
            </span>
            <button
              type="button"
              onClick={handleCopyRef}
              className="px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-50 cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0 transition-colors"
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-6 text-left text-xs text-slate-600 space-y-2.5">
          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-blue-600" />
            <span>What happens next:</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <span className="leading-relaxed">
              Our Meta certified strategists verify your ad account permissions and build your audience segments.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <span className="leading-relaxed">
              Ad preview link and campaign structure are sent directly to your WhatsApp for final go-live signoff.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-emerald-500/20 active:scale-[0.99]"
          >
            <MessageCircle size={18} />
            <span>Connect on WhatsApp with Strategist</span>
          </a>

          <button
            type="button"
            onClick={onReset}
            className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Start Another Campaign</span>
          </button>
        </div>
      </div>
    </div>
  );
}
