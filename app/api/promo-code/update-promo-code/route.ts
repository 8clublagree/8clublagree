import { NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function PUT(req: Request) {
  try {
    const { id, values } = await req.json();

    const payload = {
      ...values,
      ...(values?.code ? { code: values.code.trim().toUpperCase() } : {}),
    };

    const { data, error } = await supabaseServer
      .from("promo_codes")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
