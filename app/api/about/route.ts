import { NextResponse } from "next/server";
import supabaseServer from "../supabase"; // must use service_role key
import dayjs from "dayjs";

export async function GET() {
  try {
    const startOfSelectedUTC = dayjs()
      .startOf("day")
      .subtract(8, "hour")
      .toISOString();
    const endOfSelectedUTC = dayjs()
      .endOf("day")
      .subtract(8, "hour")
      .toISOString();

    const [classesRes, trainersRes, schedulesRes] = await Promise.all([
      supabaseServer.from("classes").select("*").order("start_time", { ascending: false }),
      supabaseServer
        .from("user_profiles")
        .select(`*, instructors(certification)`)
        .eq("user_type", "instructor")
        .order("created_at"),
      supabaseServer
        .from("classes")
        .select(
          `*, instructors(user_id, user_profiles(full_name, avatar_path))`,
        )
        .order("start_time", { ascending: true })
        .gte("class_date", startOfSelectedUTC)
        .lte("class_date", endOfSelectedUTC),
    ]);

    if (classesRes.error) {
      return NextResponse.json(
        { error: classesRes.error.message },
        { status: 400 },
      );
    }
    if (trainersRes.error) {
      return NextResponse.json(
        { error: trainersRes.error.message },
        { status: 400 },
      );
    }
    if (schedulesRes.error) {
      return NextResponse.json(
        { error: schedulesRes.error.message },
        { status: 400 },
      );
    }

    // Collect all unique avatar paths from trainers and schedules
    const trainerPaths = (trainersRes.data ?? [])
      .map((t) => t.avatar_path)
      .filter(Boolean) as string[];
    const schedulePaths = (schedulesRes.data ?? [])
      .map((s: any) => s?.instructors?.user_profiles?.avatar_path)
      .filter(Boolean) as string[];
    const allPaths = Array.from(new Set([...trainerPaths, ...schedulePaths]));

    // Batch fetch all signed URLs in a single Supabase call
    const urlMap = new Map<string, string>();
    if (allPaths.length > 0) {
      const { data: signedData, error: signedError } =
        await supabaseServer.storage
          .from("user-photos")
          .createSignedUrls(allPaths, 3600);

      if (!signedError && signedData) {
        signedData.forEach((item) => {
          if (item.signedUrl && item.path) {
            urlMap.set(item.path, item.signedUrl);
          }
        });
      }
    }

    const trainers = (trainersRes.data ?? []).map((instructor) => ({
      ...instructor,
      avatar_path: instructor.avatar_path
        ? urlMap.get(instructor.avatar_path) ?? null
        : null,
    }));

    const schedules = (schedulesRes.data ?? []).map((schedule: any) => {
      const avatar =
        schedule?.instructors?.user_profiles?.avatar_path ?? null;
      return {
        ...schedule,
        avatar_path: avatar ? urlMap.get(avatar) ?? null : null,
      };
    });

    const res = NextResponse.json({
      data: {
        classesRes,
        trainersRes: { data: trainers },
        schedulesRes: { data: schedules },
      },
    });
    res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
