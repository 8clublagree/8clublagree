import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import supabaseServer from "../supabase";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const { data, error } = await supabaseServer.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
