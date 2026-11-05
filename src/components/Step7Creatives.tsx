"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  FileVideo,
  Image as ImageIcon,
  MessageCircle,
  PhoneCall,
  Sparkles,
  CheckCircle2,
  X,
  AlertCircle,
  ArrowRight,
  Palette,
  Layers,
  Loader2,
} from "lucide-react";

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
      setError("Please choose whether you want to upload creatives or have us create them.");
      return;
    }
    if (creative.choice === "UPLOAD" && (!creative.uploadedFiles || creative.uploadedFiles.length === 0)) {
      setError("Please select at least one creative file (image or MP4 video) or switch to 'Get it done by us'.");
      return;
    }
    setError(null);
    await onSubmitAll();
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300 text-xs font-semibold mb-2 sm:mb-3">
          <Sparkles size={13} />
          <span>Step 8 • Ad Creatives</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Upload Creative or Get it Done by Us
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
          High-converting ads need thumb-stopping visuals. Either provide your own or let our creative team produce them for you.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs flex items-center justify-center gap-2 font-medium">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Choice Selector: 1 Col on phone, 2 Col on tablet/desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-6">
        {/* Choice A: Upload */}
        <button
          type="button"
          onClick={() => updateCreative({ choice: "UPLOAD" })}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            creative.choice === "UPLOAD"
              ? "bg-blue-50/90 dark:bg-blue-950/40 border-blue-600 ring-2 ring-blue-500/20 text-slate-900 dark:text-white shadow-sm"
              : "bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                creative.choice === "UPLOAD"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}
            >
              <UploadCloud size={18} />
            </span>
            {creative.choice === "UPLOAD" && (
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Selected
              </span>
            )}
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">I have my own creatives</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Upload images, banners, or MP4 video reels.
          </p>
        </button>

        {/* Choice B: Done By Us */}
        <button
          type="button"
          onClick={() => updateCreative({ choice: "DONE_BY_US", requestedService: true })}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            creative.choice === "DONE_BY_US"
              ? "bg-blue-50/90 dark:bg-blue-950/40 border-blue-600 ring-2 ring-blue-500/20 text-slate-900 dark:text-white shadow-sm"
              : "bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                creative.choice === "DONE_BY_US"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}
            >
              <Palette size={18} />
            </span>
            {creative.choice === "DONE_BY_US" && (
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Selected
              </span>
            )}
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Get it done by Evoc</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Our creative studio will script and craft high CTR creatives.
          </p>
        </button>
      </div>

      {/* Option A: File Dropzone */}
      {creative.choice === "UPLOAD" && (
        <div className="space-y-4 mb-6 animate-slide-up">
          <div className="p-6 sm:p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*,video/mp4,video/quicktime"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <UploadCloud size={24} />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Click to browse files or drag &amp; drop
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports MP4, JPG, PNG, WebP (up to 50MB each)
              </p>
            </label>
          </div>

          {/* Uploaded File List */}
          {creative.uploadedFiles && creative.uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Selected Files ({creative.uploadedFiles.length}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {creative.uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {file.type === "video" ? (
                        <FileVideo size={16} className="text-blue-500 shrink-0" />
                      ) : (
                        <ImageIcon size={16} className="text-emerald-500 shrink-0" />
                      )}
                      <span className="truncate text-slate-800 dark:text-slate-200 font-medium">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.id)}
                      className="text-slate-400 hover:text-red-500 ml-2 cursor-pointer"
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

      {/* Option B: Done by Us Info */}
      {creative.choice === "DONE_BY_US" && (
        <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2 mb-6 animate-slide-up">
          <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300">
            <Sparkles size={16} className="text-blue-600" />
            <span>Evoc Creative Studio Service Included</span>
          </div>
          <p className="text-xs leading-relaxed">
            Our creative directors will review your website / product info and craft 3-5 static carousel &amp; motion hook variants tailored for maximum click-through rates.
          </p>
        </div>
      )}

      {/* Optional Ad Campaign Notes */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 mb-6">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 block">
          Additional Notes or Special Offers (Optional)
        </label>
        <textarea
          rows={3}
          placeholder="e.g. Highlight flat 20% off code 'FESTIVE20', focus on cash on delivery, etc."
          value={creative.adNotes || ""}
          onChange={(e) => updateCreative({ adNotes: e.target.value })}
          className="w-full p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-medium outline-none focus:border-blue-600 leading-relaxed"
        />
      </div>

      {/* Submit / Launch Button */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleFinalLaunch}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all transform active:scale-[0.99] cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Transmitting Campaign to Evoc Hub...</span>
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
