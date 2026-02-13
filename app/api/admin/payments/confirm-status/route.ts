import { NextResponse } from "next/server";
import supabaseServer from "../../../supabase";
import dayjs from "dayjs";
import { getDateFromToday } from "@/lib/utils";

export async function PUT(req: Request) {
  try {
    const today = dayjs();
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

    // --- Input validation ---
    // if (!id || !userID || credits == null) {
    //   return NextResponse.json(
    //     { error: "Missing required fields: id, userID, and credits are required." },
    //     { status: 400 },
    //   );
    // }

    // 1. Update order status
    const { data, error } = await supabaseServer
      .from("orders")
      .update({ status: "SUCCESSFUL", approved_at: today.toISOString() })
      .eq("id", id)
      .select();

    if (error) {
      console.error("[confirm-status] Failed to update order:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 2. If user has 0 credits, expire old package and create new one
    if (userCredits === 0) {
      const { error: clientPackageError } = await supabaseServer
        .from("client_packages")
        .update({ status: "expired", expiration_date: today.toISOString() })
        .eq("id", clientPackageID)
        .select();

      if (clientPackageError) {
        console.error("[confirm-status] Failed to expire client package:", clientPackageError.message);
        return NextResponse.json({ error: clientPackageError.message }, { status: 400 });
      }

      const { error: newClientPackageError } = await supabaseServer
        .from("client_packages")
        .insert({
          user_id: userID,
          package_id: packageID,
          status: "active",
          validity_period: validityPeriod,
          package_credits: packageCredits,
          purchase_date: today.toISOString(),
          package_name: packageName,
          payment_method: paymentMethod,
          expiration_date: getDateFromToday(validityPeriod),
        })
        .select();

      if (newClientPackageError) {
        console.error("[confirm-status] Failed to create new client package:", newClientPackageError.message);
        return NextResponse.json({ error: newClientPackageError.message }, { status: 400 });
      }
    }

    // 3. Update user credits
    const { error: userCreditsError } = await supabaseServer
      .from("user_credits")
      .update({ credits })
      .eq("user_id", userID)
      .select();

    if (userCreditsError) {
      console.error("[confirm-status] Failed to update user credits:", userCreditsError.message);
      return NextResponse.json({ error: userCreditsError.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err: unknown) {
    console.error("[confirm-status] Unexpected error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
