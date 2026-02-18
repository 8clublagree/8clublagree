import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function GET(req: NextRequest) {
  try {
    const data = Object.fromEntries(new URL(req.url).searchParams.entries());
    const userID = data.userID;

    if (!userID) {
      return NextResponse.json({ error: "Missing userID" }, { status: 400 });
    }

    const [profileResult, paymentResult] = await Promise.all([
      supabaseServer
        .from("user_profiles")
        .select(
          `
          *,
          user_credits (
            id,
            credits,
            created_at
          ),
          client_packages (
            *,
            packages (*)
          )
        `,
        )
        .eq("id", userID)
        .single(),
      supabaseServer
        .from("orders")
        .select("*")
        .eq("user_id", userID)
        .eq("status", "PENDING")
        .single(),
    ]);

    if (profileResult.error) {
      return NextResponse.json(
        { error: "Error fetching profile" },
        { status: 500 },
      );
    }

    if (!profileResult.data) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: {
        profile: profileResult.data,
        payment: paymentResult.data ?? null,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
