"use client";

import React, { useState } from "react";
import {
  Users,
  MapPin,
  Heart,
  ArrowRight,
  Sparkles,
  Check,
  Plus,
  X,
} from "lucide-react";
import {
  TIER_1_CITIES,
  TIER_2_CITIES,
  POPULAR_INTERESTS,
} from "@/data/categories";

const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55+"];
const GENDERS = [
  { id: "ALL", label: "All Genders" },
  { id: "WOMEN", label: "Women Only" },
  { id: "MEN", label: "Men Only" },
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
  const [customInterest, setCustomInterest] = useState("");
  const [cityInput, setCityInput] = useState("");

  const audience = {
    ageRanges: data.audience?.ageRanges || [],
    gender: data.audience?.gender || "",
    locationType: data.audience?.locationType || "",
    selectedCities: data.audience?.selectedCities || [],
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
    updateAudience({ ageRanges: updated });
  };

  const toggleCity = (city: string) => {
    const current = audience.selectedCities || [];
    const updated = current.includes(city)
      ? current.filter((c) => c !== city)
      : [...current, city];
    updateAudience({ selectedCities: updated });
  };

  const addCustomCity = () => {
    if (!cityInput.trim()) return;
    const clean = cityInput.trim();
    if (!audience.selectedCities.includes(clean)) {
      updateAudience({ selectedCities: [...audience.selectedCities, clean] });
    }
    setCityInput("");
  };

  const toggleInterest = (interest: string) => {
    const current = audience.interests || [];
    const updated = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];
    updateAudience({ interests: updated });
  };

  const addCustomInterest = () => {
    if (!customInterest.trim()) return;
    const clean = customInterest.trim();
    if (!audience.interests.includes(clean)) {
      updateAudience({ interests: [...audience.interests, clean] });
    }
    setCustomInterest("");
  };

  const handleContinue = () => {
    if (!audience.ageRanges || audience.ageRanges.length === 0) {
      setError("Please select at least one target age group.");
      return;
    }
    if (!audience.gender) {
      setError("Please select a target gender.");
      return;
    }
    if (!audience.locationType) {
      setError("Please select a target geography option (Tier 1 Metros, Tier 2, or All India).");
      return;
    }
    if (!audience.interests || audience.interests.length === 0) {
      setError("Please select at least one interest or consumer behavior.");
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      {/* Top Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300 text-xs font-semibold mb-2 sm:mb-3">
          <Sparkles size={13} />
          <span>Step 5 • Target Audience</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Who is your target audience?
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
          Specify demographics, geographies, and interests so we target users most likely to convert.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs flex items-center justify-center gap-2 font-medium">
          <span>⚠️ {error}</span>
        </div>
      )}

      <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
        {/* 1. Age Range */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users size={16} className="text-blue-600" />
              <span>1. Target Age Group(s) <span className="text-rose-500">*</span></span>
            </span>
            {audience.ageRanges.length > 0 && (
              <span className="text-xs text-blue-600 font-semibold">{audience.ageRanges.join(", ")}</span>
            )}
          </label>
          <div className="grid grid-cols-5 gap-2">
            {AGE_RANGES.map((age) => {
              const active = audience.ageRanges.includes(age);
              return (
                <button
                  key={age}
                  type="button"
                  onClick={() => toggleAge(age)}
                  className={`py-2.5 px-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    active
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300"
                  }`}
                >
                  {age}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Gender Selection */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span>2. Target Gender <span className="text-rose-500">*</span></span>
            {audience.gender && (
              <span className="text-xs text-blue-600 font-semibold">
                {GENDERS.find((g) => g.id === audience.gender)?.label}
              </span>
            )}
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {GENDERS.map((g) => {
              const active = audience.gender === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => updateAudience({ gender: g.id })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    active
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300"
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Location & Geography */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-600" />
              <span>3. Target Geographies <span className="text-rose-500">*</span></span>
            </span>
          </label>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => updateAudience({ locationType: "TIER_1", selectedCities: [...TIER_1_CITIES] })}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold border cursor-pointer ${
                audience.locationType === "TIER_1"
                  ? "bg-blue-50 border-blue-600 text-blue-700 font-bold"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700 hover:border-blue-300"
              }`}
            >
              Tier 1 Metros
            </button>
            <button
              type="button"
              onClick={() => updateAudience({ locationType: "TIER_2", selectedCities: [...TIER_2_CITIES] })}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold border cursor-pointer ${
                audience.locationType === "TIER_2"
                  ? "bg-blue-50 border-blue-600 text-blue-700 font-bold"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700 hover:border-blue-300"
              }`}
            >
              Tier 2 Cities
            </button>
            <button
              type="button"
              onClick={() => updateAudience({ locationType: "PAN_INDIA", selectedCities: ["Pan-India"] })}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold border cursor-pointer ${
                audience.locationType === "PAN_INDIA"
                  ? "bg-blue-50 border-blue-600 text-blue-700 font-bold"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700 hover:border-blue-300"
              }`}
            >
              All India
            </button>
          </div>

          {/* Active Cities Chips */}
          {audience.selectedCities.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {audience.selectedCities.map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-medium"
                >
                  <span>{city}</span>
                  <button
                    type="button"
                    onClick={() => toggleCity(city)}
                    className="hover:text-red-500 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 4. Interests & Niches */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Heart size={16} className="text-blue-600" />
              <span>4. Target Interests &amp; Behaviors <span className="text-rose-500">*</span></span>
            </span>
            {audience.interests.length > 0 && (
              <span className="text-xs text-blue-600 font-semibold">{audience.interests.length} selected</span>
            )}
          </label>

          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
            {POPULAR_INTERESTS.map((interest) => {
              const active = audience.interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    active
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm font-semibold"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300"
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
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all transform active:scale-[0.99] cursor-pointer"
        >
          <span>Continue to Setup Fee</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
