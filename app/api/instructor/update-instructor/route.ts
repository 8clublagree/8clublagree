import { NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function PUT(req: Request) {
  try {
    const { id, values } = await req.json();

    const { data, error } = await supabaseServer
      .from("instructors")
      .update(values)
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
