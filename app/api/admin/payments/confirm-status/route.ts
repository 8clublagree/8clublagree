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

    const operations: PromiseLike<{ error: any }>[] = [
      supabaseServer
        .from("orders")
        .update({ status: "SUCCESSFUL", approved_at: today.toISOString() })
        .eq("id", id)
        .select(),
      supabaseServer
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
        .select(),
      supabaseServer
        .from("user_credits")
        .update({ credits })
        .eq("user_id", userID)
        .select(),
    ];

    if (clientPackageID && (userCredits === 0 || userCredits === null)) {
      operations.push(
        supabaseServer
          .from("client_packages")
          .update({ status: "expired", expiration_date: today.toISOString() })
          .eq("id", clientPackageID)
          .select(),
      );
    }

    const results = await Promise.all(operations);

    const failed = results.find((r) => r.error);
    if (failed) {
      console.error("[confirm-status] Operation failed:", failed.error);
      return NextResponse.json({ error: failed.error.message }, { status: 400 });
    }

    return NextResponse.json({ data: results[0] });
  } catch (err: unknown) {
    console.error("[confirm-status] Unexpected error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
