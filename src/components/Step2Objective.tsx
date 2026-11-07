"use client";

import React, { useState } from "react";
import { ArrowRight, Check, Target } from "lucide-react";
import { CAMPAIGN_OBJECTIVES, ObjectiveOption } from "@/data/categories";

interface Step2Props {
  data: {
    objective: string;
  };
  onUpdate: (fields: Partial<Step2Props["data"]>) => void;
  onNext: () => void;
}

export default function Step2Objective({ data, onUpdate, onNext }: Step2Props) {
  const [error, setError] = useState<string | null>(null);

  const handleSelectObjective = (obj: ObjectiveOption) => {
    onUpdate({ objective: obj.id });
    if (error) setError(null);
  };

  const handleContinue = () => {
    if (!data.objective) {
      setError("Please choose a campaign goal to proceed.");
      return;
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
            <Target size={13} className="text-blue-500" />
            <span>Targeting Strategy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Select campaign goal
          </h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Choose what outcome Meta&apos;s machine learning algorithm should optimize your ad delivery for.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Options List */}
        <div className="space-y-3 mb-6">
          {CAMPAIGN_OBJECTIVES.map((obj) => {
            const isSelected = data.objective === obj.id;
            return (
              <button
                key={obj.id}
                type="button"
                onClick={() => handleSelectObjective(obj)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-blue-50/50 border-blue-600 ring-1 ring-blue-500/30 text-slate-900 shadow-xs"
                    : "bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50/50 text-slate-700 shadow-xs"
                }`}
              >
                <div className="min-w-0 pr-3">
                  <span className="text-sm sm:text-base font-bold block text-slate-900">
                    {obj.title}
                  </span>
                  <span className="text-xs text-slate-500 block truncate mt-0.5">
                    {obj.subtitle}
                  </span>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs"
                      : "border border-slate-300 bg-white"
                  }`}
                >
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleContinue}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/25 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
