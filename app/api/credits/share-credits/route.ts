import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../supabase";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";
import { EMAIL_TEMPLATE } from "@/lib/email-templates";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function POST(req: NextRequest) {
  try {
    const { senderID, recipientEmail, creditsAmount = 1 } = await req.json();

    if (!senderID || !recipientEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const [senderResult, recipientResult] = await Promise.all([
      supabaseServer
        .from("user_profiles")
        .select("id, full_name, user_credits(credits, shareable_credits)")
        .eq("id", senderID)
        .single(),
      supabaseServer
        .from("user_profiles")
        .select("id, full_name, email")
        .eq("email", recipientEmail)
        .single(),
    ]);

    if (senderResult.error || !senderResult.data) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 });
    }

    if (recipientResult.error || !recipientResult.data) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 },
      );
    }

    if (senderResult.data.id === recipientResult.data.id) {
      return NextResponse.json(
        { error: "You cannot share credits with yourself" },
        { status: 400 },
      );
    }



    // const senderCredits = (senderResult.data as any).user_credits?.[0];
    // const shareableRemaining = senderCredits?.shareable_credits ?? 0;

    // console.log('shareableRemaining: ', shareableRemaining)
    // console.log('creditsAmount: ', creditsAmount)

    // if (shareableRemaining < creditsAmount) {
    //   return NextResponse.json(
    //     { error: "Not enough shareable credits" },
    //     { status: 400 },
    //   );
    // }

    const { data: activePackage, error: pkgError } = await supabaseServer
      .from("client_packages")
      .select("id, expiration_date, number_of_credits_shared")
      .eq("user_id", senderID)
      .eq("status", "active")
      .single();

    if (pkgError || !activePackage) {
      return NextResponse.json(
        { error: "No active package found" },
        { status: 400 },
      );
    }

    const token = randomUUID();
    const tokenExpiresAt = dayjs().add(24, "hour").toISOString();

    const { error: insertError } = await supabaseServer
      .from("shared_credits")
      .insert({
        token,
        sender_id: senderID,
        sender_name: senderResult.data.full_name,
        recipient_id: recipientResult.data.id,
        recipient_email: recipientEmail,
        credits_amount: creditsAmount,
        client_package_id: activePackage.id,
        expiration_date: activePackage.expiration_date,
        token_expires_at: tokenExpiresAt,
        status: "pending",
      });

    if (insertError) {
      console.error("[share-credits] Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create share record" },
        { status: 500 },
      );
    }

    const { error: updatePkgError } = await supabaseServer
      .from("client_packages")
      .update({
        number_of_credits_shared: (activePackage?.number_of_credits_shared ?? 0) + creditsAmount,
      })
      .eq("id", activePackage.id);

    if (updatePkgError) {
      console.error("[share-credits] Update client_packages error:", updatePkgError);
    }



    /**
     * TEST
     * 
     * const host =
      req.headers.get("x-forwarded-host") ??
      req.headers.get("host") ??
      "lagree-booking-system.vercel.app";
    const protocol = host.includes("localhost") ? "http" : "https";
    const claimLink = `${protocol}://${host}/claim-credits?token=${token}`;
     */

    const origin = process.env.SYSTEM_ORIGIN!!
    const claimLink = `${origin}/claim-credits?token=${token}`;

    const template = EMAIL_TEMPLATE.credit_share_invitation;
    const { subject, body } = template({
      senderName: senderResult.data.full_name,
      creditsAmount,
      claimLink,
    });

    const apiToken = process.env.MAILTRAP_TOKEN!;
    if (apiToken?.trim()) {
      const transport = nodemailer.createTransport(
        MailtrapTransport({ token: apiToken }),
      );

      await transport.sendMail({
        from: "8 Club Lagree <noreply@8clublagree.com>",
        to: [recipientEmail],
        subject,
        html: body,
      });
    }

    return NextResponse.json({
      data: { message: "Credits shared successfully" },
    });
  } catch (err) {
    console.error("[share-credits] error:", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 },
    );
  }
}
