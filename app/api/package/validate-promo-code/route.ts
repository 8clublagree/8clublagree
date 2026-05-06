export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../supabase";
import dayjs from "dayjs";
import { rateLimitNotExceeded } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const allowed = rateLimitNotExceeded(req);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const data = await req.json();
    const promoCode = data?.promoCode
    const userID = String(data?.userID ?? "").trim();

    if (!promoCode) {
      return NextResponse.json({ error: "Please enter a promo code." }, { status: 400 });
    }

    if (!userID) {
      return NextResponse.json({ error: "User is required to validate promo code." }, { status: 400 });
    }

    const { data: promoCodeData, error } = await supabaseServer
      .from("promo_codes")
      .select("*")
      .eq("code", promoCode)
      .single();

    if (error || !promoCodeData) {
      return NextResponse.json({ error: "Promo code not found." }, { status: 404 });
    }

    if (
      promoCodeData.expiration_date &&
      dayjs(promoCodeData.expiration_date).isValid() &&
      dayjs(promoCodeData.expiration_date).isBefore(dayjs())
    ) {
      return NextResponse.json({ error: "Promo code has already expired." }, { status: 400 });
    }

    const { data: redemptionData, error: redemptionError } = await supabaseServer
      .from("promo_code_redemptions")
      .select("id")
      .eq("user_id", userID)
      .eq("promo_code_id", promoCodeData.id)
      .maybeSingle();

    if (redemptionError) {
      return NextResponse.json({ error: redemptionError.message }, { status: 400 });
    }

    if (redemptionData) {
      return NextResponse.json(
        { error: "You have already used this promo code. Please use a different code." },
        { status: 409 },
      );
    }

    return NextResponse.json({ data: promoCodeData }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Unexpected error: ${err}` },
      { status: 500 },
    );
  }
}
