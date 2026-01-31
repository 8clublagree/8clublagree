import { NextResponse } from "next/server";
import supabaseServer from "../supabase";
import dayjs from "dayjs";
import { rateLimit, RATE_LIMIT_PRESETS } from "@/lib/rate-limits";

const MAX_PER_DAY = 5;

export async function GET(req: Request) {
  try {
    const params = Object.fromEntries(new URL(req.url).searchParams.entries());
    const { email } = params;

    // In-process rate limit by email; fewer DB hits, fail fast
    const { allowed } = rateLimit(`reset:${email}`, RATE_LIMIT_PRESETS.resetLink);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many reset attempts today" },
        { status: 429 },
      );
    }

    const since = dayjs().subtract(24, "hour").toISOString();
    const { data, error, count } = await supabaseServer
      .from("password_reset_requests")
      .select("*", { count: "exact" })
      .eq("email", email)
      .gt("requested_at", since);

    const attempts = count ?? 0;
    if (attempts > MAX_PER_DAY) {
      return NextResponse.json(
        { error: "Too many reset attempts today" },
        { status: 429 },
      );
    }

    //forgot password implementation
    if (attempts < MAX_PER_DAY) {
      // if attempts haven't reached max, create a request record
      //   const { error: requestError } = await supabaseServer
      //     .from("password_reset_requests")
      //     .insert(email)
      //     .select();
      //   if (error) {
      //     return NextResponse.json(
      //       { message: "Reset request has failed. Please try again" },
      //       { status: 400 },
      //     );
      //   }
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Change redirect base URL in production
    const { error: resetError } =
      await supabaseServer.auth.resetPasswordForEmail(email, {
        // redirectTo: `${process.env.SYSTEM_ORIGIN_TEST!!}/reset-password`,
        redirectTo: `${process.env.SYSTEM_ORIGIN!!}/reset-password`,
      });

    if (resetError) {
      return NextResponse.json(
        { error: "Error sending reset email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
