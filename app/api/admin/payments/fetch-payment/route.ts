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

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 },
      );
    }

    const { data: payment, error } = await supabaseServer
      .from("orders")
      .select(SELECT_QUERY)
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.code === "PGRST116" ? 404 : 400 },
      );
    }

    if (!payment) {
      return NextResponse.json({ data: null });
    }

    const mapped = {
      ...payment,
      currentActivePackage: payment?.user_profiles?.client_packages?.[0] ?? null,
      userCredits: payment?.user_profiles?.user_credits?.[0]?.credits ?? null,
    };

    let avatarUrl: string | null = null;
    if (mapped.payment_proof_path) {
      const { data } = await supabaseServer.storage
        .from("payment-proof")
        .createSignedUrl(mapped.payment_proof_path, 3600);

      if (data?.signedUrl) {
        avatarUrl = data.signedUrl;
      }
    }

    const result = {
      ...mapped,
      avatar_url: avatarUrl,
    };

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
