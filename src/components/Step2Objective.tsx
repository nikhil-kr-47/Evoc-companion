"use client";

import React, { useState } from "react";
import {
  Target,
  ShoppingBag,
  Sparkles,
  DownloadCloud,
  MessageCircle,
  Globe,
  ArrowRight,
  CheckCircle2,
  Check,
} from "lucide-react";
import {
  CAMPAIGN_OBJECTIVES,
  ObjectiveOption,
} from "@/data/categories";

interface Step2Props {
  data: {
    objective: string;
  };
  onUpdate: (fields: Partial<Step2Props["data"]>) => void;
  onNext: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Target: <Target className="text-blue-600 dark:text-blue-400" size={22} />,
  ShoppingBag: <ShoppingBag className="text-pink-600 dark:text-pink-400" size={22} />,
  Sparkles: <Sparkles className="text-amber-600 dark:text-amber-400" size={22} />,
  DownloadCloud: <DownloadCloud className="text-indigo-600 dark:text-indigo-400" size={22} />,
  MessageCircle: <MessageCircle className="text-emerald-600 dark:text-emerald-400" size={22} />,
  Globe: <Globe className="text-cyan-600 dark:text-cyan-400" size={22} />,
};

const ICON_MAP_COMPACT: Record<string, React.ReactNode> = {
  Target: <Target className="text-blue-600 dark:text-blue-400" size={17} />,
  ShoppingBag: <ShoppingBag className="text-pink-600 dark:text-pink-400" size={17} />,
  Sparkles: <Sparkles className="text-amber-600 dark:text-amber-400" size={17} />,
  DownloadCloud: <DownloadCloud className="text-indigo-600 dark:text-indigo-400" size={17} />,
  MessageCircle: <MessageCircle className="text-emerald-600 dark:text-emerald-400" size={17} />,
  Globe: <Globe className="text-cyan-600 dark:text-cyan-400" size={17} />,
};

export default function Step2Objective({ data, onUpdate, onNext }: Step2Props) {
  const [error, setError] = useState<string | null>(null);

  const handleSelectObjective = (obj: ObjectiveOption) => {
    onUpdate({ objective: obj.id });
    if (error) setError(null);
  };

  const handleContinue = () => {
    if (!data.objective) {
      setError("Please select one primary campaign goal to proceed.");
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-up">
      {/* Top Header - Compact on Phone, Spacious on Desktop */}
      <div className="text-center mb-4 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300 text-xs font-semibold mb-1.5 sm:mb-3">
          <Sparkles size={12} />
          <span>Step 2 • Campaign Objective</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1 sm:mb-2">
          What are you looking for?
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Choose the core business outcome you want Meta&apos;s algorithm to optimize for.
        </p>
      </div>

      {error && (
        <div className="mb-3.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs flex items-center justify-center gap-2 font-medium">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* 1. MOBILE PHONE COMPACT VIEW (<sm): Sleek list items, NO long scrolling */}
      <div className="grid grid-cols-1 gap-2 sm:hidden mb-4">
        {CAMPAIGN_OBJECTIVES.map((obj) => {
          const isSelected = data.objective === obj.id;
          return (
            <button
              key={obj.id}
              type="button"
              onClick={() => handleSelectObjective(obj)}
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-blue-50/95 dark:bg-blue-950/50 border-blue-600 ring-2 ring-blue-500/25 shadow-xs"
                  : "bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {ICON_MAP_COMPACT[obj.iconName] || <Sparkles size={16} />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {obj.title}
                    </span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                      #{obj.number}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
                    {obj.subtitle}
                  </p>
                </div>
              </div>

              {/* Radio Selector Icon */}
              <div className="shrink-0">
                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Check size={12} className="stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. TABLET & LAPTOP GRID VIEW (>=sm): Spacious 2-col and 3-col luxury cards */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 mb-6 sm:mb-8">
        {CAMPAIGN_OBJECTIVES.map((obj) => {
          const isSelected = data.objective === obj.id;
          return (
            <button
              key={obj.id}
              type="button"
              onClick={() => handleSelectObjective(obj)}
              className={`relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer group ${
                isSelected
                  ? "bg-blue-50/90 dark:bg-blue-950/40 border-blue-600 ring-2 ring-blue-500/20 shadow-md shadow-blue-500/10 scale-[1.01]"
                  : "bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                        : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  >
                    {ICON_MAP[obj.iconName] || <Sparkles size={20} />}
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isSelected
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 dark:border-blue-700"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent"
                    }`}
                  >
                    #{obj.number}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center justify-between mb-1">
                  <span>{obj.title}</span>
                  {isSelected && (
                    <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0 ml-1.5" />
                  )}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {obj.subtitle}
                </p>
              </div>

              {/* Tag / Badge */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  {obj.badge}
                </span>
                <span className={`text-xs transition-transform ${isSelected ? "text-blue-600 translate-x-1" : "text-slate-400 group-hover:translate-x-1"}`}>
                  →
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all transform active:scale-[0.99] cursor-pointer"
        >
          <span>Continue to Business Industry</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
