"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { TIER_1_CITIES, TIER_2_CITIES, POPULAR_INTERESTS } from "@/data/categories";

const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55+"];
const GENDERS = [
  { id: "ALL", label: "All Genders" },
  { id: "WOMEN", label: "Women" },
  { id: "MEN", label: "Men" },
];

interface Step4Props {
  data: {
    audience: {
      ageRanges: string[];
      gender: string;
      locationType: string;
      selectedCities: string[];
      interests: string[];
    };
  };
  onUpdate: (fields: Partial<Step4Props["data"]>) => void;
  onNext: () => void;
}

export default function Step4Audience({ data, onUpdate, onNext }: Step4Props) {
  const [error, setError] = useState<string | null>(null);

  const audience = {
    ageRanges: data.audience?.ageRanges || ["25-34"],
    gender: data.audience?.gender || "ALL",
    locationType: data.audience?.locationType || "PAN_INDIA",
    selectedCities: data.audience?.selectedCities || ["Pan-India"],
    interests: data.audience?.interests || [],
  };

  const updateAudience = (partial: Partial<typeof audience>) => {
    onUpdate({
      audience: {
        ...audience,
        ...partial,
      },
    });
    if (error) setError(null);
  };

  const toggleAge = (age: string) => {
    const current = audience.ageRanges || [];
    const updated = current.includes(age)
      ? current.filter((a) => a !== age)
      : [...current, age];
    updateAudience({ ageRanges: updated.length ? updated : [age] });
  };

  const toggleInterest = (interest: string) => {
    const current = audience.interests || [];
    const updated = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];
    updateAudience({ interests: updated });
  };

  const handleContinue = () => {
    if (!audience.ageRanges || audience.ageRanges.length === 0) {
      setError("Please select at least one age group.");
      return;
    }
    if (!audience.gender) {
      setError("Please select a target gender.");
      return;
    }
    if (!audience.interests || audience.interests.length === 0) {
      setError("Please select at least one target interest.");
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
          Target audience
        </h1>
        <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
          Define the demographics, geography, and buyer interests for your ads.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      <div className="space-y-4 mb-6">
        {/* 1. Age Range */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <label className="text-xs font-semibold text-slate-700 block">
            Age groups <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {AGE_RANGES.map((age) => {
              const active = audience.ageRanges.includes(age);
              return (
                <button
                  key={age}
                  type="button"
                  onClick={() => toggleAge(age)}
                  className={`py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    active
                      ? "bg-[#111827] text-white border-[#111827]"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {age}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Gender Selection */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <label className="text-xs font-semibold text-slate-700 block">
            Target gender <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {GENDERS.map((g) => {
              const active = audience.gender === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => updateAudience({ gender: g.id })}
                  className={`py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    active
                      ? "bg-[#111827] text-white border-[#111827]"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Geography */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <label className="text-xs font-semibold text-slate-700 block">
            Geographic coverage <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "PAN_INDIA", label: "Pan India", cities: ["Pan-India"] },
              { id: "TIER_1", label: "Top Metros", cities: [...TIER_1_CITIES] },
              { id: "TIER_2", label: "Tier 2 Cities", cities: [...TIER_2_CITIES] },
            ].map((loc) => {
              const active = audience.locationType === loc.id;
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() =>
                    updateAudience({
                      locationType: loc.id,
                      selectedCities: loc.cities,
                    })
                  }
                  className={`py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    active
                      ? "bg-[#111827] text-white border-[#111827]"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {loc.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Interests */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <label className="text-xs font-semibold text-slate-700 block">
            Buyer interests ({audience.interests.length} selected) <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
            {POPULAR_INTERESTS.map((interest) => {
              const active = audience.interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    active
                      ? "bg-[#111827] text-white border-[#111827]"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>
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
