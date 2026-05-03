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
        const { promoCode } = data;

        const { data: promoCodeData, error } = await supabaseServer.from("promo_codes").select(`*`).eq("code", promoCode).single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ data: promoCodeData }, { status: 200 });

    } catch (err: any) {
        return NextResponse.json(
            { error: `Unexpected error: ${err}` },
            { status: 500 },
        );
    }

}
