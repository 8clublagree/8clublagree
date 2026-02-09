import { NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function POST(req: Request) {
  try {
    const {
      classDate,
      bookerId,
      classId,
      isWalkIn,
      walkInFirstName,
      walkInLastName,
      walkInClientEmail,
      walkInClientContactNumber,
    } = await req.json();

    const { data: classData, error: classError } = await supabaseServer
      .from("classes")
      .select("*")
      .eq("id", classId)
      .single();

    if (classError) {
      return NextResponse.json({ error: classError.message }, { status: 400 });
    }

    if (classData?.taken_slots >= classData?.available_slots) {
      return NextResponse.json({ error: "Class is full" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("class_bookings")
      .insert({
        class_id: classId,
        class_date: classDate,
        is_walk_in: isWalkIn,
        attendance_status: "no-show",
        ...(bookerId && { booker_id: bookerId }),
        /**
         * walk-ins can only book classes that are on the same day
         * so we set the sent_email_reminder value to TRUE
         * meaning that an automated email does not need to be
         * sent to that client
         *
         * DEV NOTE: default value is FALSE and is configured in the DB
         */
        ...(isWalkIn === true && { sent_email_reminder: true }),
        ...(walkInFirstName && { walk_in_first_name: walkInFirstName }),
        ...(walkInLastName && { walk_in_last_name: walkInLastName }),
        ...(walkInClientEmail && { walk_in_client_email: walkInClientEmail }),
        ...(walkInClientContactNumber && {
          walk_in_client_contact_number: walkInClientContactNumber,
        }),
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
