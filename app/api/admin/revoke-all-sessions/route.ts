import { NextRequest, NextResponse } from "next/server";
import supabaseServer from "@/app/api/supabase";

/**
 * Revokes all auth sessions (all users must sign in again).
 *
 * One-time setup: In Supabase Dashboard → SQL Editor, run:
 *
 *   CREATE OR REPLACE FUNCTION public.revoke_all_auth_sessions()
 *   RETURNS void
 *   LANGUAGE sql
 *   SECURITY DEFINER
 *   SET search_path = auth
 *   AS $$
 *     DELETE FROM auth.refresh_tokens;
 *   $$;
 *
 * Then call this API with header: x-revoke-secret: <REVOKE_ALL_SESSIONS_SECRET>
 */

const REVOKE_SECRET = process.env.REVOKE_ALL_SESSIONS_SECRET;

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-revoke-secret");
  if (!REVOKE_SECRET || secret !== REVOKE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    message:
      "To revoke all sessions manually, run this in Supabase Dashboard → SQL Editor:",
    sql: "DELETE FROM auth.refresh_tokens;",
  });
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revoke-secret");
  if (!REVOKE_SECRET || secret !== REVOKE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseServer.rpc("revoke_all_auth_sessions");

    if (error) {
      // Function might not exist yet
      if (error.code === "42883" || error.message?.includes("function")) {
        return NextResponse.json(
          {
            error: "Function not found",
            message:
              "Run this SQL once in Supabase Dashboard → SQL Editor, then call this API again:",
            sql: `CREATE OR REPLACE FUNCTION public.revoke_all_auth_sessions()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = auth
AS $$
  DELETE FROM auth.refresh_tokens;
$$;`,
          },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "All sessions revoked. All users must sign in again.",
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
