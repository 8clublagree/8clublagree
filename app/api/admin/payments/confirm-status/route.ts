import { NextResponse } from "next/server";
import supabaseServer from "../../../supabase";
import { getDateFromToday } from "@/lib/utils";

export async function PUT(req: Request) {
  try {
    const {
      id,
      userID,
      credits,
      userCredits,
      clientPackageID,
      packageID,
      paymentMethod,
      packageName,
      validityPeriod,
      packageCredits,
    } = await req.json();

    const { error } = await supabaseServer.rpc("confirm_payment", {
      p_order_id: id,
      p_user_id: userID,
      p_credits: credits,
      p_user_credits: userCredits,
      p_client_package_id: clientPackageID || null,
      p_package_id: packageID,
      p_payment_method: paymentMethod,
      p_package_name: packageName,
      p_validity_period: validityPeriod,
      p_package_credits: packageCredits,
      p_expiration_date: getDateFromToday(validityPeriod),
    });

    if (error) {
      console.error("[confirm-status] RPC failed:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: { success: true } });
  } catch (err: unknown) {
    console.error("[confirm-status] Unexpected error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
