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
      deductCredits,
    } = await req.json();

    const { data, error } = await supabaseServer.rpc("book_class", {
      p_class_id: classId,
      p_class_date: classDate,
      p_booker_id: bookerId ?? null,
      p_is_walk_in: isWalkIn ?? false,
      p_walk_in_first_name: walkInFirstName ?? null,
      p_walk_in_last_name: walkInLastName ?? null,
      p_walk_in_client_email: walkInClientEmail ?? null,
      p_walk_in_client_contact_number: walkInClientContactNumber ?? null,
      p_deduct_credits: deductCredits ?? false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data?.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
