"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Plus, ArrowRight, Layers } from "lucide-react";
import { BUSINESS_CATEGORIES } from "@/data/categories";

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
  const [customTag, setCustomTag] = useState("");

  const activeCategory =
    BUSINESS_CATEGORIES.find((c) => c.name === data.businessType) || null;

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
      setError("Please select your business industry.");
      return;
    }
    if (selectedSubs.length === 0) {
      setError("Please select at least one relevant subcategory.");
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
            <Layers size={13} className="text-blue-500" />
            <span>Niche Classification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Select your industry
          </h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Choose the category and product niches that match what you are advertising.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Industry Selection */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Industry Category <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={data.businessType}
                onChange={(e) => handleSelectCategory(e.target.value)}
                className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-xs"
              >
                <option value="">Select an industry...</option>
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

          {/* Subcategories */}
          {activeCategory && (
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Niches ({selectedSubs.length} selected) <span className="text-rose-500">*</span>
              </label>

              <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto pr-1">
                {activeCategory.subcategories.map((sub) => {
                  const isChecked = selectedSubs.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubcategory(sub)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isChecked
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {isChecked ? (
                        <Check size={12} strokeWidth={3} />
                      ) : (
                        <Plus size={12} className="text-slate-400" />
                      )}
                      <span>{sub}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom niche tag */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Other specialized niche..."
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomTag();
                    }
                  }}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          )}
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
