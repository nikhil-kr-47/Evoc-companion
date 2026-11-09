"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Step1Business from "@/components/Step1Business";
import Step2BusinessProfile from "@/components/Step2BusinessProfile";
import Step2Objective from "@/components/Step2Objective";
import Step3Industry from "@/components/Step3Industry";
import Step3Website from "@/components/Step3Website";
import Step4Audience from "@/components/Step4Audience";
import StepBudget from "@/components/StepBudget";
import Step5Payment from "@/components/Step5Payment";
import Step6AdAccount from "@/components/Step6AdAccount";
import Step7Creatives from "@/components/Step7Creatives";
import Step8Success from "@/components/Step8Success";

const TOTAL_STEPS = 11;
const STORAGE_KEY = "evoc_companion_form_draft_v3";

const INITIAL_FORM_DATA = {
  phoneNumber: "",
  businessName: "",
  contactPerson: "",
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
  budget: {
    type: "RECOMMENDED" as "RECOMMENDED" | "CUSTOM",
    dailyBudget: 1000,
    monthlyEstimate: 30000,
    tierName: "Scale Advantage",
    customAmount: "",
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
  const [isMounted, setIsMounted] = useState(false);

  // Load draft on client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.currentStep && parsed.currentStep < TOTAL_STEPS) {
          setCurrentStep(parsed.currentStep);
        }
      }
    } catch (e) {
      console.warn("Failed to read draft from storage:", e);
    }
  }, []);

  useEffect(() => {
    if (!isMounted || currentStep === TOTAL_STEPS) return;
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
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
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
        setCurrentStep(TOTAL_STEPS);
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
    1: "Mobile",
    2: "Business Profile",
    3: "Campaign Goal",
    4: "Industry",
    5: "Store & Catalog",
    6: "Target Audience",
    7: "Campaign Budget",
    8: "Setup Fee",
    9: "Meta Ad Access",
    10: "Creatives",
    11: "Confirmation",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      {/* Top Navigation with Brand & Creative Progress */}
      <Header
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        stepTitle={stepTitles[currentStep] || ""}
        onBack={handleBack}
      />

      {/* Main Responsive Form Canvas - Phone & Laptop Aligned */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-start">
        {/* Step 1: Mobile Phone Number */}
        {currentStep === 1 && (
          <Step1Business
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        )}

        {/* Step 2: Business & Owner Name */}
        {currentStep === 2 && (
          <Step2BusinessProfile
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        )}

        {/* Step 3: Campaign Goal / Objective */}
        {currentStep === 3 && (
          <Step2Objective
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        )}

        {/* Step 4: Industry & Sub-category */}
        {currentStep === 4 && (
          <Step3Industry
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        )}

        {/* Step 5: Store / Website AI Analysis */}
        {currentStep === 5 && (
          <Step3Website
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        )}

        {/* Step 6: Target Audience */}
        {currentStep === 6 && (
          <Step4Audience
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        )}

        {/* Step 7: Campaign Daily Budget (Recommended vs Custom) */}
        {currentStep === 7 && (
          <StepBudget
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        )}

        {/* Step 8: Setup Fee Payment */}
        {currentStep === 8 && (
          <Step5Payment
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        )}

        {/* Step 9: Meta Ad Account Status */}
        {currentStep === 9 && (
          <Step6AdAccount
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        )}

        {/* Step 10: Ad Creatives & Final Submission */}
        {currentStep === 10 && (
          <Step7Creatives
            data={formData}
            onUpdate={updateFormData}
            onSubmitAll={handleSubmitAll}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Step 11: Success Screen */}
        {currentStep === 11 && (
          <Step8Success
            referenceId={referenceId}
            data={formData}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
