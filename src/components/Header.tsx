"use client";

import React from "react";
import { ArrowLeft, Check, HelpCircle } from "lucide-react";

interface HeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  onBack: () => void;
}

export default function Header({
  currentStep,
  totalSteps,
  stepTitle,
  onBack,
}: HeaderProps) {
  // Steps 1 through totalSteps - 1 (excluding success screen)
  const steps = Array.from({ length: totalSteps - 1 }, (_, i) => i + 1);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-100">
      <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Back Arrow */}
        <div className="w-10 flex items-center">
          {currentStep > 1 && currentStep < totalSteps ? (
            <button
              type="button"
              onClick={onBack}
              className="p-2 -ml-2 rounded-lg text-slate-700 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Previous step"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="w-5" />
          )}
        </div>

        {/* Center: Cashfree-style Connected Stepper */}
        {currentStep < totalSteps && (
          <div className="flex items-center gap-1 sm:gap-1.5">
            {steps.map((step, idx) => {
              const isCompleted = step < currentStep;
              const isCurrent = step === currentStep;

              return (
                <React.Fragment key={step}>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all ${
                      isCompleted
                        ? "bg-[#10b981] text-white"
                        : isCurrent
                        ? "bg-[#111827] text-white"
                        : "border border-slate-200 text-slate-400 bg-white"
                    }`}
                  >
                    {isCompleted ? <Check size={11} strokeWidth={2.5} /> : step}
                  </div>

                  {idx < steps.length - 1 && (
                    <div
                      className={`h-[2px] w-2.5 sm:w-4 transition-colors ${
                        step < currentStep ? "bg-[#10b981]" : "bg-slate-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Right: Help icon or Step number */}
        <div className="w-10 flex items-center justify-end">
          {currentStep < totalSteps && (
            <span className="text-xs font-medium text-slate-400">
              {currentStep}/{totalSteps - 1}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
