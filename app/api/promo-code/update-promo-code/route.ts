import { NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function PUT(req: Request) {
  try {
    const { id, values } = await req.json();
    const promoCode = values?.code ?? null;

    if (promoCode !== null && !promoCode) {
      return NextResponse.json(
        { error: "Promo code is required." },
        { status: 400 },
      );
    }

    if (promoCode) {
      const { data: existingCodes, error: existingCodesError } = await supabaseServer
        .from("promo_codes")
        .select("id, status")
        .ilike("code", promoCode)
        .neq("id", id);

      if (existingCodesError) {
        return NextResponse.json(
          { error: existingCodesError.message },
          { status: 400 },
        );
      }

      const hasNonExpiredDuplicate = (existingCodes ?? []).some(
        (promo) => String(promo.status ?? "").toLowerCase() !== "expired",
      );

      if (hasNonExpiredDuplicate) {
        return NextResponse.json(
          {
            error:
              "Promo code already exists. You can only reuse a code after all existing matching codes are expired.",
          },
          { status: 409 },
        );
      }
    }

    const payload = {
      ...values,
      ...(promoCode ? { code: promoCode } : {}),
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
