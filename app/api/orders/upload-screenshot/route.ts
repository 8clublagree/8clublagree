import { NextResponse } from "next/server";
import supabaseServer from "../../supabase";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isRetryableUploadError(err: unknown): boolean {
  const msg = (err as any)?.message;
  if (typeof msg !== "string") return true;
  const m = msg.toLowerCase();
  // Retry likely transient/network-ish errors
  if (
    m.includes("timeout") ||
    m.includes("timed out") ||
    m.includes("network") ||
    m.includes("fetch") ||
    m.includes("503") ||
    m.includes("502") ||
    m.includes("gateway") ||
    m.includes("temporar") ||
    m.includes("rate") ||
    m.includes("too many requests")
  ) {
    return true;
  }
  return false;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const maxAttempts = 10;
    let data: any = null;
    let uploadError: any = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const res = await supabaseServer.storage.from("payment-proof").upload(fileName, buffer, {
        contentType: file.type.toLowerCase() || 'image/png',
        upsert: true
      });

      data = res.data;
      uploadError = res.error;

      if (!uploadError) break;
      if (attempt === maxAttempts) break;
      if (!isRetryableUploadError(uploadError)) break;

      // Exponential backoff: 250ms, 500ms
      await sleep(250 * 2 ** (attempt - 1));
    }

    if (uploadError) {
      return NextResponse.json({ error: `Error: ${uploadError.message}` }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
