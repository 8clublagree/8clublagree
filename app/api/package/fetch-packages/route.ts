import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function GET(req: NextRequest) {
  try {
    const data = Object.fromEntries(new URL(req.url).searchParams.entries());
    const { isAdmin } = data;

    let query = supabaseServer.from("packages").select("*");

    if (JSON.parse(isAdmin) !== true) {
      query = query.eq("offered_for_clients", true);
    }

    const { data: packages, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const res = NextResponse.json({ data: packages });
    // Cache catalog; 60s revalidate (packages change infrequently)
    res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
