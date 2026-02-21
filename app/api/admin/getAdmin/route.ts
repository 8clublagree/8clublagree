import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../supabase";

async function fetchInstructorData(retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const [userProfileResult, instructorsResult] = await Promise.all([
      supabaseServer
        .from("user_profiles")
        .select("id, avatar_path, deactivated, full_name, first_name")
        .eq("user_type", "instructor"),
      supabaseServer
        .from("instructors")
        .select("id, user_id, certification, employment_start_date"),
    ]);

    if (!userProfileResult.error && !instructorsResult.error) {
      return { userProfileResult, instructorsResult, error: null };
    }

    console.error(
      `[getAdmin] Instructor fetch attempt ${attempt + 1}/${retries} failed:`,
      { userProfileError: userProfileResult.error, instructorsError: instructorsResult.error },
    );

    if (attempt < retries - 1) {
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  return { userProfileResult: null, instructorsResult: null, error: "Failed after retries" };
}

export async function GET(req: NextRequest) {
  try {
    const data = Object.fromEntries(new URL(req.url).searchParams.entries());

    const [profileResult, instructorData] = await Promise.all([
      supabaseServer
        .from("user_profiles")
        .select("*")
        .eq("id", data.id)
        .maybeSingle(),
      fetchInstructorData(),
    ]);

    if (profileResult.error) {
      console.error("[getAdmin] Profile fetch failed:", profileResult.error);
      return NextResponse.json({ error: profileResult.error.message }, { status: 400 });
    }

    if (instructorData.error) {
      return NextResponse.json({ error: instructorData.error }, { status: 400 });
    }

    const { userProfileResult, instructorsResult } = instructorData;

    const instructorsByUserId = new Map(
      instructorsResult!.data?.map((inst: any) => [inst.user_id, inst])
    );

    const mappedInstructors = userProfileResult!.data?.map((profile: any) => {
      const instructor = instructorsByUserId.get(profile.id);
      return {
        ...profile,
        ...instructor,
        id: instructor?.id,
        key: profile?.id,
      };
    });

    return NextResponse.json({ data: profileResult.data, instructors: mappedInstructors, temp: instructorsResult!.data });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 },
    );
  }
}
