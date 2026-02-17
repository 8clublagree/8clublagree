import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function GET(req: NextRequest) {
  try {
    const data = Object.fromEntries(new URL(req.url).searchParams.entries());
    const { userID } = data;

    const { data: classBookings, error } = await supabaseServer
      .from("class_bookings")
      .select(
        `
          id,
          booker_id,
          class_id,
          class_date,
          attendance_status,
          classes (
            id,
            end_time,
            start_time,
            class_date,
            class_name,
            instructor_id,
            instructor_name,
            taken_slots,
            available_slots,
            instructors (
              id,
              user_id,
              full_name,
              avatar_path,
              user_profiles (
                id,
                avatar_path
              )
            )
          )
    `
      )
      .eq("booker_id", userID)
      .or(
        "attendance_status.eq.active,attendance_status.eq.no-show,attendance_status.is.null"
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const res = NextResponse.json({ data: classBookings });
    res.headers.set("Cache-Control", "private, max-age=15, stale-while-revalidate=30");
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
