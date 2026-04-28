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
  console.log(`${packageIds.join(', ')}`);
  return { expired: packageIds.length };
}

async function expireSharedCredits(endOfToday: string) {
  // Mark pending (unclaimed) shared credits as expired when the package itself expires
  const { error: pendingError } = await supabaseServer
    .from("shared_credits")
    .update({ status: "expired" })
    .eq("status", "pending")
    .lte("expiration_date", endOfToday);

  if (pendingError) {
    console.error("[expire-packages] Shared credits pending expire error:", pendingError.message);
  }

  // Deduct claimed shared credits whose expiration_date has passed
  const { data: expiredShares, error: claimedFetchError } = await supabaseServer
    .from("shared_credits")
    .select("id, recipient_id, credits_amount")
    .eq("status", "claimed")
    .lte("expiration_date", endOfToday);

  if (claimedFetchError) {
    console.error("[expire-packages] Shared credits claimed fetch error:", claimedFetchError.message);
    return;
  }

  if (!expiredShares?.length) return;

  for (const share of expiredShares) {
    const { data: credits } = await supabaseServer
      .from("user_credits")
      .select("credits")
      .eq("user_id", share.recipient_id)
      .single();

    if (credits) {
      const newCredits = Math.max(0, (credits.credits ?? 0) - share.credits_amount);
      await supabaseServer
        .from("user_credits")
        .update({ credits: newCredits })
        .eq("user_id", share.recipient_id);
    }
  }

  const shareIds = expiredShares.map((s) => s.id);
  await supabaseServer
    .from("shared_credits")
    .update({ status: "expired" })
    .in("id", shareIds);

  console.log(`[expire-packages] Expired ${expiredShares.length} shared credit records.`);
}

async function expireTokenExpiredShares() {
  const now = dayjs().toISOString();

  const { data: tokenExpired } = await supabaseServer
    .from("shared_credits")
    .select("id, client_package_id, credits_amount")
    .eq("status", "pending")
    .lte("token_expires_at", now);

  if (!tokenExpired?.length) return;

  for (const share of tokenExpired) {
    const { data: pkg } = await supabaseServer
      .from("client_packages")
      .select("number_of_credits_shared")
      .eq("id", share.client_package_id)
      .single();

    if (pkg) {
      await supabaseServer
        .from("client_packages")
        .update({
          number_of_credits_shared: Math.max(0, (pkg.number_of_credits_shared ?? 0) - share.credits_amount),
        })
        .eq("id", share.client_package_id);
    }
  }

  const ids = tokenExpired.map((s) => s.id);
  await supabaseServer
    .from("shared_credits")
    .update({ status: "expired" })
    .in("id", ids);

  console.log(`[expire-packages] Token-expired ${tokenExpired.length} pending share(s), refunded to sender packages.`);
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
    const endOfToday = dayjs().endOf("day").toISOString();
    await expireSharedCredits(endOfToday);
    await expireTokenExpiredShares();
    return NextResponse.json({ status: "ok", ...result });
  } catch (err) {
    console.error("[expire-packages] Cron failed:", err);
    return NextResponse.json(
      { status: "error", message: String(err) },
      { status: 500 },
    );
  }
}
