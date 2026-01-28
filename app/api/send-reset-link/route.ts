import { NextResponse } from "next/server";
import supabaseServer from "../supabase";
import dayjs from "dayjs";

const MAX_PER_DAY = 5;

export async function GET(req: Request) {
  try {
    const since = dayjs().subtract(24, "hour").toISOString();
    const params = Object.fromEntries(new URL(req.url).searchParams.entries());

    const { email } = params;

    const { data, error, count } = await supabaseServer
      .from("password_reset_requests")
      .select("*", { count: "exact" })
      .eq("email", email)
      .gt("requested_at", since);

    const attempts = count ?? 0;

    console.log("count: ", count);

    if (attempts > MAX_PER_DAY) {
      return NextResponse.json(
        { error: "Too many reset attempts today" },
        { status: 200 },
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

    // change redirect base URL in production
    const { error: resetError } =
      await supabaseServer.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.SYSTEM_ORIGIN_TEST!!}/reset-password`,
      });

    if (resetError) {
      console.log("resetError: ", resetError);
      return NextResponse.json(
        { error: "Error sending reset email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    console.log("err: ", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
