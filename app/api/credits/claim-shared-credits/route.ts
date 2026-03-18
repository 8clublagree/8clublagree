import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../supabase";
import dayjs from "dayjs";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Missing token" },
        { status: 400 },
      );
    }

    const { data: shareRecord, error: fetchError } = await supabaseServer
      .from("shared_credits")
      .select("*")
      .eq("token", token)
      .single();

    if (fetchError || !shareRecord) {
      return NextResponse.json(
        { error: "Invalid or expired link" },
        { status: 404 },
      );
    }

    if (shareRecord.status === "claimed") {
      return NextResponse.json(
        { error: "These credits have already been claimed" },
        { status: 400 },
      );
    }

    if (shareRecord.status === "expired") {
      return NextResponse.json(
        { error: "This share link has expired" },
        { status: 400 },
      );
    }

    if (dayjs().isAfter(dayjs(shareRecord.token_expires_at))) {
      await supabaseServer
        .from("shared_credits")
        .update({ status: "expired" })
        .eq("id", shareRecord.id);

      const { data: senderPkg } = await supabaseServer
        .from("client_packages")
        .select("number_of_credits_shared")
        .eq("id", shareRecord.client_package_id)
        .single();

      if (senderPkg) {
        await supabaseServer
          .from("client_packages")
          .update({
            number_of_credits_shared: Math.max(0, (senderPkg.number_of_credits_shared ?? 0) - shareRecord.credits_amount),
          })
          .eq("id", shareRecord.client_package_id);
      }

      return NextResponse.json(
        { error: "This share link has expired" },
        { status: 400 },
      );
    }

    const [recipientCreditsResult, senderPackageResult, recipientResult] = await Promise.all([
      supabaseServer
        .from("user_credits")
        .select("credits")
        .eq("user_id", shareRecord.recipient_id)
        .single(),
      supabaseServer
        .from("client_packages")
        .select("*")
        .eq("id", shareRecord.client_package_id)
        .single(),
      supabaseServer
        .from("user_profiles")
        .select("full_name")
        .eq("id", shareRecord.recipient_id)
        .single(),
    ]);

    if (recipientCreditsResult.error || !recipientCreditsResult.data) {
      return NextResponse.json(
        { error: "Recipient account error" },
        { status: 500 },
      );
    }

    if (senderPackageResult.error || !senderPackageResult.data) {
      return NextResponse.json(
        { error: "Sender package not found" },
        { status: 500 },
      );
    }

    const recipientCredits = recipientCreditsResult.data;
    const senderPackage = senderPackageResult.data;
    const recipient = recipientResult.data;
    const newCredits = (recipientCredits.credits ?? 0) + shareRecord.credits_amount;

    const { error: updateCreditsError } = await supabaseServer
      .from("user_credits")
      .update({ credits: newCredits })
      .eq("user_id", shareRecord.recipient_id);

    if (updateCreditsError) {
      console.error("[claim-shared-credits] Update credits error:", updateCreditsError);
      return NextResponse.json(
        { error: "Failed to add credits" },
        { status: 500 },
      );
    }

    const { error: insertPackageError } = await supabaseServer
      .from("client_packages")
      .insert({
        user_id: shareRecord.recipient_id,
        package_id: senderPackage.package_id,
        status: "active",
        validity_period: senderPackage.validity_period,
        package_credits: shareRecord.credits_amount,
        purchase_date: dayjs().toISOString(),
        package_name: senderPackage.package_name,
        payment_method: "shared",
        expiration_date: shareRecord.expiration_date,
        is_shared: true,
        number_of_shared_credits_used: 0
      });

    if (insertPackageError) {
      console.error("[claim-shared-credits] Insert client_packages error:", insertPackageError);
    }

    const { error: updateStatusError } = await supabaseServer
      .from("shared_credits")
      .update({ status: "claimed" })
      .eq("id", shareRecord.id);

    if (updateStatusError) {
      console.error("[claim-shared-credits] Update status error:", updateStatusError);
    }

    return NextResponse.json({
      data: {
        recipientName: recipient?.full_name ?? "there",
        creditsAmount: shareRecord.credits_amount,
        expirationDate: shareRecord.expiration_date,
      },
    });
  } catch (err) {
    console.error("[claim-shared-credits] error:", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 },
    );
  }
}
