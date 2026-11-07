"use client";

import React, { useState } from "react";
import { Globe, FileText, Loader2, ArrowRight, Check, Sparkles } from "lucide-react";

interface WebsiteAnalysis {
  domain: string;
  brandName: string;
  tagline?: string;
  businessModel?: string;
  brandVibe: string;
  description: string;
  detailedSummary?: string;
  heroProducts?: string[];
  uniqueSellingPoints?: string[];
  targetAudience?: string;
  detectedKeywords?: string[];
  adHooks?: {
    problemSolution: string;
    socialProof: string;
    offerUrgency: string;
  };
  recommendedFormat?: string;
  adAngles?: string[];
  aiProvider?: string;
}

interface Step3Props {
  data: {
    hasWebsite: boolean | null;
    websiteUrl: string;
    websiteAnalysis: WebsiteAnalysis | null;
    businessDescription: string;
  };
  onUpdate: (fields: Partial<Step3Props["data"]>) => void;
  onNext: () => void;
}

export default function Step3Website({ data, onUpdate, onNext }: Step3Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectHasWebsite = (hasSite: boolean) => {
    onUpdate({ hasWebsite: hasSite });
    setError(null);
  };

  const handleRunAiAnalysis = async (urlToScan?: string) => {
    const rawUrl = urlToScan || data.websiteUrl;
    if (!rawUrl.trim()) return;

    let formattedUrl = rawUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
      onUpdate({ websiteUrl: formattedUrl });
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formattedUrl }),
      });

      const resData = await res.json();
      if (resData.success && resData.analysis) {
        onUpdate({ websiteAnalysis: resData.analysis });
      }
    } catch (err: any) {
      console.warn("Scan warning:", err?.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContinue = async () => {
    if (data.hasWebsite === null) {
      setError("Please select an option to continue");
      return;
    }
    if (data.hasWebsite && !data.websiteUrl.trim()) {
      setError("Please enter your website URL");
      return;
    }
    if (!data.hasWebsite && (!data.businessDescription || data.businessDescription.trim().length < 5)) {
      setError("Please write a few words about your offering");
      return;
    }

    if (data.hasWebsite && !data.websiteAnalysis && data.websiteUrl.trim()) {
      await handleRunAiAnalysis();
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
            <Sparkles size={13} className="text-blue-500" />
            <span>Store &amp; Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Do you have a website?
          </h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            We will scan your live store to automatically configure high-converting ad hooks, or you can describe your products manually.
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
            onClick={() => handleSelectHasWebsite(true)}
            className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
              data.hasWebsite === true
                ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-500/30 shadow-xs"
                : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50/50"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  data.hasWebsite === true
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <Globe size={20} />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-slate-900">
                  Yes, I have an active store or website
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Scan catalog, products, and angles automatically
                </div>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                data.hasWebsite === true
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {data.hasWebsite === true && <Check size={12} strokeWidth={3} />}
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectHasWebsite(false)}
            className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
              data.hasWebsite === false
                ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-500/30 shadow-xs"
                : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50/50"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  data.hasWebsite === false
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <FileText size={20} />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-slate-900">
                  No, describe my products manually
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Write a short summary of what you are selling
                </div>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                data.hasWebsite === false
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {data.hasWebsite === false && <Check size={12} strokeWidth={3} />}
            </div>
          </button>
        </div>

        {/* Conditional Input A: Website URL */}
        {data.hasWebsite === true && (
          <div className="mb-6 p-4 sm:p-5 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Website URL <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="e.g. mybrand.com"
                value={data.websiteUrl}
                onChange={(e) => onUpdate({ websiteUrl: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleRunAiAnalysis();
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400 bg-white"
              />
              <button
                type="button"
                onClick={() => handleRunAiAnalysis()}
                disabled={isAnalyzing || !data.websiteUrl.trim()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer shrink-0 transition-colors shadow-xs"
              >
                {isAnalyzing ? <Loader2 size={15} className="animate-spin" /> : "Scan Domain"}
              </button>
            </div>

            {data.websiteAnalysis && (
              <div className="pt-2 text-xs text-slate-700 flex items-center gap-2 border-t border-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>
                  Catalog extracted: <strong>{data.websiteAnalysis.brandName || "Store verified"}</strong>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Conditional Input B: Manual Description */}
        {data.hasWebsite === false && (
          <div className="mb-6 p-4 sm:p-5 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Describe your business <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. We sell premium organic matcha green tea and artisanal ceramic cups sourced directly from Kyoto..."
              value={data.businessDescription}
              onChange={(e) => onUpdate({ businessDescription: e.target.value })}
              className="w-full p-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400 bg-white leading-relaxed"
            />
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={isAnalyzing}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/25 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
