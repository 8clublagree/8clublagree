import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../supabase";

const TOKEN_VALID_MINUTES = 15;

export async function POST(req: NextRequest) {
  try {
    const { token, new_password } = await req.json();

    if (!token || !new_password) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 },
      );
    }

    if (typeof new_password !== "string" || new_password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const since = new Date(
      Date.now() - TOKEN_VALID_MINUTES * 60 * 1000,
    ).toISOString();

    const { data: rows, error } = await supabaseServer
      .from("password_reset_requests")
      .select("id, email, used_at")
      .eq("reset_token", token)
      .gte("requested_at", since)
      .limit(1);

    if (error) {
      console.error("reset-password-with-token error:", error);
      return NextResponse.json(
        { error: "Reset failed" },
        { status: 500 },
      );
    }

    const record = rows?.[0];
    if (!record) {
      return NextResponse.json(
        { error: "Invalid or expired link" },
        { status: 400 },
      );
    }

    if (record.used_at) {
      return NextResponse.json(
        { error: "This link has already been used" },
        { status: 400 },
      );
    }

    const {
      data: { users },
      error: listError,
    } = await supabaseServer.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listError) {
      console.error("reset-password listUsers error:", listError);
      return NextResponse.json(
        { error: "Reset failed" },
        { status: 500 },
      );
    }

    const user = users?.find(
      (u) => u.email?.toLowerCase() === record.email.toLowerCase(),
    );
    if (!user) {
      return NextResponse.json(
        { error: "No account found for this email" },
        { status: 404 },
      );
    }

    const { error: updateError } = await supabaseServer.auth.admin.updateUserById(
      user.id,
      { password: new_password },
    );

    if (updateError) {
      console.error("reset-password updateUser error:", updateError);
      return NextResponse.json(
        { error: updateError.message ?? "Failed to update password" },
        { status: 500 },
      );
    }

    await supabaseServer
      .from("password_reset_requests")
      .update({ used_at: new Date().toISOString() })
      .eq("id", record.id);

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("reset-password-with-token error:", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 },
    );
  }
}
