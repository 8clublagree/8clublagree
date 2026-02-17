export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../supabase";
import dayjs from "dayjs";
import { rateLimitNotExceeded } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const allowed = rateLimitNotExceeded(req);

    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const data = Object.fromEntries(new URL(req.url).searchParams.entries());
    let query = supabaseServer.from("client_packages").select(`
        *, 
        packages(
            *
        )`);
    const startOfToday = dayjs().startOf("day").toISOString();
    const endOfToday = dayjs().endOf("day").toISOString();

    if (data.clientID) {
      query = query.eq("user_id", data.clientID);
    }

    if (data?.clientID === undefined && data.findExpiry === 'true') {
      // Active packages whose expiration_date is today (start of day to end of day, local)
      query = query.eq("status", "active");
      query = query.gte("expiration_date", startOfToday);
      query = query.lte("expiration_date", endOfToday);
    }

    query = query.order("created_at", { ascending: false });

    const { data: packages, error } = await query;


    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const res = NextResponse.json({ data: packages });
    res.headers.set("Cache-Control", "private, max-age=15, stale-while-revalidate=30");
    return res;
  } catch (err: any) {
    return NextResponse.json(
      { error: `Unexpected error: ${err}` },
      { status: 500 },
    );
  }
}
