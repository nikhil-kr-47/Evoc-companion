"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Step1Business from "@/components/Step1Business";
import Step2Objective from "@/components/Step2Objective";
import Step3Industry from "@/components/Step3Industry";
import Step3Website from "@/components/Step3Website";
import Step4Audience from "@/components/Step4Audience";
import Step5Payment from "@/components/Step5Payment";
import Step6AdAccount from "@/components/Step6AdAccount";
import Step7Creatives from "@/components/Step7Creatives";
import Step8Success from "@/components/Step8Success";

const TOTAL_STEPS = 8;
const STORAGE_KEY = "evoc_companion_draft_v2";
const THEME_STORAGE_KEY = "evoc_companion_theme_mode";

// Pure clean initial state with ZERO dummy or default pre-filled values
const INITIAL_FORM_DATA = {
  businessName: "",
  contactPerson: "",
  phoneNumber: "",
  email: "",
  objective: "",
  businessType: "",
  subCategory: "",
  subCategories: [] as string[],
  hasWebsite: null as boolean | null,
  websiteUrl: "",
  websiteAnalysis: null as any,
  businessDescription: "",
  audience: {
    ageRanges: [] as string[],
    gender: "",
    locationType: "",
    selectedCities: [] as string[],
    interests: [] as string[],
  },
  payment: {
    status: "PENDING" as "PENDING" | "PAID",
    method: "",
    transactionId: "",
    amount: 1178.82,
  },
  adAccount: {
    isReady: null as boolean | null,
    accountId: "",
    accessGranted: false,
    needAssistance: false,
  },
  creative: {
    choice: null as "UPLOAD" | "DONE_BY_US" | null,
    uploadedFiles: [] as any[],
    adNotes: "",
    requestedService: false,
  },
};

export default function LaunchpadPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [referenceId, setReferenceId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme & load draft on client mount
  useEffect(() => {
    setIsMounted(true);

    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as "dark" | "light" | null;
      const initialTheme = savedTheme || "light";
      setTheme(initialTheme);
      if (initialTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (e) {
      document.documentElement.classList.remove("dark");
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.currentStep && parsed.currentStep < 9) {
          setCurrentStep(parsed.currentStep);
        }
      }
    } catch (e) {
      console.warn("Failed to read draft from storage:", e);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (e) {
      console.warn(e);
    }
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    if (!isMounted || currentStep === 9) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentStep,
          formData,
        })
      );
    } catch (e) {
      console.warn("Failed to persist draft:", e);
    }
  }, [formData, currentStep, isMounted]);

  const updateFormData = (patch: any) => {
    setFormData((prev) => ({
      ...prev,
      ...patch,
    }));
  };

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep((prev) => Math.min(prev + 1, 9));
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
    setFormData(INITIAL_FORM_DATA);
    setReferenceId("");
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submit-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();
      if (resData.success) {
        setReferenceId(resData.referenceId || "EVOC-CMP-SUCCESS");
        setCurrentStep(9);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
          console.warn(e);
        }
      } else {
        alert("Submission failed: " + (resData.error || resData.message || "Please try again"));
      }
    } catch (err: any) {
      alert("Error submitting campaign: " + (err.message || "Network error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles: Record<number, string> = {
    1: "Business Details",
    2: "Campaign Objective",
    3: "Industry & Subcategories",
    4: "Website & Overview",
    5: "Target Audience",
    6: "Payment Setup Fee",
    7: "Ad Account Access",
    8: "Creative Assets",
    9: "Confirmation",
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Header
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        stepTitle={stepTitles[currentStep] || ""}
        theme={theme}
        onToggleTheme={toggleTheme}
        onBack={handleBack}
      />

      {/* Main Form Body - Balanced & Spacious */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col justify-center">
        {currentStep === 1 && (
          <Step1Business
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <Step2Objective
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        )}

        {currentStep === 3 && (
          <Step3Industry
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        )}

        {currentStep === 4 && (
          <Step3Website
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        )}

        {currentStep === 5 && (
          <Step4Audience
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        )}

        {currentStep === 6 && (
          <Step5Payment
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        )}

        {currentStep === 7 && (
          <Step6AdAccount
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        )}

        {currentStep === 8 && (
          <Step7Creatives
            data={formData}
            onUpdate={updateFormData}
            onSubmitAll={handleSubmitAll}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep === 9 && (
          <Step8Success
            referenceId={referenceId}
            data={formData}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
