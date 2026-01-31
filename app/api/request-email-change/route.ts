import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import supabaseServer from "../supabase";
import nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

export async function POST(req: Request) {
  try {


    const request = await req.json();

    const { email, userId } = request


    const { error } = await supabaseServer.auth.admin.updateUserById(userId, {
      email, email_confirm: true
    });


    if (error) {
      return NextResponse.json(
        {
          error: "Error updating authenticated email. Please try again.",
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Confirmation email sent. Please check your new email inbox.",
    });
  } catch (err: any) {
    console.error("Request email change error:", err);
    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
        details: err.message,
      },
      { status: 500 },
    );
  }
}
