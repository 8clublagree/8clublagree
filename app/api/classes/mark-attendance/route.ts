import { NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function PUT(req: Request) {
  try {
    const { bookingID, status, classID } = await req.json();

    const { data: booking, error: bookingError } = await supabaseServer
      .from("class_bookings")
      .select("attendance_status")
      .eq("id", bookingID)
      .single();

    if (bookingError) {
      return NextResponse.json({ error: bookingError.message }, { status: 400 });
    }

    const previousStatus = booking.attendance_status;
    const wasActive = previousStatus !== "cancelled";
    const willBeActive = status === "attended" || status === "no-show";

    let slotDelta = 0;
    if (!wasActive && willBeActive) slotDelta = 1;
    if (wasActive && status === "cancelled") slotDelta = -1;

    if (slotDelta !== 0) {
      const { error: slotError } = await supabaseServer.rpc("adjust_taken_slots", {
        p_class_id: classID,
        p_delta: slotDelta,
      });

      if (slotError) {
        return NextResponse.json({ error: slotError.message }, { status: 400 });
      }
    }

    const { data, error } = await supabaseServer
      .from("class_bookings")
      .update({ attendance_status: status })
      .eq("id", bookingID)
      .select("attendance_status")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
