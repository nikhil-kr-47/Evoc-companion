"use client";

import React, { useState } from "react";
import {
  Globe,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Tag,
  Lightbulb,
  ShoppingBag,
  ShieldCheck,
  Users,
  Target,
  Zap,
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
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSelectHasWebsite = (hasSite: boolean) => {
    onUpdate({ hasWebsite: hasSite });
    setError(null);
  };

  const handleRunAiAnalysis = async () => {
    if (!data.websiteUrl.trim()) {
      setError("Please enter your website URL first.");
      return;
    }

    let formattedUrl = data.websiteUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
      onUpdate({ websiteUrl: formattedUrl });
    }

    setIsAnalyzing(true);
    setAnalysisProgress(20);
    setError(null);

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 85;
        }
        return prev + 15;
      });
    }, 250);

    try {
      const res = await fetch("/api/analyze-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formattedUrl }),
      });

      const resData = await res.json();
      clearInterval(interval);

      if (resData.success) {
        setAnalysisProgress(100);
        setTimeout(() => {
          onUpdate({ websiteAnalysis: resData.analysis });
          setIsAnalyzing(false);
        }, 300);
      } else {
        setIsAnalyzing(false);
        setError(resData.message || "Failed to analyze website. You can continue or re-check URL.");
      }
    } catch (err: any) {
      clearInterval(interval);
      setIsAnalyzing(false);
      setError("Could not connect to URL analysis engine. You may continue anyway.");
    }
  };

  const handleContinue = () => {
    if (data.hasWebsite === null) {
      setError("Please choose whether your brand has an active website or store.");
      return;
    }
    if (data.hasWebsite && !data.websiteUrl.trim()) {
      setError("Please provide your website address.");
      return;
    }
    if (!data.hasWebsite && (!data.businessDescription || data.businessDescription.trim().length < 15)) {
      setError("Please write at least 1-2 sentences elaborating on your products, services, and USP.");
      return;
    }
    setError(null);
    onNext();
  };

  const analysis = data.websiteAnalysis;

  return (
    <div className="w-full max-w-3xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-medium mb-3">
          <Sparkles size={12} className="text-blue-500" />
          <span>Step 4 • Website &amp; Catalog Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
          Do you have a website?
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Our AI scans your live store, catalog, and positioning to automatically construct high-converting ad hooks.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Notice:</span>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-xs font-semibold opacity-70 hover:opacity-100 cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Choice Buttons: 1 col on mobile, 2 col on tablet/desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => handleSelectHasWebsite(true)}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            data.hasWebsite === true
              ? "bg-slate-50 dark:bg-white/5 border-slate-900 dark:border-white ring-1 ring-slate-900 dark:ring-white text-slate-900 dark:text-white"
              : "bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-400"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                data.hasWebsite === true
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  : "bg-slate-100 dark:bg-white/5 text-slate-500"
              }`}
            >
              <Globe size={16} />
            </span>
            {data.hasWebsite === true && (
              <span className="text-[10px] font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Selected
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Yes, I have a website</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Enter URL for automated deep AI brand, catalog &amp; angle analysis.
          </p>
        </button>

        <button
          type="button"
          onClick={() => handleSelectHasWebsite(false)}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            data.hasWebsite === false
              ? "bg-slate-50 dark:bg-white/5 border-slate-900 dark:border-white ring-1 ring-slate-900 dark:ring-white text-slate-900 dark:text-white"
              : "bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-400"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                data.hasWebsite === false
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  : "bg-slate-100 dark:bg-white/5 text-slate-500"
              }`}
            >
              <FileText size={16} />
            </span>
            {data.hasWebsite === false && (
              <span className="text-[10px] font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Selected
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">No, elaborate manually</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Describe your offering and products in a few sentences.
          </p>
        </button>
      </div>

      {/* Conditional Section A: YES Website */}
      {data.hasWebsite === true && (
        <div className="space-y-4 mb-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 block">
              Enter Your Website / Landing Page URL <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Globe size={17} />
                </div>
                <input
                  type="url"
                  placeholder="https://yourbrand.com"
                  value={data.websiteUrl}
                  onChange={(e) => {
                    onUpdate({ websiteUrl: e.target.value });
                    if (error) setError(null);
                  }}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium placeholder:text-slate-400 outline-none focus:border-blue-600 shadow-xs"
                />
              </div>

              <button
                type="button"
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing || !data.websiteUrl.trim()}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Deep AI Scanning... {analysisProgress}%</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    <span>Run AI Website Audit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Comprehensive AI Intelligence Dossier */}
          {analysis && (
            <div className="p-5 sm:p-6 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 shadow-xs space-y-4 animate-slide-up">
              {/* Header with AI Model Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/80 dark:border-blue-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-blue-950 dark:text-blue-100 flex items-center gap-2">
                      <span>{analysis.brandName}</span>
                      {analysis.businessModel && (
                        <span className="text-[11px] font-semibold px-2 py-0.2 rounded-md bg-white/80 dark:bg-slate-900 text-blue-700 dark:text-blue-300 border border-blue-200">
                          {analysis.businessModel}
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">
                      {analysis.tagline || analysis.domain}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900 border border-blue-200 dark:border-blue-700 text-[10px] font-bold text-blue-800 dark:text-blue-300 self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{analysis.aiProvider || "Evoc AI Deep Intelligence"}</span>
                </div>
              </div>

              {/* Detailed Summary */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                  AI Brand Synthesis
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  {analysis.detailedSummary || analysis.description}
                </p>
              </div>

              {/* Products & USPs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Hero Offerings */}
                {analysis.heroProducts && analysis.heroProducts.length > 0 && (
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-blue-200/60 dark:border-blue-900/50 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1">
                      <ShoppingBag size={12} className="text-blue-600" />
                      <span>Hero Catalog / Offerings</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {analysis.heroProducts.map((p, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-[11px] font-semibold">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detected USPs & Trust Factors */}
                {analysis.uniqueSellingPoints && analysis.uniqueSellingPoints.length > 0 && (
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-blue-200/60 dark:border-blue-900/50 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <ShieldCheck size={12} className="text-emerald-600" />
                      <span>Trust Signals &amp; USPs</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {analysis.uniqueSellingPoints.map((usp, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-[11px] font-semibold">
                          ✓ {usp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Buyer Persona & Target Audience */}
              {analysis.targetAudience && (
                <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-blue-200/60 dark:border-blue-900/50 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1">
                    <Users size={12} className="text-blue-600" />
                    <span>Ideal Buyer Persona Detected</span>
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200">
                    {analysis.targetAudience}
                  </p>
                </div>
              )}

              {/* Ready-to-Use High-CTR Meta Ad Hooks */}
              {analysis.adHooks && (
                <div className="space-y-2 pt-1 border-t border-blue-200/80 dark:border-blue-800/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1">
                    <Zap size={12} className="text-amber-500" />
                    <span>Engineered Meta Ad Hooks &amp; Copy Angles:</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-blue-200/60 text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase text-blue-600 block">1. Problem-Solution</span>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                        {analysis.adHooks.problemSolution}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-blue-200/60 text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase text-purple-600 block">2. Social Proof / Authority</span>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                        {analysis.adHooks.socialProof}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-blue-200/60 text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase text-emerald-600 block">3. Urgency &amp; Offer Hook</span>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                        {analysis.adHooks.offerUrgency}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Conditional Section B: NO Website */}
      {data.hasWebsite === false && (
        <div className="mb-6 p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 space-y-2">
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
            Elaborate on your business <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={4}
            required
            placeholder="Describe what products or services you offer, your ideal buyers, and why customers choose your brand..."
            value={data.businessDescription}
            onChange={(e) => {
              onUpdate({ businessDescription: e.target.value });
              if (error) setError(null);
            }}
            className="w-full p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-normal outline-none focus:border-slate-900 dark:focus:border-white leading-relaxed transition-colors"
          />
        </div>
      )}

      {/* Continue Button */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <span>Continue to Target Audience</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
