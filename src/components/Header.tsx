"use client";

import React from "react";
import { ArrowLeft, Sparkles, CheckCircle2, Sun, Moon, Rocket } from "lucide-react";

interface HeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onBack: () => void;
}

const STEP_LABELS = [
  "Business",
  "Goal",
  "Industry",
  "Website",
  "Audience",
  "Payment",
  "Ad Account",
  "Creatives",
];

export default function Header({
  currentStep,
  totalSteps,
  stepTitle,
  theme,
  onToggleTheme,
  onBack,
}: HeaderProps) {
  const progressPercent = Math.min(
    Math.round(((currentStep - 1) / (totalSteps - 1)) * 100),
    100
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-3">
        {/* Left: Brand & Optional Back Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {currentStep > 1 && currentStep <= totalSteps && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer shrink-0"
              aria-label="Previous Step"
            >
              <ArrowLeft size={16} />
              <span className="hidden md:inline">Back</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/30 text-white font-extrabold shrink-0">
              <Rocket size={17} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base">
                EVOC
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 uppercase tracking-wider">
                COMPANION
              </span>
            </div>
          </div>
        </div>

        {/* Center: Breadcrumbs (Desktop only - spacious) */}
        <div className="hidden xl:flex items-center gap-1">
          {STEP_LABELS.map((label, idx) => {
            const stepNum = idx + 1;
            const isPast = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div key={label} className="flex items-center">
                <div
                  className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md transition-all ${
                    isCurrent
                      ? "bg-blue-600 text-white shadow-sm"
                      : isPast
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-400 dark:text-slate-600"
                  }`}
                >
                  {isPast ? <CheckCircle2 size={11} /> : null}
                  <span>{label}</span>
                </div>
                {idx < STEP_LABELS.length - 1 && (
                  <span className="text-slate-300 dark:text-slate-700 text-xs mx-0.5">›</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Clean step indicator & Theme Toggle (Mobile Friendly) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Detailed text on desktop/tablets */}
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-end gap-1">
              <Sparkles size={13} className="text-blue-600 dark:text-blue-400" />
              <span>Step {currentStep} of {totalSteps}</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">
              {progressPercent}% complete
            </p>
          </div>

          {/* Compact Pill on Mobile (avoids crowding) */}
          <div className="block sm:hidden px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
            {currentStep}/{totalSteps}
          </div>

          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center shadow-xs cursor-pointer"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={16} className="text-amber-400" />
            ) : (
              <Moon size={16} className="text-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-100 dark:bg-slate-900 overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
}
