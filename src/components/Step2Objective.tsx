"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
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
    <div className="w-full max-w-md mx-auto">
      {/* Title & Description - Left Aligned */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Select campaign goal
        </h1>
        <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
          Choose the primary business outcome for your Meta advertising.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Options List */}
      <div className="space-y-2.5 mb-6">
        {CAMPAIGN_OBJECTIVES.map((obj) => {
          const isSelected = data.objective === obj.id;
          return (
            <button
              key={obj.id}
              type="button"
              onClick={() => handleSelectObjective(obj)}
              className={`w-full p-4 rounded-xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
                isSelected
                  ? "bg-slate-50/80 border-slate-900 ring-1 ring-slate-900 text-slate-900 shadow-xs"
                  : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-xs"
              }`}
            >
              <div className="min-w-0 pr-3">
                <span className="text-sm font-semibold block text-slate-900">
                  {obj.title}
                </span>
                <span className="text-xs text-slate-500 block truncate mt-0.5">
                  {obj.subtitle}
                </span>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? "bg-slate-900 text-white" : "border border-slate-300 bg-white"
                }`}
              >
                {isSelected && <Check size={12} strokeWidth={2.5} />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleContinue}
        className="w-full py-3.5 px-4 rounded-xl bg-[#111827] hover:bg-black text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
      >
        <span>Continue</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
