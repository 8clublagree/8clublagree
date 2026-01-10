import { NextResponse } from "next/server";
import supabaseServer from "../../supabase"; // must use service_role key

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const { error: authDeleteError } =
      await supabaseServer.auth.admin.deleteUser(id);

    const { data, error: profileDeleteError }: any = await supabaseServer
      .from("user_profiles")
      .delete()
      .eq("id", id)
      .select();

    if (data?.user_type === "instructor") {
      const { error: deleteInstructorError } = await supabaseServer
        .from("instructors")
        .delete()
        .eq("user_id", id)
        .select();

      if (deleteInstructorError) {
        return NextResponse.json(
          { error: deleteInstructorError.message },
          { status: 400 }
        );
      }
    }

    if (authDeleteError) {
      return NextResponse.json(
        { error: authDeleteError.message },
        { status: 400 }
      );
    }

    if (profileDeleteError) {
      return NextResponse.json(
        { error: profileDeleteError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
