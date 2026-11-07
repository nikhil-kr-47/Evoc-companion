"use client";

import React, { useState } from "react";
import { Globe, FileText, Loader2, ArrowRight, Check } from "lucide-react";

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

    // If website is provided and hasn't been scanned yet, trigger scan in background or wait
    if (data.hasWebsite && !data.websiteAnalysis && data.websiteUrl.trim()) {
      await handleRunAiAnalysis();
    }

    setError(null);
    onNext();
  };

  return (
    <div className="w-full max-w-md mx-auto animate-slide-up">
      {/* Title */}
      <div className="text-left mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Do you have a website?
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          We&apos;ll tailor your ad campaign based on your online store or catalog.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium border border-red-100">
          {error}
        </div>
      )}

      {/* Selectable Cards */}
      <div className="space-y-3 mb-6">
        <button
          type="button"
          onClick={() => handleSelectHasWebsite(true)}
          className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
            data.hasWebsite === true
              ? "border-black bg-slate-50/70 shadow-xs"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                data.hasWebsite === true ? "bg-black text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              <Globe size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Yes, I have a website</div>
              <div className="text-xs text-slate-500">Scan domain &amp; catalog automatically</div>
            </div>
          </div>
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
              data.hasWebsite === true ? "border-black bg-black text-white" : "border-slate-300"
            }`}
          >
            {data.hasWebsite === true && <Check size={12} strokeWidth={3} />}
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelectHasWebsite(false)}
          className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
            data.hasWebsite === false
              ? "border-black bg-slate-50/70 shadow-xs"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                data.hasWebsite === false ? "bg-black text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              <FileText size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">No, describe manually</div>
              <div className="text-xs text-slate-500">Write a quick description of your offer</div>
            </div>
          </div>
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
              data.hasWebsite === false ? "border-black bg-black text-white" : "border-slate-300"
            }`}
          >
            {data.hasWebsite === false && <Check size={12} strokeWidth={3} />}
          </div>
        </button>
      </div>

      {/* Conditional Inputs */}
      {data.hasWebsite === true && (
        <div className="mb-6 p-4 rounded-xl border border-slate-200 bg-white space-y-3">
          <label className="text-xs font-semibold text-slate-700 block">
            Website URL
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
              className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 outline-none focus:border-black focus:ring-1 focus:ring-black placeholder:text-slate-400 bg-slate-50/50"
            />
            <button
              type="button"
              onClick={() => handleRunAiAnalysis()}
              disabled={isAnalyzing || !data.websiteUrl.trim()}
              className="px-3.5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 text-xs font-medium cursor-pointer shrink-0"
            >
              {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : "Scan"}
            </button>
          </div>

          {data.websiteAnalysis && (
            <div className="pt-2 text-xs text-slate-600 flex items-center gap-1.5 border-t border-slate-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Catalog ready: <strong>{data.websiteAnalysis.brandName || "Store"}</strong></span>
            </div>
          )}
        </div>
      )}

      {data.hasWebsite === false && (
        <div className="mb-6 p-4 rounded-xl border border-slate-200 bg-white space-y-2">
          <label className="text-xs font-semibold text-slate-700 block">
            Describe your business
          </label>
          <textarea
            rows={3}
            placeholder="e.g. We sell hand-crafted ceramic mugs and home decor items across India..."
            value={data.businessDescription}
            onChange={(e) => onUpdate({ businessDescription: e.target.value })}
            className="w-full p-3 rounded-lg border border-slate-200 text-sm text-slate-900 outline-none focus:border-black focus:ring-1 focus:ring-black placeholder:text-slate-400 bg-slate-50/50 leading-relaxed"
          />
        </div>
      )}

      {/* Single Full-Width Action Button */}
      <button
        type="button"
        onClick={handleContinue}
        disabled={isAnalyzing}
        className="w-full py-3.5 bg-black hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99]"
      >
        <span>Continue</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
