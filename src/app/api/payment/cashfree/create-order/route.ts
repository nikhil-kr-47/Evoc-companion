import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const cashfreeEnv = (process.env.CASHFREE_ENV || "sandbox").toLowerCase();

    if (!appId || !secretKey) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Configuration Error: CASHFREE_APP_ID and CASHFREE_SECRET_KEY are not configured on server.",
        },
        { status: 500 }
      );
    }

    const { amount, customerName, customerEmail, customerPhone, returnUrl } =
      await req.json();

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid payment amount." },
        { status: 400 }
      );
    }

    const orderAmount = Number(Number(amount).toFixed(2));
    const cashfreeOrderId = `evoc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`.slice(0, 45);
    const customerId = `cust_${Date.now()}`.slice(0, 45);

    // Sandbox Test Mode bypass using provided test credentials
    if (appId.startsWith("TEST_EVOC_") || secretKey.startsWith("TEST_EVOC_")) {
      return NextResponse.json({
        success: true,
        orderId: cashfreeOrderId,
        paymentSessionId: `session_sim_${Date.now()}`,
        environment: "sandbox",
        amount: orderAmount,
        currency: "INR",
        isSimulated: true,
      });
    }

    const apiBase =
      cashfreeEnv === "production"
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg";

    const cleanPhone = String(customerPhone || "").replace(/\D/g, "").slice(-10);
    const validPhone = cleanPhone.length === 10 ? cleanPhone : "9876543210";

    const orderPayload = {
      order_id: cashfreeOrderId,
      order_amount: orderAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        customer_name: (customerName || "Evoc Merchant").slice(0, 100),
        customer_email: (customerEmail || "merchant@evoclabs.com").slice(0, 100),
        customer_phone: validPhone,
      },
      order_meta: {
        return_url: returnUrl || "https://evoc-companion.vercel.app",
      },
      order_note: "Evoc Companion Meta Ads Launchpad Setup Fee",
    };

    const res = await fetch(`${apiBase}/orders`, {
      method: "POST",
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    const resData = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("[Cashfree create-order error]", res.status, resData);
      return NextResponse.json(
        {
          success: false,
          message:
            resData.message || `Cashfree API returned error ${res.status}`,
          details: resData,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: resData.order_id,
      paymentSessionId: resData.payment_session_id,
      environment: cashfreeEnv,
      amount: resData.order_amount,
      currency: resData.order_currency,
    });
  } catch (err: any) {
    console.error("[Cashfree create-order exception]", err);
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Failed to initialize Cashfree payment order",
      },
      { status: 500 }
    );
  }
}
