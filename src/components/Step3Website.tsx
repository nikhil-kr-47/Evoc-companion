"use client";

import React, { useState } from "react";
import {
  Globe,
  FileText,
  Loader2,
  ArrowRight,
  Check,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Target,
  Zap,
  RefreshCw,
  ExternalLink,
  Tag,
} from "lucide-react";

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

  const analysis = data.websiteAnalysis;

  return (
    <div className="w-full animate-slide-up">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
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
            Our AI scans your live store to automatically extract your products, value propositions, and high-converting ad hooks.
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
                  Scan catalog, products, and hooks automatically with AI
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

        {/* Conditional Input A: Website URL & AI Dossier */}
        {data.hasWebsite === true && (
          <div className="mb-6 space-y-4">
            <div className="p-4 sm:p-5 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Website URL <span className="text-rose-500">*</span>
                </label>
                {analysis && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    AI Intelligence Synced
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  placeholder="e.g. yourbrand.com"
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
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer shrink-0 transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Scanning Store...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>{analysis ? "Re-scan Website" : "Analyze Store"}</span>
                    </>
                  )}
                </button>
              </div>

              {isAnalyzing && (
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/60 flex items-center gap-3 animate-pulse">
                  <Loader2 size={18} className="animate-spin text-blue-600 shrink-0" />
                  <div className="text-xs text-blue-900">
                    <p className="font-semibold">AI Agent analyzing your store...</p>
                    <p className="text-blue-700 text-[11px] mt-0.5">
                      Extracting hero products, brand positioning, trust signals, and Meta ad angles.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* AI EXTRACTED DOSSIER DETAILS (Rendered when analysis exists) */}
            {analysis && (
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50/80 to-white p-4 sm:p-6 space-y-5 shadow-xs">
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        {analysis.brandName || "Discovered Brand"}
                      </span>
                      {analysis.domain && (
                        <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                          ({analysis.domain})
                        </span>
                      )}
                    </div>
                    {analysis.tagline && (
                      <p className="text-xs text-slate-600 font-medium italic mt-0.5">
                        &ldquo;{analysis.tagline}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {analysis.businessModel && (
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                        {analysis.businessModel}
                      </span>
                    )}
                    {analysis.brandVibe && (
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                        {analysis.brandVibe}
                      </span>
                    )}
                    {analysis.aiProvider && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200">
                        {analysis.aiProvider}
                      </span>
                    )}
                  </div>
                </div>

                {/* Synthesis & Summary */}
                {(analysis.detailedSummary || analysis.description) && (
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                      <FileText size={13} className="text-blue-500" />
                      <span>Executive Synthesis</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                      {analysis.detailedSummary || analysis.description}
                    </div>
                  </div>
                )}

                {/* 2-Column Grid: Hero Products & Value Propositions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Hero Products */}
                  {analysis.heroProducts && analysis.heroProducts.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                          <ShoppingBag size={13} className="text-indigo-600" />
                          <span>Identified Hero Products</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.heroProducts.map((prod, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200/60"
                            >
                              <Tag size={10} className="text-slate-400" />
                              <span>{prod}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* USPs & Trust Triggers */}
                  {analysis.uniqueSellingPoints && analysis.uniqueSellingPoints.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                          <ShieldCheck size={13} className="text-emerald-600" />
                          <span>Key USPs &amp; Trust Signals</span>
                        </div>
                        <div className="space-y-1.5">
                          {analysis.uniqueSellingPoints.map((usp, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                <Check size={10} strokeWidth={3} />
                              </span>
                              <span>{usp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Target Audience Profile */}
                {analysis.targetAudience && (
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/80">
                    <div className="text-[11px] uppercase tracking-wider font-bold text-slate-600 mb-1 flex items-center gap-1.5">
                      <Target size={13} className="text-rose-500" />
                      <span>Target Audience Profile</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {analysis.targetAudience}
                    </p>
                  </div>
                )}

                {/* Meta Ad Hooks (Copy Angles Engineered by AI) */}
                {analysis.adHooks && (
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-bold text-slate-600 mb-2.5 flex items-center gap-1.5">
                      <Zap size={13} className="text-amber-500" />
                      <span>Pre-Engineered Meta Ad Hooks</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {/* Hook 1: Problem-Solution */}
                      {analysis.adHooks.problemSolution && (
                        <div className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/70 text-xs">
                          <div className="font-bold text-amber-900 text-[11px] mb-1 flex items-center gap-1">
                            <span>💡 Problem - Solution</span>
                          </div>
                          <p className="text-slate-700 leading-snug">
                            &ldquo;{analysis.adHooks.problemSolution}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Hook 2: Social Proof */}
                      {analysis.adHooks.socialProof && (
                        <div className="p-3 rounded-xl bg-blue-50/40 border border-blue-200/70 text-xs">
                          <div className="font-bold text-blue-900 text-[11px] mb-1 flex items-center gap-1">
                            <span>⭐ Social Proof / Trust</span>
                          </div>
                          <p className="text-slate-700 leading-snug">
                            &ldquo;{analysis.adHooks.socialProof}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Hook 3: Offer & Urgency */}
                      {analysis.adHooks.offerUrgency && (
                        <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200/70 text-xs">
                          <div className="font-bold text-emerald-900 text-[11px] mb-1 flex items-center gap-1">
                            <span>⚡ Offer &amp; Urgency</span>
                          </div>
                          <p className="text-slate-700 leading-snug">
                            &ldquo;{analysis.adHooks.offerUrgency}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer of Dossier */}
                <div className="pt-2 text-center">
                  <p className="text-[11px] text-slate-400">
                    These insights are utilized automatically to configure your Meta pixel events, target audiences, and creative hooks.
                  </p>
                </div>
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
              rows={4}
              placeholder="e.g. We sell premium organic matcha green tea and artisanal ceramic cups sourced directly from Kyoto. Our core offering is a starter kit designed for health-conscious professionals..."
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