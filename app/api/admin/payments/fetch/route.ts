import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../../supabase"; // must use service_role key

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

export async function GET(request: NextRequest) {
  try {
    const page = Math.max(
      1,
      parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10),
    );
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(request.nextUrl.searchParams.get("pageSize") ?? "10", 10)),
    );
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: payments, error: paymentsError, count } = await supabaseServer
      .from("orders")
      .select(SELECT_QUERY, { count: "exact" })
      // .eq("user_profiles.client_packages.status", "active")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (paymentsError) {
      return NextResponse.json(
        { error: paymentsError.message },
        { status: 400 },
      )
    }

    const list = payments ?? [];
    const mapped = list.map((item) => {

      const active = item.user_profiles.client_packages.find((item: any) => item.status === "active");
      return {
        ...item,
        currentActivePackage: active ?? null,
        userCredits: item?.user_profiles?.user_credits?.[0]?.credits ?? null,
      };
    })


    return NextResponse.json({
      payments: mapped,
      total: count ?? mapped.length,
    });

  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
