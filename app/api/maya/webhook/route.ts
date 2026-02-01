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

    const orderObject = {
      userID: orderData.user_id,
      packageID: orderData.package_id,
      paymentMethod: orderData.payment_method,
      validityPeriod: orderData.package_validity_period,
      packageCredits: orderData.package_credits,
      packageName: orderData.package_title,
    };

    const updateUserCredits = supabaseServer
      .from("user_credits")
      .update({ credits: Number(orderObject.packageCredits) })
      .eq("user_id", orderObject.userID)
      .select()
      .single();

    const expirePreviousPackage = orderData.previous_active_package_id
      ? supabaseServer
        .from("client_packages")
        .update({
          status: "expired",
          expiration_date: dayjs().toISOString(),
        })
        .eq("id", orderData.previous_active_package_id)
      : Promise.resolve({ error: null });

    await Promise.all([updateUserCredits, expirePreviousPackage]);

    await supabaseServer.from("client_packages").insert({
      user_id: orderObject.userID,
      package_id: orderObject.packageID,
      status: "active",
      validity_period: orderObject.validityPeriod,
      package_credits: orderObject.packageCredits,
      purchase_date: dayjs().toISOString(),
      package_name: orderObject.packageName,
      payment_method: "maya",
      expiration_date: getDateFromToday(orderObject.validityPeriod),
    });
  } catch (error) {
    throw error;
  }
};

export async function POST(req: NextRequest) {
  try {
    let orderStatus: string = "";
    let nextResponse: any;
    const payload = await req.json();
    const {
      requestReferenceNumber,
      checkoutId,
      totalAmount,
    } = payload;
    const status = (payload.status ?? "").toString().toUpperCase();

    let savePurchase = await supabaseServer
      .from("package_purchase_history")
      .insert({
        status,
        referenceID: requestReferenceNumber,
        checkoutID: checkoutId,
        // temporary just to see the payload
        temp: JSON.stringify(payload)
      });

    // await supabaseServer
    //   .from("orders")
    //   .update({ status: "PENDING" })
    //   .eq("reference_id", requestReferenceNumber);

    switch (status) {
      case WEBHOOK_STATUS.PAYMENT_SUCCESS:
        nextResponse = {
          received: true,
          message: "Payment successful",
          data: payload,
          savePurchase,
        };

        orderStatus = "SUCCESSFUL";
        break;
      case WEBHOOK_STATUS.PAYMENT_FAILED:
        nextResponse = { received: false, message: "Payment has failed" };
        orderStatus = "FAILED";

        await supabaseServer
          .from("orders")
          .update({ status: "FAILED" })
          .eq("reference_id", requestReferenceNumber);

        break;
      case WEBHOOK_STATUS.PAYMENT_EXPIRED:
        nextResponse = { received: false, message: "Payment has expired" };
        orderStatus = "EXPIRED";

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
        orderStatus = "CANCELLED";

        await supabaseServer
          .from("orders")
          .update({ status: "CANCELLED" })
          .eq("reference_id", requestReferenceNumber);
        break;
    }

    if (status === WEBHOOK_STATUS.PAYMENT_SUCCESS) {
      await Promise.all([
        handleAssignCredits({ referenceId: requestReferenceNumber }).catch(
          (err) => console.error("Assign credits failed:", err),
        ),
        supabaseServer
          .from("orders")
          .update({
            status: "SUCCESSFUL",
            approved_at: dayjs().toISOString(),
          })
          .eq("reference_id", requestReferenceNumber),
      ]);
    }

    return NextResponse.json(nextResponse);
  } catch (error) {
    console.error("Webhook error:", error);

    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}
