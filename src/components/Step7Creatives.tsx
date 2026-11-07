"use client";

import React, { useState } from "react";
import { UploadCloud, Check, X, FileVideo, Image as ImageIcon, Loader2, ArrowRight } from "lucide-react";

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
    <div className="w-full max-w-md mx-auto">
      {/* Title & Description - Left Aligned */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Ad creatives
        </h1>
        <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
          Provide your own creative assets or let our design team produce them.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Selectable Cards */}
      <div className="space-y-3 mb-6">
        <button
          type="button"
          onClick={() => updateCreative({ choice: "UPLOAD" })}
          className={`w-full p-4 rounded-xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
            creative.choice === "UPLOAD"
              ? "border-slate-900 bg-slate-50/80 shadow-xs ring-1 ring-slate-900"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div>
            <div className="text-sm font-semibold text-slate-900">Upload my own creatives</div>
            <div className="text-xs text-slate-500 mt-0.5">Images, banners, or MP4 video reels</div>
          </div>
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
              creative.choice === "UPLOAD" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white"
            }`}
          >
            {creative.choice === "UPLOAD" && <Check size={12} strokeWidth={2.5} />}
          </div>
        </button>

        <button
          type="button"
          onClick={() => updateCreative({ choice: "DONE_BY_US", requestedService: true })}
          className={`w-full p-4 rounded-xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
            creative.choice === "DONE_BY_US"
              ? "border-slate-900 bg-slate-50/80 shadow-xs ring-1 ring-slate-900"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div>
            <div className="text-sm font-semibold text-slate-900">Get it designed by Evoc</div>
            <div className="text-xs text-slate-500 mt-0.5">Our design team crafts high CTR ad creatives</div>
          </div>
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
              creative.choice === "DONE_BY_US" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white"
            }`}
          >
            {creative.choice === "DONE_BY_US" && <Check size={12} strokeWidth={2.5} />}
          </div>
        </button>
      </div>

      {/* Choice A: Upload Dropzone */}
      {creative.choice === "UPLOAD" && (
        <div className="mb-6 space-y-3">
          <div className="p-6 rounded-2xl border border-dashed border-slate-300 bg-white text-center hover:border-slate-900 transition-colors">
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*,video/mp4,video/quicktime"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <UploadCloud size={24} className="mx-auto mb-2 text-slate-400" />
              <p className="text-xs font-semibold text-slate-800">
                Click to browse files
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Supports MP4, JPG, PNG (up to 50MB)
              </p>
            </label>
          </div>

          {creative.uploadedFiles && creative.uploadedFiles.length > 0 && (
            <div className="space-y-1.5">
              {creative.uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    {file.type === "video" ? (
                      <FileVideo size={14} className="text-blue-600 shrink-0" />
                    ) : (
                      <ImageIcon size={14} className="text-emerald-600 shrink-0" />
                    )}
                    <span className="truncate text-slate-800 font-medium">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file.id)}
                    className="text-slate-400 hover:text-red-500 ml-2 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Choice B: Done by Us Info */}
      {creative.choice === "DONE_BY_US" && (
        <div className="mb-6 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-900">Creative Production Included</p>
          <p className="leading-relaxed">
            Our creative directors will evaluate your catalog and design 3-5 high-converting static &amp; reel hooks.
          </p>
        </div>
      )}

      {/* Campaign Notes */}
      <div className="mb-6 space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 block">
          Additional instructions (Optional)
        </label>
        <textarea
          rows={2}
          placeholder="e.g. Highlight flat 20% discount, focus on Cash on Delivery..."
          value={creative.adNotes || ""}
          onChange={(e) => updateCreative({ adNotes: e.target.value })}
          className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 placeholder:text-slate-400 bg-white leading-relaxed"
        />
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleFinalLaunch}
        disabled={isSubmitting}
        className="w-full py-3.5 px-4 rounded-xl bg-[#111827] hover:bg-black disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Submitting Campaign...</span>
          </>
        ) : (
          <>
            <span>Submit Campaign</span>
            <ArrowRight size={16} />
          </>
        )}
      </button>
    </div>
  );
}
