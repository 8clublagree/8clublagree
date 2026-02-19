import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function GET(req: NextRequest) {
  try {
    const data = Object.fromEntries(new URL(req.url).searchParams.entries());

    const [profileResult, instructorsResult] = await Promise.all([
      supabaseServer
        .from("user_profiles")
        .select("*")
        .eq("id", data.id)
        .maybeSingle(),
      supabaseServer
        .from("user_profiles")
        .select("id, avatar_path, deactivated, full_name, first_name, instructors ( id )")
        .eq("user_type", "instructor"),
    ]);

    if (profileResult.error || instructorsResult.error) {
      return NextResponse.json(
        { error: profileResult.error?.message || instructorsResult.error?.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ data: profileResult.data, instructors: instructorsResult.data });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
