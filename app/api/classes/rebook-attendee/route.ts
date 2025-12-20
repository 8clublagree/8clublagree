import { NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function PUT(req: Request) {
  try {
    const { oldClassID, newClassID, bookingID, oldTakenSlots, newTakenSlots } =
      await req.json();

    // const { data, error } = await supabaseServer
    let query = supabaseServer
      .from("class_bookings")
      .update({ class_id: newClassID })
      .eq("id", bookingID)
      .select();

    const oldClassSlots = (oldTakenSlots - 1) as number;
    const newClassSlots = (newTakenSlots + 1) as number;

    const { error: updateOldClassError } = await supabaseServer
      .from("classes")
      .update({ taken_slots: oldClassSlots })
      .eq("id", oldClassID)
      .select();

    const { error: updateNewClassError } = await supabaseServer
      .from("classes")
      .update({ taken_slots: newClassSlots })
      .eq("id", newClassID)
      .select();

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (updateOldClassError) {
      return NextResponse.json(
        { error: updateOldClassError.message },
        { status: 400 }
      );
    }
    if (updateNewClassError) {
      return NextResponse.json(
        { error: updateNewClassError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
