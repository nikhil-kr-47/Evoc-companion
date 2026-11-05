import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Configuration Error: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables are not configured on server.",
        },
        { status: 500 }
      );
    }

    const { amount, receipt, notes } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid payment amount." },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(Number(amount) * 100);
    const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: receipt || `rcpt_${Date.now()}`.slice(0, 40),
        notes: notes || { source: "EvocCompanion" },
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[Razorpay create-order error]", res.status, errText);
      return NextResponse.json(
        {
          success: false,
          message: `Razorpay Order API Error (${res.status}): ${errText}`,
        },
        { status: 502 }
      );
    }

    const orderData = await res.json();

    return NextResponse.json({
      success: true,
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      keyId,
    });
  } catch (err: any) {
    console.error("[Razorpay create-order exception]", err);
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Failed to create Razorpay payment order",
      },
      { status: 500 }
    );
  }
}
