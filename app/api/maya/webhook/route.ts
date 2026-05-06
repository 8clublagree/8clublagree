import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../supabase";
import dayjs from "dayjs";
import { getDateFromToday } from "@/lib/utils";

const WEBHOOK_STATUS = {
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  PAYMENT_EXPIRED: "PAYMENT_EXPIRED",
  PAYMENT_CANCELLED: "PAYMENT_CANCELLED",
};

const handleAssignCredits = async ({ referenceId }: { referenceId: string }) => {
  try {
    const { data: orderData } = await supabaseServer
      .from("orders")
      .select(`*`)
      .eq("reference_id", referenceId)
      .single();

    if (!orderData) return;

    const { data: userCreditsData, error: userCreditsError } = await supabaseServer
      .from("user_credits")
      .select("credits")
      .eq("user_id", orderData.user_id)
      .single();

    if (userCreditsError) {
      throw userCreditsError;
    }

    const { error: confirmError } = await supabaseServer.rpc("confirm_payment", {
      p_order_id: orderData.id,
      p_user_id: orderData.user_id,
      p_credits: orderData.package_credits,
      p_user_credits: userCreditsData?.credits ?? 0,
      p_client_package_id: orderData.previous_active_package_id ?? null,
      p_package_id: orderData.package_id,
      p_payment_method: orderData.payment_method,
      p_package_name: orderData.package_title,
      p_validity_period: orderData.package_validity_period,
      p_package_credits: orderData.package_credits,
      p_expiration_date: getDateFromToday(orderData.package_validity_period),
      p_is_shareable: orderData.is_shareable ?? false,
      p_shareable_credits: orderData.shareable_credits ?? 0,
      p_number_of_credits_shared: orderData.number_of_credits_shared ?? 0,
      p_is_trial_package: orderData.is_trial_package ?? false,
      p_discount_code: orderData.discount_code ?? null,
    });

    if (confirmError) {
      throw confirmError;
    }
  } catch (error) {
    throw error;
  }
};

export async function POST(req: NextRequest) {
  try {

    let nextResponse: any;
    const payload = await req.json();
    const {
      requestReferenceNumber,
      checkoutId,

    } = payload;
    const status = (payload.status ?? "").toString().toUpperCase();

    let savePurchase = await supabaseServer
      .from("package_purchase_history")
      .insert({
        status,
        referenceID: requestReferenceNumber,
        checkoutID: checkoutId,

        temp: JSON.stringify(payload)
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

        await supabaseServer
          .from("orders")
          .update({ status: "FAILED" })
          .eq("reference_id", requestReferenceNumber);

        break;
      case WEBHOOK_STATUS.PAYMENT_EXPIRED:
        nextResponse = { received: false, message: "Payment has expired" };

        await supabaseServer
          .from("orders")
          .update({ status: "EXPIRED" })
          .eq("reference_id", requestReferenceNumber);
        break;
      case WEBHOOK_STATUS.PAYMENT_CANCELLED:
        nextResponse = {
          received: false,
          message: "Payment has been cancelled",
        };

        await supabaseServer
          .from("orders")
          .update({ status: "CANCELLED" })
          .eq("reference_id", requestReferenceNumber);
        break;
    }

    if (status === WEBHOOK_STATUS.PAYMENT_SUCCESS) {
      try {
        await handleAssignCredits({ referenceId: requestReferenceNumber });
      } catch (err) {
        console.error("Assign credits failed:", err);
        return NextResponse.json(
          { error: "Failed to finalize successful payment." },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(nextResponse);
  } catch (error) {
    console.error("Webhook error:", error);

    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}
