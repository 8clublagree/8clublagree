import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../supabase";

async function fetchInstructorsWithRetry(retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const result = await supabaseServer
      .from("user_profiles")
      .select("id, avatar_path, deactivated, full_name, first_name, instructors ( id )")
      .eq("user_type", "instructor");

    if (!result.error) return result;

    console.error(
      `[initialize-user] Instructor fetch attempt ${attempt + 1}/${retries} failed:`,
      result.error,
    );

    if (attempt < retries - 1) {
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  return { data: null, error: "Failed after retries" };
}

export async function GET(req: NextRequest) {
  try {
    const data = Object.fromEntries(new URL(req.url).searchParams.entries());
    const userID = data.userID;

    if (!userID) {
      return NextResponse.json({ error: "Missing userID" }, { status: 400 });
    }

    const [profileResult, paymentResult, instructorsResults] = await Promise.all([
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
      fetchInstructorsWithRetry(),
    ]);

    if (profileResult.error) {
      console.error("[initialize-user] Profile fetch failed:", profileResult.error);
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

    if (instructorsResults.error) {
      console.error("[initialize-user] Instructors fetch ultimately failed:", instructorsResults.error);
    }

    return NextResponse.json({
      data: {
        profile: profileResult.data,
        payment: paymentResult.data ?? null,
        instructors: instructorsResults.data ?? null,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
