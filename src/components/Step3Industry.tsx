"use client";

import React, { useState } from "react";
import {
  Tag,
  Search,
  Check,
  Plus,
  ArrowRight,
  Layers,
  ChevronDown,
  Shirt,
  Gem,
  HeartPulse,
  Utensils,
  Home,
  Cpu,
  Building,
  GraduationCap,
  Briefcase,
  Car,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import {
  BUSINESS_CATEGORIES,
  BusinessCategory,
} from "@/data/categories";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  fashion_apparel: <Shirt size={16} />,
  jewelry_accessories: <Gem size={16} />,
  beauty_wellness: <Sparkles size={16} />,
  health_supplements: <HeartPulse size={16} />,
  food_beverage: <Utensils size={16} />,
  home_decor: <Home size={16} />,
  electronics_gadgets: <Cpu size={16} />,
  real_estate: <Building size={16} />,
  education_edtech: <GraduationCap size={16} />,
  b2b_saas_services: <Briefcase size={16} />,
  automotive: <Car size={16} />,
  events_hospitality: <PartyPopper size={16} />,
};

interface Step3IndustryProps {
  data: {
    businessType: string;
    subCategory: string;
    subCategories?: string[];
  };
  onUpdate: (fields: Partial<Step3IndustryProps["data"]>) => void;
  onNext: () => void;
}

export default function Step3Industry({
  data,
  onUpdate,
  onNext,
}: Step3IndustryProps) {
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customTag, setCustomTag] = useState("");

  const activeCategory = BUSINESS_CATEGORIES.find((c) => c.name === data.businessType) || null;

  const selectedSubs: string[] =
    data.subCategories && data.subCategories.length > 0
      ? data.subCategories
      : data.subCategory
      ? [data.subCategory]
      : [];

  const handleSelectCategory = (catName: string) => {
    onUpdate({
      businessType: catName,
      subCategory: "",
      subCategories: [],
    });
    if (error) setError(null);
  };

  const toggleSubcategory = (sub: string) => {
    const exists = selectedSubs.includes(sub);
    const updated = exists
      ? selectedSubs.filter((s) => s !== sub)
      : [...selectedSubs, sub];

    onUpdate({
      subCategories: updated,
      subCategory: updated[0] || "",
    });
    if (error) setError(null);
  };

  const handleAddCustomTag = () => {
    if (!customTag.trim()) return;
    const clean = customTag.trim();
    if (!selectedSubs.includes(clean)) {
      const updated = [...selectedSubs, clean];
      onUpdate({
        subCategories: updated,
        subCategory: updated[0] || "",
      });
    }
    setCustomTag("");
  };

  const handleContinue = () => {
    if (!data.businessType) {
      setError("Please select your primary industry.");
      return;
    }
    if (selectedSubs.length === 0) {
      setError("Please select at least one relevant subcategory or product niche.");
      return;
    }
    setError(null);
    onNext();
  };

  const visibleSubcategories = activeCategory
    ? activeCategory.subcategories.filter((sub) =>
        sub.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-up">
      {/* Top Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300 text-xs font-semibold mb-2 sm:mb-3">
          <Layers size={13} />
          <span>Step 3 • Industry &amp; Niche</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Select Your Industry &amp; Subcategories
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
          Tailor your ad strategy by selecting your exact industry niche and product categories.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center justify-center gap-2 font-medium">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* 1. Industry Selection: Dropdown on Mobile, Grid on Tablet/Desktop */}
      <div className="mb-6">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2.5 flex items-center justify-between">
          <span>1. Choose Business Industry <span className="text-rose-500">*</span></span>
          {activeCategory && (
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[200px]">
              {activeCategory.name}
            </span>
          )}
        </label>

        {/* Mobile Dropdown View (<sm) */}
        <div className="block sm:hidden">
          <div className="relative">
            <select
              value={data.businessType}
              onChange={(e) => handleSelectCategory(e.target.value)}
              className="w-full appearance-none p-3.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs cursor-pointer"
            >
              <option value="">-- Tap to Select Industry --</option>
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        {/* Desktop Grid View (>=sm) */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {BUSINESS_CATEGORIES.map((cat) => {
            const isSelected = data.businessType === cat.name;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.name)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm font-bold"
                    : "bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-300 shadow-xs"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {CATEGORY_ICONS[cat.id] || <Tag size={14} />}
                </div>
                <span className="text-xs truncate font-medium">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Subcategory Chips Section */}
      {activeCategory ? (
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs mb-6 space-y-4 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 block">
                2. Select Subcategories for {activeCategory.name} <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Pick 1 or more that accurately represent your product line.
              </span>
            </div>

            {/* Search subcategories */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search subcategories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-blue-600 shadow-xs"
              />
            </div>
          </div>

          {/* Subcategory Chips */}
          <div className="flex flex-wrap gap-2 pt-1 max-h-52 sm:max-h-60 overflow-y-auto pr-1">
            {visibleSubcategories.map((sub) => {
              const isChecked = selectedSubs.includes(sub);
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => toggleSubcategory(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isChecked
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm font-semibold"
                      : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300"
                  }`}
                >
                  {isChecked ? <Check size={13} className="stroke-[3]" /> : <Plus size={13} className="text-slate-400" />}
                  <span>{sub}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Niche / Product Input */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
            <input
              type="text"
              placeholder="Don't see your specific product? Type here..."
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomTag();
                }
              }}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-600"
            />
            <button
              type="button"
              onClick={handleAddCustomTag}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors shrink-0 cursor-pointer"
            >
              + Add Niche
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 text-center mb-6">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Please select an industry above to view and select relevant product niches.
          </p>
        </div>
      )}

      {/* Selected Tags Summary Bar */}
      {selectedSubs.length > 0 && (
        <div className="mb-6 p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-blue-900 dark:text-blue-300 text-xs uppercase tracking-wider">
              Targeted Niches ({selectedSubs.length}):
            </span>
            {selectedSubs.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs font-semibold shadow-2xs"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all transform active:scale-[0.99] cursor-pointer"
        >
          <span>Continue to Website &amp; Overview</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
