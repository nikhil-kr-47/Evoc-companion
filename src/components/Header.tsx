"use client";

import React from "react";
import { ArrowLeft, Check, Rocket } from "lucide-react";

interface HeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  onBack: () => void;
}

const STEP_LABELS: Record<number, string> = {
  1: "Mobile",
  2: "Goal",
  3: "Industry",
  4: "Website",
  5: "Audience",
  6: "Payment",
  7: "Ad Access",
  8: "Creatives",
};

export default function Header({
  currentStep,
  totalSteps,
  stepTitle,
  onBack,
}: HeaderProps) {
  const activeStepsCount = totalSteps - 1; // Step 9 is confirmation screen
  const steps = Array.from({ length: activeStepsCount }, (_, i) => i + 1);
  const progressPercent = Math.min(
    100,
    Math.round(((currentStep - 1) / (activeStepsCount - 1)) * 100)
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Top Navbar */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Back button + Evoc Brand */}
        <div className="flex items-center gap-3">
          {currentStep > 1 && currentStep < totalSteps ? (
            <button
              type="button"
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft size={19} />
            </button>
          ) : null}

          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/25">
              <Rocket size={16} className="transform -rotate-45" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                EVOC
              </span>
              <span className="text-[10px] font-bold tracking-wider text-blue-600 bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded-full uppercase">
                Companion
              </span>
            </div>
          </div>
        </div>

        {/* Right: Step badge */}
        {currentStep < totalSteps && (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-500">
              {STEP_LABELS[currentStep] || stepTitle}
            </span>
            <div className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>
                {currentStep}/{activeStepsCount}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Creative Section Progress: Connected Stepper */}
      {currentStep < totalSteps && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-3 pt-1">
          {/* Stepper Nodes */}
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => {
              const isCompleted = step < currentStep;
              const isCurrent = step === currentStep;

              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${
                        isCompleted
                          ? "bg-emerald-500 text-white shadow-xs"
                          : isCurrent
                          ? "bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm shadow-blue-500/30 scale-105"
                          : "bg-slate-100 text-slate-400 border border-slate-200/80"
                      }`}
                    >
                      {isCompleted ? (
                        <Check size={12} strokeWidth={3} />
                      ) : (
                        <span>{step}</span>
                      )}
                    </div>
                    {/* Step label on larger screens */}
                    <span
                      className={`hidden md:block text-[10px] mt-1 font-medium tracking-tight whitespace-nowrap transition-colors ${
                        isCurrent
                          ? "text-blue-600 font-bold"
                          : isCompleted
                          ? "text-slate-600"
                          : "text-slate-400"
                      }`}
                    >
                      {STEP_LABELS[step]}
                    </span>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="flex-1 mx-1 sm:mx-2 h-0.5 relative rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          step < currentStep ? "bg-emerald-500 w-full" : "w-0"
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Smooth Ambient Line Indicator */}
      {currentStep < totalSteps && (
        <div className="w-full h-[2px] bg-slate-100 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </header>
  );
}
