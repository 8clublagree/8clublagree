import { NextResponse } from "next/server";
import supabaseServer from "../../supabase";
import dayjs from "dayjs";

async function expireOverduePackages() {
  const endOfToday = dayjs().endOf("day").toISOString();

  // Find all active packages whose expiration date has passed
  const { data: expiredPackages, error: fetchError } = await supabaseServer
    .from("client_packages")
    .select("id, user_id")
    .eq("status", "active")
    .lte("expiration_date", endOfToday);

  if (fetchError) {
    console.error("[expire-packages] Fetch error:", fetchError.message);
    return { expired: 0, error: fetchError.message };
  }

  if (!expiredPackages?.length) {
    console.log("[expire-packages] No overdue packages found.");
    return { expired: 0 };
  }

  const packageIds = expiredPackages.map((p) => p.id);
  const userIds = Array.from(new Set(expiredPackages.map((p) => p.user_id)));

  // Batch update all expired packages in one call
  const { error: updatePackagesError } = await supabaseServer
    .from("client_packages")
    .update({ status: "expired", expiration_date: dayjs().toISOString() })
    .in("id", packageIds);

  if (updatePackagesError) {
    console.error("[expire-packages] Package update error:", updatePackagesError.message);
    return { expired: 0, error: updatePackagesError.message };
  }

  // Batch zero out credits for all affected users in one call
  const { error: updateCreditsError } = await supabaseServer
    .from("user_credits")
    .update({ credits: 0 })
    .in("user_id", userIds);

  if (updateCreditsError) {
    console.error("[expire-packages] Credits update error:", updateCreditsError.message);
    return { expired: packageIds.length, error: updateCreditsError.message };
  }

  console.log(`[expire-packages] Expired ${packageIds.length} packages for ${userIds.length} users.`);
  return { expired: packageIds.length };
}

export async function GET(request: Request) {
  // Vercel sends CRON_SECRET in Authorization header; reject if set and missing/wrong
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await expireOverduePackages();
    return NextResponse.json({ status: "ok", ...result });
  } catch (err) {
    console.error("[expire-packages] Cron failed:", err);
    return NextResponse.json(
      { status: "error", message: String(err) },
      { status: 500 },
    );
  }
}
