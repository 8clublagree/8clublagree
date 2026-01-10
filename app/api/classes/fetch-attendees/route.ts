import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function GET(req: NextRequest) {
  try {
    const data = Object.fromEntries(new URL(req.url).searchParams.entries());
    const classID = data.classID;

    let query = supabaseServer
      .from("class_bookings")
      .select(
        `
         *, 
         user_profiles(
           full_name
         )
         `
      )
      .eq("class_id", classID);

    const { data: classBookings, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data: classBookings });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
