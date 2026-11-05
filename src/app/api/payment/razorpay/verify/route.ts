import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Configuration Error: RAZORPAY_KEY_SECRET environment variable is not configured on server.",
        },
        { status: 500 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing Razorpay verification parameters.",
        },
        { status: 400 }
      );
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(payload)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.warn("[Razorpay verify] Signature mismatch");
      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed. Invalid Razorpay signature.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      transactionId: razorpay_payment_id,
      orderId: razorpay_order_id,
      message: "Razorpay payment verified successfully.",
    });
  } catch (err: any) {
    console.error("[Razorpay verify exception]", err);
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Payment verification exception occurred",
      },
      { status: 500 }
    );
  }
}
