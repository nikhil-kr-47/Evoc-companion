"use client";

import React, { useState } from "react";
import { ArrowRight, Users, Check } from "lucide-react";
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
    <div className="w-full animate-slide-up">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-3">
            <Users size={13} className="text-blue-500" />
            <span>Audience Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Target audience
          </h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Specify the demographic filters and customer interests for Meta ad delivery.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <div className="space-y-5 mb-6">
          {/* 1. Age Range */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Age Groups <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {AGE_RANGES.map((age) => {
                const active = audience.ageRanges.includes(age);
                return (
                  <button
                    key={age}
                    type="button"
                    onClick={() => toggleAge(age)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      active
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
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
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Gender <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {GENDERS.map((g) => {
                const active = audience.gender === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => updateAudience({ gender: g.id })}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      active
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
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
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Geographic Scope <span className="text-rose-500">*</span>
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
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      active
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
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
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Buyer Interests ({audience.interests.length} selected) <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-1 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              {POPULAR_INTERESTS.map((interest) => {
                const active = audience.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      active
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
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
