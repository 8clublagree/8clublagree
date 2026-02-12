import { NextResponse } from "next/server";
import supabaseServer from "../../../supabase";
import dayjs from "dayjs";

export async function PUT(req: Request) {
  try {
    const { values, id } = await req.json();

    // override value update
    const { data, error } = await supabaseServer
      .from("orders")
      // .update({ status: values.status, approved_at: values.approved_at ?? null })
      .update({ status: 'SUCCESSFUL', approved_at: dayjs().toISOString() ?? null })
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }


    return NextResponse.json({ data });

  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
