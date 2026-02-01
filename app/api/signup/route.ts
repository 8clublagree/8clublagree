import { NextResponse } from "next/server";
import supabaseServer from "../supabase";

type SignupBody = {
  email: string;
  password: string;
  contact_number: string;
  first_name: string;
  last_name: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  birthday?: string | null;
  location?: string | null;
};

export async function POST(req: Request) {
  try {
    const body: SignupBody = await req.json();

    const {
      email,
      password,
      contact_number,
      first_name,
      last_name,
      emergency_contact_name,
      emergency_contact_number,
      birthday,
      location,
    } = body;

    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!contact_number || !first_name || !last_name) {
      return NextResponse.json(
        { error: "Contact number, first name, and last name are required" },
        { status: 400 }
      );
    }

    const { data: authData, error: authError } =
      await supabaseServer.auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password,
        email_confirm: true,
      });

    if (authError) {
      const message = authError.message ?? "Sign up failed";
      const code = (authError as any).code;
      return NextResponse.json(
        { error: message, code: code ?? undefined },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    const { error: profileError } = await supabaseServer
      .from("user_profiles")
      .insert({
        id: authData.user.id,
        email: email.trim().toLowerCase(),
        contact_number,
        full_name: `${first_name} ${last_name}`.trim(),
        first_name,
        last_name,
        emergency_contact_name: emergency_contact_name ?? null,
        emergency_contact_number: emergency_contact_number ?? null,
        birthday: birthday ?? null,
        location: location ?? null,
        user_type: "general",
      });

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message ?? "Failed to create profile" },
        { status: 400 }
      );
    }

    const { error: creditsError } = await supabaseServer
      .from("user_credits")
      .insert({ user_id: authData.user.id });

    if (creditsError) {
      return NextResponse.json(
        { error: creditsError.message ?? "Failed to create credits" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      data: { user: { id: authData.user.id } },
    });
  } catch (err: any) {
    console.error("signup error:", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}
