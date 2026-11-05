"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  RotateCcw,
  Clock,
  Sparkles,
  Layers,
  ShieldCheck,
} from "lucide-react";

interface Step8Props {
  referenceId: string;
  data: any;
  onReset: () => void;
}

export default function Step8Success({ referenceId, data, onReset }: Step8Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#2563eb", "#3b82f6", "#10b981"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#2563eb", "#3b82f6", "#10b981"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanPhone = (data.phoneNumber || "").replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/919876543210?text=Hi%20Evoc%20Team,%20I%20just%20submitted%20campaign%20intake%20with%20Ref%20ID:%20${referenceId}.%20Business:%20${encodeURIComponent(
    data.businessName || "My Business"
  )}`;

  return (
    <div className="w-full max-w-xl mx-auto text-center animate-slide-up">
      {/* Success Animated Badge */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/10">
        <CheckCircle2 size={40} className="stroke-[2.5]" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
        <Sparkles size={12} />
        <span>Campaign Transmitted to Evoc Hub</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
        Setup Received Successfully!
      </h1>
      <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-4">
        Your campaign configuration has been synced to our internal CRM console. Our Meta ad strategists are reviewing your parameters.
      </p>

      {/* Reference ID Card */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-4 text-left space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
          Your Campaign Reference ID
        </span>
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 font-mono text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300">
          <span>{referenceId}</span>
          <button
            type="button"
            onClick={handleCopyRef}
            className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 dark:text-blue-300 px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-blue-200 shadow-xs"
          >
            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Next Steps Timeline */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-5 text-left space-y-2.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
          What Happens Next?
        </span>

        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
              1
            </span>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Account &amp; Pixel Validation</p>
              <p className="text-[11px] text-slate-500">We verify your Ad Account ID and ensure pixel tracking events fire accurately.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
              2
            </span>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Creative &amp; Copy Sequencing</p>
              <p className="text-[11px] text-slate-500">Ad copies and creative hooks are prepared for your target audience.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
              3
            </span>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Live Campaign Kickoff</p>
              <p className="text-[11px] text-slate-500">Campaign goes live in 24-48 hours with automated daily conversion monitoring.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Contact Buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5 justify-center mb-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <MessageCircle size={15} />
          <span>Chat with Strategist on WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <RotateCcw size={13} />
          <span>Submit Another Campaign</span>
        </button>
      </div>
    </div>
  );
}
