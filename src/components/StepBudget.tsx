"use client";

import React, { useState } from "react";
import {
  Coins,
  Sparkles,
  ArrowRight,
  Check,
  TrendingUp,
  Info,
  Sliders,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export interface BudgetData {
  type: "RECOMMENDED" | "CUSTOM";
  dailyBudget: number;
  monthlyEstimate: number;
  tierName?: string;
  customAmount?: string;
}

interface StepBudgetProps {
  data: {
    budget?: BudgetData;
    objective?: string;
  };
  onUpdate: (fields: { budget: BudgetData }) => void;
  onNext: () => void;
}

const RECOMMENDED_TIERS = [
  {
    id: "STARTER",
    name: "Starter Growth",
    daily: 500,
    tagline: "Ideal for initial testing, catalog validation & direct inquiries",
    estimatedReach: "2,200 - 3,800 people / day",
    isRecommended: false,
  },
  {
    id: "SCALE",
    name: "Scale Advantage",
    daily: 1000,
    tagline: "Optimal for rapid Meta Advantage+ learning exit and lowest cost-per-lead",
    estimatedReach: "4,800 - 8,200 people / day",
    isRecommended: true,
  },
  {
    id: "GROWTH",
    name: "High Velocity",
    daily: 2000,
    tagline: "Maximum aggressive scaling across Facebook, Instagram Reels & Stories",
    estimatedReach: "10,500 - 18,000 people / day",
    isRecommended: false,
  },
];

const CUSTOM_PRESETS = [300, 500, 800, 1200, 2500, 5000];

export default function StepBudget({ data, onUpdate, onNext }: StepBudgetProps) {
  const currentBudget: BudgetData = data.budget || {
    type: "RECOMMENDED",
    dailyBudget: 1000,
    monthlyEstimate: 30000,
    tierName: "Scale Advantage",
    customAmount: "",
  };

  const [budgetType, setBudgetType] = useState<"RECOMMENDED" | "CUSTOM">(
    currentBudget.type || "RECOMMENDED"
  );
  const [selectedTierDaily, setSelectedTierDaily] = useState<number>(
    currentBudget.dailyBudget || 1000
  );
  const [customDailyInput, setCustomDailyInput] = useState<string>(
    currentBudget.customAmount || (currentBudget.type === "CUSTOM" ? String(currentBudget.dailyBudget) : "600")
  );
  const [error, setError] = useState<string | null>(null);

  const handleSelectTier = (tier: typeof RECOMMENDED_TIERS[0]) => {
    setSelectedTierDaily(tier.daily);
    setBudgetType("RECOMMENDED");
    setError(null);
    onUpdate({
      budget: {
        type: "RECOMMENDED",
        dailyBudget: tier.daily,
        monthlyEstimate: tier.daily * 30,
        tierName: tier.name,
        customAmount: "",
      },
    });
  };

  const handleCustomDailyChange = (valStr: string) => {
    const numericStr = valStr.replace(/\D/g, "");
    setCustomDailyInput(numericStr);
    setBudgetType("CUSTOM");
    if (error) setError(null);

    const val = parseInt(numericStr, 10);
    if (!isNaN(val) && val >= 100) {
      onUpdate({
        budget: {
          type: "CUSTOM",
          dailyBudget: val,
          monthlyEstimate: val * 30,
          tierName: "Custom Budget",
          customAmount: numericStr,
        },
      });
    }
  };

  const handlePresetSelect = (preset: number) => {
    setCustomDailyInput(String(preset));
    setBudgetType("CUSTOM");
    setError(null);
    onUpdate({
      budget: {
        type: "CUSTOM",
        dailyBudget: preset,
        monthlyEstimate: preset * 30,
        tierName: "Custom Budget",
        customAmount: String(preset),
      },
    });
  };

  const handleContinue = () => {
    if (budgetType === "CUSTOM") {
      const val = parseInt(customDailyInput, 10);
      if (isNaN(val) || val < 200) {
        setError("Meta requires a minimum daily ad spend of ₹200 / day.");
        return;
      }
      onUpdate({
        budget: {
          type: "CUSTOM",
          dailyBudget: val,
          monthlyEstimate: val * 30,
          tierName: "Custom Budget",
          customAmount: customDailyInput,
        },
      });
    } else {
      const tier = RECOMMENDED_TIERS.find((t) => t.daily === selectedTierDaily) || RECOMMENDED_TIERS[1];
      onUpdate({
        budget: {
          type: "RECOMMENDED",
          dailyBudget: tier.daily,
          monthlyEstimate: tier.daily * 30,
          tierName: tier.name,
          customAmount: "",
        },
      });
    }

    setError(null);
    onNext();
  };

  const activeDaily =
    budgetType === "RECOMMENDED"
      ? selectedTierDaily
      : parseInt(customDailyInput, 10) || 500;
  const activeMonthly = activeDaily * 30;

  return (
    <div className="w-full animate-slide-up">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-3">
            <Coins size={13} className="text-blue-500" />
            <span>Campaign Ad Spend</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Set your daily ad budget
          </h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Select an algorithm-calibrated recommended budget or define your own custom daily spend for Meta Ads.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Mode Switch Tabs: Recommended vs Custom */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setBudgetType("RECOMMENDED");
              setError(null);
            }}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              budgetType === "RECOMMENDED"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles size={13} className={budgetType === "RECOMMENDED" ? "text-blue-600" : "text-slate-400"} />
            <span>Our Recommended</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setBudgetType("CUSTOM");
              setError(null);
            }}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              budgetType === "CUSTOM"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sliders size={13} className={budgetType === "CUSTOM" ? "text-blue-600" : "text-slate-400"} />
            <span>Custom Budget</span>
          </button>
        </div>

        {/* SECTION 1: RECOMMENDED BUDGET TIERS */}
        {budgetType === "RECOMMENDED" && (
          <div className="space-y-3 mb-6">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Select Calibrated Tier</span>
              <span className="text-[11px] text-emerald-600 font-semibold normal-case flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>Meta ML Calibrated</span>
              </span>
            </div>

            {RECOMMENDED_TIERS.map((tier) => {
              const isSelected = selectedTierDaily === tier.daily;
              return (
                <div
                  key={tier.id}
                  onClick={() => handleSelectTier(tier)}
                  className={`p-4 sm:p-4.5 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-500/30 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm sm:text-base">
                          {tier.name}
                        </span>
                        {tier.isRecommended && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {tier.tagline}
                      </p>
                      <div className="mt-2 text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                        <TrendingUp size={12} className="text-blue-600" />
                        <span>Est. Reach: {tier.estimatedReach}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base sm:text-lg font-black text-slate-900">
                        ₹{tier.daily.toLocaleString()}
                        <span className="text-xs font-normal text-slate-500"> /day</span>
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                        ~₹{(tier.daily * 30).toLocaleString()}/mo
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SECTION 2: CUSTOM BUDGET (USER'S OWN SIDE) */}
        {budgetType === "CUSTOM" && (
          <div className="mb-6 space-y-4">
            <div className="p-4 sm:p-5 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Enter Daily Budget (₹) <span className="text-rose-500">*</span>
              </label>

              <div className="flex items-center rounded-xl bg-white border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs">
                <span className="pl-4 pr-1 text-slate-600 font-bold text-base sm:text-lg select-none">
                  ₹
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="500"
                  value={customDailyInput}
                  onChange={(e) => handleCustomDailyChange(e.target.value)}
                  className="w-full px-2 py-3 bg-transparent text-slate-900 font-bold text-base sm:text-lg outline-none"
                />
                <span className="pr-4 text-xs font-semibold text-slate-500 select-none">
                  / day
                </span>
              </div>

              {/* Quick Presets */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                  Quick Select Presets:
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {CUSTOM_PRESETS.map((preset) => {
                    const isSelected = parseInt(customDailyInput, 10) === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handlePresetSelect(preset)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-2xs"
                            : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        ₹{preset.toLocaleString()}/day
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Spend & Reach Summary Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/70 mb-5">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-blue-200/60">
            <span className="text-slate-600 font-medium">Selected Daily Budget:</span>
            <span className="font-extrabold text-blue-900">
              ₹{activeDaily.toLocaleString()} / day
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2">
            <span className="text-slate-600 font-medium">30-Day Estimated Meta Spend:</span>
            <span className="font-extrabold text-slate-900">
              ₹{activeMonthly.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Clarity / Transparency Notice */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1 mb-6">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Info size={13} className="text-blue-600 shrink-0" />
            <span>How ad billing works:</span>
          </div>
          <p className="leading-relaxed">
            Your daily ad spend is billed <strong>directly by Meta</strong> inside your own ad account as ads run. The next step is the one-time campaign architecture &amp; setup fee of ₹999 (+GST).
          </p>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={handleContinue}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/25 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>Continue to Setup Fee</span>
          <ArrowRight size={16} />
        </button>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-500 text-xs">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>You can adjust or pause your daily ad budget anytime in Ads Manager.</span>
        </div>
      </div>
    </div>
  );
}
