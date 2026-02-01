import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RATE_LIMIT_PRESETS } from "@/lib/rate-limits";
import nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";
import { EMAIL_TEMPLATE } from "@/lib/email-templates";
import supabaseServer from "../supabase";

const OTP_LENGTH = 6;

function generateOtp(): string {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    const { allowed } = rateLimit(
      `reset:${email}`,
      RATE_LIMIT_PRESETS.resetLink,
    );
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many reset attempts today" },
        { status: 429 },
      );
    }

    const otp = generateOtp();

    const { error: insertError } = await supabaseServer
      .from("password_reset_requests")
      .insert({
        email: email.trim().toLowerCase(),
        requested_at: new Date().toISOString(),
        otp,
      });

    if (insertError) {
      console.error("request-password-reset insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create reset request" },
        { status: 500 },
      );
    }

    const template = EMAIL_TEMPLATE.password_reset_otp;
    const { subject, body } = template({ otp });

    /**
   * SANDBOX SNIPPET START
   */

    // const transport = nodemailer.createTransport({
    //   host: process.env.MAILTRAP_HOST,
    //   port: Number(process.env.MAILTRAP_PORT) || 587,
    //   auth: {
    //     user: process.env.MAILTRAP_USERNAME,
    //     pass: process.env.MAILTRAP_PASSWORD,
    //   },
    // });

    // const info = await transport.sendMail({
    //   from: '"8ClubLagree" <8clublagree@gmail.com>',
    //   to: [email],
    //   subject,
    //   html: body,
    // });

    /**
     * SANDBOX SNIPPET END
     */
    // ==========================================

    const transport = nodemailer.createTransport(
      MailtrapTransport({
        token: process.env.MAILTRAP_TOKEN!!,
      }),
    );


    await transport.sendMail({
      from: "8 Club Lagree <noreply@8clublagree.com>",
      to: [email],
      subject,
      html: body,
    });

    return NextResponse.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("request-password-reset error:", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 },
    );
  }
}
