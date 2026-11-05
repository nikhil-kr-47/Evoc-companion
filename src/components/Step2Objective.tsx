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
      {/* Top Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300 text-xs font-semibold mb-2 sm:mb-3">
          <Sparkles size={13} />
          <span>Step 2 • Campaign Objective</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          What are you looking for?
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Choose the core business outcome you want Meta&apos;s algorithm to optimize for.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs flex items-center justify-center gap-2 font-medium">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* 6 Objective Cards Grid - 1 Col on Mobile (Comfortable & Clean), 2 Col on Tablet, 3 Col on Laptop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 mb-6 sm:mb-8">
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
