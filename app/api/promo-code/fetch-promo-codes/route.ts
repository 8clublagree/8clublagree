import { NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
