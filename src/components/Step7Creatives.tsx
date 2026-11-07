"use client";

import React, { useState } from "react";
import { UploadCloud, Check, X, FileVideo, Image as ImageIcon, Loader2, ArrowRight, Sparkles } from "lucide-react";

interface UploadedItem {
  id: string;
  name: string;
  size: string;
  type: "video" | "image";
}

interface Step7Props {
  data: {
    creative: {
      choice: "UPLOAD" | "DONE_BY_US" | null;
      uploadedFiles: UploadedItem[];
      adNotes?: string;
      requestedService?: boolean;
    };
  };
  onUpdate: (fields: Partial<Step7Props["data"]>) => void;
  onSubmitAll: () => Promise<void>;
  isSubmitting: boolean;
}

export default function Step7Creatives({
  data,
  onUpdate,
  onSubmitAll,
  isSubmitting,
}: Step7Props) {
  const [error, setError] = useState<string | null>(null);

  const creative = data.creative || {
    choice: null,
    uploadedFiles: [],
    adNotes: "",
    requestedService: false,
  };

  const updateCreative = (partial: Partial<typeof creative>) => {
    onUpdate({
      creative: {
        ...creative,
        ...partial,
      },
    });
    if (error) setError(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: UploadedItem[] = Array.from(files).map((f) => {
      const isVideo = f.type.startsWith("video") || f.name.match(/\.(mp4|mov|avi)$/i);
      const sizeMB = (f.size / (1024 * 1024)).toFixed(1);
      return {
        id: Math.random().toString(36).substring(2, 9),
        name: f.name,
        size: `${sizeMB} MB`,
        type: isVideo ? "video" : "image",
      };
    });

    updateCreative({
      uploadedFiles: [...(creative.uploadedFiles || []), ...newItems],
    });
    e.target.value = "";
  };

  const handleRemoveFile = (id: string) => {
    const remaining = (creative.uploadedFiles || []).filter((f) => f.id !== id);
    updateCreative({ uploadedFiles: remaining });
  };

  const handleFinalLaunch = async () => {
    if (!creative.choice) {
      setError("Please select an option to continue");
      return;
    }
    if (creative.choice === "UPLOAD" && (!creative.uploadedFiles || creative.uploadedFiles.length === 0)) {
      setError("Please upload at least one image or video, or choose 'Design by Evoc'");
      return;
    }
    setError(null);
    await onSubmitAll();
  };

  return (
    <div className="w-full animate-slide-up">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles size={13} className="text-blue-500" />
            <span>Ad Creative Strategy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ad creatives
          </h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Upload your existing ad videos and banners, or let our studio design thumb-stopping hooks for you.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Selection Cards */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => updateCreative({ choice: "UPLOAD" })}
            className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
              creative.choice === "UPLOAD"
                ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-500/30 shadow-xs"
                : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50/50"
            }`}
          >
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900">
                Upload my own creative assets
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Upload image banners, product photos, or MP4 video reels
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                creative.choice === "UPLOAD"
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {creative.choice === "UPLOAD" && <Check size={12} strokeWidth={3} />}
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateCreative({ choice: "DONE_BY_US", requestedService: true })}
            className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
              creative.choice === "DONE_BY_US"
                ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-500/30 shadow-xs"
                : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50/50"
            }`}
          >
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900">
                Get it designed by Evoc Studio
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Our creative directors produce high CTR static and video reel variants
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                creative.choice === "DONE_BY_US"
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {creative.choice === "DONE_BY_US" && <Check size={12} strokeWidth={3} />}
            </div>
          </button>
        </div>

        {/* Choice A: Upload Dropzone */}
        {creative.choice === "UPLOAD" && (
          <div className="mb-6 space-y-3">
            <div className="p-6 sm:p-8 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                id="file-upload"
                multiple
                accept="image/*,video/mp4,video/quicktime"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 border border-blue-200/60 shadow-2xs">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Click to select creative files
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Supports MP4, MOV, JPG, PNG (up to 50MB each)
                </p>
              </label>
            </div>

            {creative.uploadedFiles && creative.uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Uploaded ({creative.uploadedFiles.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {creative.uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {file.type === "video" ? (
                          <FileVideo size={16} className="text-blue-600 shrink-0" />
                        ) : (
                          <ImageIcon size={16} className="text-emerald-600 shrink-0" />
                        )}
                        <span className="truncate text-slate-800 font-semibold">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(file.id)}
                        className="text-slate-400 hover:text-red-500 ml-2 cursor-pointer p-1"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Choice B: Done by Us Info */}
        {creative.choice === "DONE_BY_US" && (
          <div className="mb-6 p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 text-xs sm:text-sm text-slate-700 space-y-1.5">
            <p className="font-bold text-blue-900 text-sm">Full Studio Production Included</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our creative team will review your website catalog and craft 3-5 high-converting static carousel slides and motion reel hooks tailored for maximum ROAS.
            </p>
          </div>
        )}

        {/* Additional instructions */}
        <div className="mb-6 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Special Instructions &amp; Offers (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Highlight flat 20% discount code 'FIRST20', promote Cash on Delivery, etc."
            value={creative.adNotes || ""}
            onChange={(e) => updateCreative({ adNotes: e.target.value })}
            className="w-full p-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400 bg-white leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleFinalLaunch}
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/25 active:scale-[0.99] transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Transmitting Campaign Setup...</span>
            </>
          ) : (
            <>
              <span>Finalize &amp; Submit Campaign</span>
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
