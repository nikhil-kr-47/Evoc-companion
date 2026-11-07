"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Plus, ArrowRight } from "lucide-react";
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
    <div className="w-full max-w-md mx-auto">
      {/* Title & Description - Left Aligned */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Select your industry
        </h1>
        <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
          Choose the industry and niche that best describes your products or services.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Industry Dropdown Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs mb-5 space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">
            Industry category <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={data.businessType}
              onChange={(e) => handleSelectCategory(e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              <option value="">Select industry...</option>
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Subcategories */}
        {activeCategory && (
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Subcategory niches <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {activeCategory.subcategories.map((sub) => {
                const isChecked = selectedSubs.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleSubcategory(sub)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isChecked
                        ? "bg-[#111827] text-white border-[#111827]"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {isChecked ? (
                      <Check size={12} strokeWidth={2.5} />
                    ) : (
                      <Plus size={12} className="text-slate-400" />
                    )}
                    <span>{sub}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom tag input */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Add other niche..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomTag();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Continue Button */}
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
