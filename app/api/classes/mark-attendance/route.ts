import { NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function PUT(req: Request) {
  try {
    const { bookingID, status } = await req.json();

    const { data, error } = await supabaseServer
      .from("class_bookings")
      .update({ attendance_status: status })
      .eq("id", bookingID)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
