import { NextResponse } from "next/server";
import supabaseServer from "../supabase"; // must use service_role key

export async function GET() {
  try {
    const [classesRes, trainersRes, schedulesRes] = await Promise.all([
      supabaseServer.from("classes").select("*").order("created_at"),
      supabaseServer.from("instructors").select("*").order("created_at"),
      supabaseServer
        .from("classes")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (classesRes.error) {
      return NextResponse.json(
        { error: classesRes.error.message },
        { status: 400 }
      );
    }
    if (trainersRes.error) {
      return NextResponse.json(
        { error: trainersRes.error.message },
        { status: 400 }
      );
    }
    if (schedulesRes.error) {
      return NextResponse.json(
        { error: schedulesRes.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      data: { classesRes, trainersRes, schedulesRes },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
