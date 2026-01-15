import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../supabase";

const WEBHOOK_STATUS = {
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  PAYMENT_EXPIRED: "PAYMENT_EXPIRED",
  PAYMENT_CANCELLED: "PAYMENT_CANCELLED",
};

export async function POST(req: NextRequest) {
  try {
    let nextResponse: any;
    const payload = await req.json();
    const { requestReferenceNumber, status, checkoutId, totalAmount } = payload;

    let savePurchase = await supabaseServer
      .from("package_purchase_history")
      .insert({
        status,
        referenceID: requestReferenceNumber,
        checkoutID: checkoutId,
      });

    switch (status) {
      case WEBHOOK_STATUS.PAYMENT_SUCCESS:
        nextResponse = {
          received: true,
          message: "Payment successful",
          data: payload,
          savePurchase,
        };
        break;
      case WEBHOOK_STATUS.PAYMENT_FAILED:
        nextResponse = { received: false, message: "Payment has failed" };
        break;
      case WEBHOOK_STATUS.PAYMENT_EXPIRED:
        nextResponse = { received: false, message: "Payment has expired" };
        break;
      case WEBHOOK_STATUS.PAYMENT_CANCELLED:
        nextResponse = {
          received: false,
          message: "Payment has been cancelled",
        };
        break;
    }

    return NextResponse.json(nextResponse);
  } catch (error) {
    console.error("Webhook error:", error);

    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}
