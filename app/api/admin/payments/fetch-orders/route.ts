import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../../supabase";

const SELECT_QUERY = `
  *,
  user_profiles (
    id,
    full_name,
    email,
    user_credits (
      credits
    ),
    client_packages (
      id,
      status
    )
  )
`;

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const page = Math.max(1, Number(params.get("page") ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(params.get("pageSize") ?? 10)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabaseServer
      .from("orders")
      .select(SELECT_QUERY, { count: "estimated" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("[fetch-orders] Query failed:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: data ?? [], total: count ?? 0 });
  } catch (err) {
    console.error("[fetch-orders] Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
