import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../supabase";
import { randomUUID } from "crypto";

const OTP_VALID_MINUTES = 15;

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp || typeof email !== "string" || typeof otp !== "string") {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otpTrimmed = otp.trim().replace(/\s/g, "");

    const since = new Date(
      Date.now() - OTP_VALID_MINUTES * 60 * 1000,
    ).toISOString();

    const { data: rows, error } = await supabaseServer
      .from("password_reset_requests")
      .select("id, email, requested_at, otp, reset_token, used_at")
      .eq("email", normalizedEmail)
      .gte("requested_at", since)
      .order("requested_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("verify-otp error:", error);
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 500 },
      );
    }

    const record = rows?.[0];
    if (!record || record.otp !== otpTrimmed) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 },
      );
    }

    if (record.used_at) {
      return NextResponse.json(
        { error: "This reset link has already been used" },
        { status: 400 },
      );
    }

    const resetToken = randomUUID();

    const { error: updateError } = await supabaseServer
      .from("password_reset_requests")
      .update({ reset_token: resetToken })
      .eq("id", record.id);

    if (updateError) {
      console.error("verify-otp update error:", updateError);
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 500 },
      );
    }

    const baseUrl =
      process.env.SYSTEM_ORIGIN ?? process.env.NEXT_PUBLIC_APP_URL ?? "";
    const redirectUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    return NextResponse.json({ redirectUrl });
  } catch (err) {
    console.error("verify-otp error:", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 },
    );
  }
}
