import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOCAL_STORAGE_FILE = path.join(process.cwd(), "data", "submissions.json");

function ensureStorageDir() {
  const dir = path.dirname(LOCAL_STORAGE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_STORAGE_FILE)) {
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const referenceId = `EVOC-CMP-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`;

    const campaignRecord = {
      referenceId,
      businessName: payload.businessName || "Unnamed Business",
      contactPerson: payload.contactPerson || "",
      phoneNumber: payload.phoneNumber || "",
      email: payload.email || "",
      objective: payload.objective || "",
      businessType: payload.businessType || "",
      subCategory: Array.isArray(payload.subCategories)
        ? payload.subCategories.join(", ")
        : payload.subCategory || "",
      hasWebsite: payload.website?.hasWebsite ?? payload.hasWebsite ?? false,
      websiteUrl: payload.website?.url || payload.websiteUrl || "",
      websiteAnalysis: payload.website?.aiAnalysis || payload.websiteAnalysis || null,
      businessDescription: payload.website?.elaboration || payload.businessDescription || "",
      audience: payload.audience || {},
      payment: payload.payment || {
        amount: 1178.82,
        base: 999,
        gst: 179.82,
        status: "COMPLETED",
      },
      adAccountStatus: payload.adAccount || payload.adAccountStatus || {},
      creativePreference: payload.creative || payload.creativePreference || {},
      createdAt: new Date().toISOString(),
    };

    // 1. Local standalone backup persistence
    try {
      ensureStorageDir();
      const existingRaw = fs.readFileSync(LOCAL_STORAGE_FILE, "utf8");
      const list = JSON.parse(existingRaw || "[]");
      list.unshift(campaignRecord);
      fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(list, null, 2), "utf8");
    } catch (saveErr) {
      console.warn("[submit-campaign] Local file persist error:", saveErr);
    }

    // 2. Sync to Orbit backend / admin CRM leads
    const orbitApiUrls = [
      process.env.ORBIT_API_URL || "",
      "http://127.0.0.1:3000/api/leads",
      "http://127.0.0.1:3001/api/leads",
      "http://127.0.0.1:5001/api/leads",
      "http://127.0.0.1:5000/api/leads",
      "https://api.evoclabs.com/api/leads",
    ].filter(Boolean);

    let orbitSynced = false;
    let orbitLeadId = null;

    const orbitPayload = {
      name: campaignRecord.contactPerson || campaignRecord.businessName,
      companyName: campaignRecord.businessName,
      phoneNumber: campaignRecord.phoneNumber,
      email: campaignRecord.email,
      formType: "MetaAdsLaunchpad",
      goals: campaignRecord.objective,
      category: `${campaignRecord.businessType} / ${campaignRecord.subCategory}`,
      website: campaignRecord.websiteUrl,
      message: campaignRecord.businessDescription || `Evoc Companion Campaign (${campaignRecord.objective})`,
      target: JSON.stringify(campaignRecord.audience),
      metadata: {
        source: "EvocCompanion",
        campaignRef: referenceId,
        payment: campaignRecord.payment,
        websiteAnalysis: campaignRecord.websiteAnalysis,
        adAccountStatus: campaignRecord.adAccountStatus,
        creativePreference: campaignRecord.creativePreference,
        submittedAt: campaignRecord.createdAt,
      },
    };

    for (const url of orbitApiUrls) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orbitPayload),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (res.ok) {
          const resData = await res.json().catch(() => ({}));
          orbitSynced = true;
          orbitLeadId = resData.id || resData.data?.id || null;
          console.log(`[submit-campaign] Successfully synced to Orbit CRM at ${url}`);
          break;
        }
      } catch (e) {
        // Continue fallback attempts
      }
    }

    return NextResponse.json({
      success: true,
      referenceId,
      orbitSynced,
      orbitLeadId,
      campaign: campaignRecord,
      message: "Campaign onboarded successfully! Team is reviewing your inputs.",
    });
  } catch (err: any) {
    console.error("[submit-campaign] Fatal error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to submit campaign" },
      { status: 500 }
    );
  }
}
