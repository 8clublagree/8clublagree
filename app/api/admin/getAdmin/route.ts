import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function GET(req: NextRequest) {
  try {
    const data = Object.fromEntries(new URL(req.url).searchParams.entries());

    const [profileResult, userProfileResult, instructorsResult] = await Promise.all([
      supabaseServer
        .from("user_profiles")
        .select("*")
        .eq("id", data.id)
        .maybeSingle(),
      supabaseServer
        .from("user_profiles")
        .select("id, avatar_path, deactivated, full_name, first_name")
        .eq("user_type", "instructor"),
      supabaseServer
        .from("instructors")
        .select("id, user_id, certification, employment_start_date")
    ]);

    if (profileResult.error || userProfileResult.error || instructorsResult.error) {
      return NextResponse.json(
        { error: profileResult.error?.message || userProfileResult.error?.message || instructorsResult.error?.message },
        { status: 400 },
      );
    }

    const instructorsByUserId = new Map(
      instructorsResult.data?.map((inst: any) => [inst.user_id, inst])
    );

    const mappedInstructors = userProfileResult.data?.map((profile: any) => {
      const instructor = instructorsByUserId.get(profile.id);
      return {
        ...profile,
        ...instructor,
        id: instructor?.id,
        key: profile?.id,
      };
    });

    return NextResponse.json({ data: profileResult.data, instructors: mappedInstructors });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
