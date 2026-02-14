import { NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function PUT(req: Request) {
  try {
    const { id, classID, takenSlots, userID, userCredits } = await req.json();

    const { data: classData, error: classError } = await supabaseServer
      .from("classes")
      .select(`*, class_bookings (id)`)
      .eq("id", classID)
      .single();

    if (classError) {
      return NextResponse.json({ error: classError.message }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("class_bookings")
      .update({ attendance_status: "cancelled" })
      .eq("id", id)
      .select();

    const filteredBookings = classData?.class_bookings?.filter((booking: any) => booking.attendance_status !== 'cancelled');

    const { error: updateClassError } = await supabaseServer
      .from("classes")
      .update({ taken_slots: Number(filteredBookings.length) === 0 ? 0 : Number(filteredBookings.length) - 1 })
      .eq("id", classID)
      .select();

    const { error: updateCreditsError } = await supabaseServer
      .from("user_credits")
      .update({ credits: (userCredits as number) + 1 })
      .eq("user_id", userID)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (updateClassError) {
      return NextResponse.json(
        { error: updateClassError.message },
        { status: 400 }
      );
    }

    if (updateCreditsError) {
      return NextResponse.json(
        { error: updateCreditsError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
