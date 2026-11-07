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
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: "Phone number is required." },
        { status: 400 }
      );
    }

    const cleanPhone = String(phoneNumber).replace(/\D/g, "").slice(-10);
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, message: "Invalid 10-digit mobile number." },
        { status: 400 }
      );
    }

    const dropoffRecord = {
      referenceId: `EVOC-DROP-${cleanPhone.slice(-4)}-${Date.now().toString().slice(-4)}`,
      businessName: `Lead (${cleanPhone.slice(-4)})`,
      contactPerson: "Drop-off Visitor",
      phoneNumber: cleanPhone,
      formType: "MetaAdsLaunchpad",
      status: "LEADS",
      intakeStatus: "LEFT_USER",
      createdAt: new Date().toISOString(),
    };

    // 1. Local backup save
    try {
      ensureStorageDir();
      const existingRaw = fs.readFileSync(LOCAL_STORAGE_FILE, "utf8");
      const list = JSON.parse(existingRaw || "[]");

      // Check if this phone already exists in local list
      const existingIdx = list.findIndex(
        (item: any) => item.phoneNumber === cleanPhone
      );

      if (existingIdx >= 0) {
        // Only update if it was still a left user
        if (list[existingIdx].intakeStatus === "LEFT_USER") {
          list[existingIdx].updatedAt = new Date().toISOString();
        }
      } else {
        list.unshift(dropoffRecord);
      }

      fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(list, null, 2), "utf8");
    } catch (saveErr) {
      console.warn("[track-step1] Local file persist error:", saveErr);
    }

    // 2. Sync to Orbit backend CRM as LEFT_USER
    const orbitApiUrl = process.env.ORBIT_API_URL;
    let orbitSynced = false;

    if (orbitApiUrl) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(orbitApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            name: `Left User (${cleanPhone.slice(-4)})`,
            companyName: `Lead (${cleanPhone.slice(-4)})`,
            phoneNumber: cleanPhone,
            formType: "MetaAdsLaunchpad",
            message: "User entered mobile number at Step 1 and dropped off before completing intake.",
            status: "LEADS",
            metadata: {
              source: "EvocCompanion",
              intakeStatus: "LEFT_USER",
              stepReached: 1,
              droppedAt: new Date().toISOString(),
            },
          }),
        });
        clearTimeout(timeout);
        if (res.ok) orbitSynced = true;
      } catch (orbitErr: any) {
        console.warn("[track-step1] Orbit CRM sync warning:", orbitErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      phoneNumber: cleanPhone,
      orbitSynced,
    });
  } catch (err: any) {
    console.error("[track-step1] Error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to record drop-off" },
      { status: 500 }
    );
  }
}
