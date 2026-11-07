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
      intakeStatus: "COMPLETED",
      createdAt: new Date().toISOString(),
    };

    // 1. Local standalone backup persistence
    try {
      ensureStorageDir();
      const existingRaw = fs.readFileSync(LOCAL_STORAGE_FILE, "utf8");
      let list = JSON.parse(existingRaw || "[]");

      // Remove any prior incomplete drop-off for this phone number
      list = list.filter(
        (item: any) =>
          !(
            item.phoneNumber === campaignRecord.phoneNumber &&
            item.intakeStatus === "LEFT_USER"
          )
      );

      list.unshift(campaignRecord);
      fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(list, null, 2), "utf8");
    } catch (saveErr) {
      console.warn("[submit-campaign] Local file persist error:", saveErr);
    }

    // 2. Sync to Orbit backend / admin CRM leads
    const orbitApiUrl = process.env.ORBIT_API_URL;
    if (!orbitApiUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Configuration Error: ORBIT_API_URL environment variable is not configured.",
        },
        { status: 500 }
      );
    }

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
        intakeStatus: "COMPLETED",
        campaignRef: referenceId,
        payment: campaignRecord.payment,
        websiteAnalysis: campaignRecord.websiteAnalysis,
        adAccountStatus: campaignRecord.adAccountStatus,
        creativePreference: campaignRecord.creativePreference,
        submittedAt: campaignRecord.createdAt,
      },
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(orbitApiUrl, {
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
        console.log(`[submit-campaign] Successfully synced to Orbit CRM at ${orbitApiUrl}`);
      } else {
        const errText = await res.text().catch(() => "");
        console.warn(`[submit-campaign] Orbit API error response (${res.status}):`, errText);
      }
    } catch (e: any) {
      console.error(`[submit-campaign] Failed to reach ORBIT_API_URL (${orbitApiUrl}):`, e.message);
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
