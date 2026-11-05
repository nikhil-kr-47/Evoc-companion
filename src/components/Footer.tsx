import React from "react";
import {
  ShieldCheck,
  Lock,
  Headphones,
  ExternalLink,
  MessageCircle,
  Mail,
  CheckCircle2,
  FileText,
  Rocket,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919548833953";
  const whatsappPhone = rawPhone.replace(/\D/g, "");

  return (
    <footer className="w-full border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/80 transition-colors mt-auto">
      {/* Top Value / Trust Highlights - Compact */}
      <div className="border-b border-slate-100 dark:border-white/5 py-2.5 px-3 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Meta Graph &amp; Conversion API v20.0 Verified</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Lock size={12} className="text-emerald-500" />
              <span>256-Bit SSL Secured</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-blue-600" />
              <span>Official GST Invoiced</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-blue-600" />
              <span>24-48h Kickoff</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer - Compact */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8 grid grid-cols-1 md:grid-cols-4 gap-5 text-xs">
        {/* Col 1: Brand & Mission */}
        <div className="space-y-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
              <Rocket size={13} />
            </div>
            <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-sm">
              EVOC COMPANION
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
            High-converting performance marketing engine engineered by <strong>Evoc Labs</strong>. We build, manage, and scale paid social campaigns that drive measurable ROAS.
          </p>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold text-[10px]">
            <span>Meta Business Partner</span>
          </div>
        </div>

        {/* Col 2: Services / Launchpad Solutions */}
        <div className="space-y-2">
          <h4 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white text-[10px]">
            Campaign Solutions
          </h4>
          <ul className="space-y-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
            <li>Meta Ads High-Intent Lead Generation</li>
            <li>Direct-to-Consumer (D2C) E-commerce ROAS</li>
            <li>Local Footfall &amp; Showroom Visits</li>
            <li>WhatsApp 1-on-1 Sales Closures</li>
            <li>App Installs &amp; User Acquisition</li>
          </ul>
        </div>

        {/* Col 3: Compliance & Legal */}
        <div className="space-y-2">
          <h4 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white text-[10px]">
            Security &amp; Compliance
          </h4>
          <ul className="space-y-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
            <li>Strict Meta Advertising Policy Compliance</li>
            <li>Dedicated Ad Account Isolation</li>
            <li>Zero Credential Sharing Policy</li>
            <li>18% GST Compliant Tax Invoicing</li>
            <li>NDA &amp; Commercial Client Privacy</li>
          </ul>
        </div>

        {/* Col 4: Support & Contact */}
        <div className="space-y-2">
          <h4 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white text-[10px]">
            Priority Support Desk
          </h4>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
            Have questions about your ad setup? Reach our strategists directly:
          </p>
          <div className="space-y-1 pt-0.5">
            <a
              href="mailto:contact@evoclabs.com"
              className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors font-medium text-[11px]"
            >
              <Mail size={12} className="text-blue-600" />
              <span>contact@evoclabs.com</span>
            </a>
            <a
              href={`https://wa.me/${whatsappPhone}?text=Hi%20Evoc%20Team,%20I%20have%20a%20question%20about%20Evoc%20Companion.`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors font-medium text-[11px]"
            >
              <MessageCircle size={12} className="text-emerald-600" />
              <span>WhatsApp Strategy Desk</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Bar */}
      <div className="border-t border-slate-100 dark:border-white/5 py-3 px-3 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400 dark:text-slate-500">
          <div>
            © {currentYear} Evoc Labs Private Limited. All rights reserved. Evoc Companion.
          </div>
          <div className="flex items-center gap-3">
            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span>•</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span>•</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">
              Refund Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
