import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../supabase";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const BIZ_TZ = "Asia/Manila";

export async function GET(req: NextRequest) {
  try {
    const data = Object.fromEntries(new URL(req.url).searchParams.entries());

    const {
      isAdmin,
      isInstructor,
      userId,
      startDate,
      endDate,
      daily,
      selectedDate,
      instructorId,
      withAttendees,
    } = data;

    const toManilDate = (d: string) => {
      const dateOnly = d.split("T")[0];
      return dayjs.tz(dateOnly, BIZ_TZ);
    };

    const nowManila = dayjs().tz(BIZ_TZ);
    const nowISO = nowManila.toISOString();
    const today = nowManila.startOf("day");

    const instructorFragment = `instructors (
        id, user_id,
        user_profiles!instructors_user_id_fkey (id, avatar_path, deactivated, full_name, first_name)
      )`;

    let bookingsFragment: string;
    if (withAttendees === "true") {
      bookingsFragment = `class_bookings (
        id, attendance_status, booker_id, class_id,
        walk_in_first_name, walk_in_last_name,
        user_profiles (id, full_name)
      )`;
    } else if (userId) {
      bookingsFragment = `class_bookings (id, attendance_status)`;
    } else {
      bookingsFragment = `class_bookings (id)`;
    }

    let query = supabaseServer
      .from("classes")
      .select(`*, ${instructorFragment}, ${bookingsFragment}`);

    if (userId) {

      query = query.eq("class_bookings.booker_id", userId).eq("offered_for_clients", true)
    }

    if (isInstructor && instructorId) {

      query = query.eq("instructor_id", instructorId);
    }

    if (selectedDate === undefined && startDate && endDate) {
      const startOfSelectedUTC = toManilDate(startDate).startOf("day").utc().toISOString();
      const endOfSelectedUTC = toManilDate(endDate).endOf("day").utc().toISOString();

      query = query
        .gte("class_date", startOfSelectedUTC)
        .lte("class_date", endOfSelectedUTC);
    }

    if (selectedDate !== undefined) {
      const selectedInManila = toManilDate(selectedDate);
      const startOfSelectedUTC = selectedInManila.startOf("day").utc().toISOString();
      const endOfSelectedUTC = selectedInManila.endOf("day").utc().toISOString();

      query = query
        .gte("class_date", startOfSelectedUTC)
        .lte("class_date", endOfSelectedUTC);

      if (
        !isAdmin &&
        !isInstructor &&
        selectedInManila.isSame(today, "day")
      ) {
        query = query.gte("start_time", nowISO);
      }
    }

    query = query.order("start_time", { ascending: true });

    const { data: classData, error } = await query;

    if (error) throw error;

    const res = NextResponse.json({ data: classData });

    if (isAdmin || isInstructor) {
      res.headers.set("Cache-Control", "private, max-age=10, stale-while-revalidate=15");
    }

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
