import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "../../supabase";
import dayjs from "dayjs";

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

    const formattedSelectedDate = dayjs.isDayjs(selectedDate)
      ? selectedDate
      : dayjs(selectedDate);

    const nowISO = dayjs().toISOString();
    const today = dayjs().startOf("day");

    const instructorFragment = `instructors (
        id, user_id, full_name, avatar_path,
        user_profiles (id, avatar_path, deactivated, full_name, first_name)
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

      const startOfSelectedUTC = dayjs(startDate)
        .startOf("day")
        .toISOString();
      const endOfSelectedUTC = dayjs(endDate)
        .endOf("day")
        .toISOString();

      query = query
        .gte("class_date", startOfSelectedUTC)
        .lte("class_date", endOfSelectedUTC);
    }

    if (selectedDate !== undefined) {

      let startOfSelectedUTC;
      let endOfSelectedUTC;


      if (isAdmin && daily) {
        startOfSelectedUTC = formattedSelectedDate
          .startOf("day")
          .subtract(8, "hour")
          .toISOString();
        endOfSelectedUTC = formattedSelectedDate
          .endOf("day")
          .subtract(8, "hour")
          .toISOString();
      } else {
        startOfSelectedUTC = formattedSelectedDate
          .startOf("day")
          .toISOString();
        endOfSelectedUTC = formattedSelectedDate
          .endOf("day")
          .toISOString();
      }

      query = query
        .gte("class_date", startOfSelectedUTC)
        .lte("class_date", endOfSelectedUTC);

      // If selected day is today, and the caller is NOT admin and NOT instructor,
      // only show classes that haven't started yet.
      if (
        !isAdmin &&
        !isInstructor &&
        formattedSelectedDate.isSame(today, "day")
      ) {

        query = query.gte("start_time", nowISO);
      }
    }

    query = query.order("start_time", { ascending: true });

    const { data: classData, error } = await query;

    if (error) throw error;

    const res = NextResponse.json({ data: classData });
    res.headers.set("Cache-Control", "private, max-age=15, stale-while-revalidate=30");
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
