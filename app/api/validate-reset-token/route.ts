import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../supabase";

const TOKEN_VALID_MINUTES = 15;

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token is required", valid: false },
        { status: 400 },
      );
    }

    const since = new Date(
      Date.now() - TOKEN_VALID_MINUTES * 60 * 1000,
    ).toISOString();

    const { data: rows, error } = await supabaseServer
      .from("password_reset_requests")
      .select("id, email, requested_at, used_at")
      .eq("reset_token", token)
      .gte("requested_at", since)
      .limit(1);

    if (error) {
      console.error("validate-reset-token error:", error);
      return NextResponse.json(
        { error: "Validation failed", valid: false },
        { status: 500 },
      );
    }

    const record = rows?.[0];
    if (!record) {
      return NextResponse.json(
        { error: "Invalid or expired link", valid: false },
        { status: 400 },
      );
    }

    if (record.used_at) {
      return NextResponse.json(
        { error: "This link has already been used", valid: false },
        { status: 400 },
      );
    }

    return NextResponse.json({
      valid: true,
      email: record.email,
    });
  } catch (err) {
    console.error("validate-reset-token error:", err);
    return NextResponse.json(
      { error: "Unexpected error", valid: false },
      { status: 500 },
    );
  }
}
