import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { requestReferenceNumber, status, checkoutId, totalAmount } = payload;

    console.log("Maya webhook received:", payload);

    // 🚨 IMPORTANT:
    // Do NOT rely on redirect status
    // Webhook is the source of truth

    if (status === "PAYMENT_SUCCESS") {
      // TODO: mark order as PAID in your DB
      console.log("payment success");
    } else {
      console.log("payment failed");
      // TODO: mark order as FAILED / CANCELLED / EXPIRED
    }

    const response = await supabaseServer
      .from("package_purchase_history")
      .insert({
        status,
        referenceID: requestReferenceNumber,
        checkoutID: checkoutId,
      });

    console.log("payload: ", payload);
    console.log("response: ", response);

    // ✅ Maya REQUIRES HTTP 200
    return NextResponse.json({ received: true, data: payload });
  } catch (error) {
    console.error("Webhook error:", error);

    // ❌ Non-200 = Maya retry = AT failure risk
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}
