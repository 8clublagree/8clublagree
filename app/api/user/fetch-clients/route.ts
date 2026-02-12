import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function GET(req: NextRequest) {
  try {
    const data = Object.fromEntries(new URL(req.url).searchParams.entries());
    const name = data.name;
    const email = data.email;
    const contact_number = data.contact_number;
    const page = Math.max(1, parseInt(data.page ?? "1", 10) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(data.pageSize ?? "10", 10) || 10),
    );
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabaseServer
      .from("user_profiles")
      .select(
        `*,
        user_credits (
        id,
        credits
        ),
        class_bookings (      
                attendance_status,
                booker_id,
                class_date,
                class_id,
                id,
            classes (
                id,
                start_time,
                end_time,
                class_name,
                instructor_id,
                instructor_name,
                instructors (
                id,
                full_name,
                avatar_path
                )
            )
        ),
        client_packages (
            *,
            id,
            package_id,
            status,
            package_name,
            purchase_date, 
            package_credits,
            validity_period,
            expiration_date
        )
        `,
        { count: "exact" },
      )
      .eq("user_type", "general")
      .is("deleted_at", null)
      .order("created_at", {
        ascending: false,
        foreignTable: "class_bookings",
      })
      .range(from, to);

    if (!!name?.length) {
      query = query.ilike("full_name", `%${name}%`);
    }
    if (!!email?.length) {
      query = query.ilike("email", `%${email}%`);
    }
    if (!!contact_number?.length) {
      query = query.ilike("contact_number", `%${contact_number}%`);
    }

    const { data: clients, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ data: clients, total: count ?? 0 });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
