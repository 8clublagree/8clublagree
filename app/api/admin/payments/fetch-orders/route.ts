import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../../supabase";

const PROFILE_FIELDS = `
    id,
    full_name,
    email,
    user_credits (
      credits
    ),
    client_packages!left (
      id,
      status
    )
`;

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const page = Math.max(1, Number(params.get("page") ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(params.get("pageSize") ?? 10)));
    const customerName = params.get("customerName")?.trim() || "";
    const paymentMethods = params.get("paymentMethod")?.split(",").filter(Boolean) ?? [];
    const statuses = params.get("status")?.split(",").filter(Boolean) ?? [];
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const selectQuery = customerName
      ? `*, user_profiles!inner (${PROFILE_FIELDS})`
      : `*, user_profiles (${PROFILE_FIELDS})`;

    let query = supabaseServer
      .from("orders")
      .select(selectQuery, { count: "estimated" })
      .order("created_at", { ascending: false });

    query = query.eq("user_profiles.client_packages.status", "active");

    if (customerName) {
      query = query.ilike("user_profiles.full_name", `%${customerName}%`);
    }

    if (paymentMethods.length) {
      query = query.in("payment_method", paymentMethods);
    }

    if (statuses.length) {
      query = query.in("status", statuses);
    }

    const { data, error, count } = await query.range(from, to);

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
