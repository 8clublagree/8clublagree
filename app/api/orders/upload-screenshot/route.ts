import { NextResponse } from "next/server";
import supabaseServer from "../../supabase";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

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

    const fileEntry = formData.get("file");
    const fileNameEntry = formData.get("fileName");
    const fileName = typeof fileNameEntry === "string" ? fileNameEntry : "";

    if (!(fileEntry instanceof File)) {
      return NextResponse.json(
        { error: "Missing file in request", code: "MISSING_FILE" },
        { status: 400 }
      );
    }
    if (!fileName.trim()) {
      return NextResponse.json(
        { error: "Missing fileName in request", code: "MISSING_FILENAME" },
        { status: 400 }
      );
    }
    if (!fileEntry.type?.toLowerCase().startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only image uploads are allowed.", code: "INVALID_FILE_TYPE" },
        { status: 400 }
      );
    }
    if (fileEntry.size === 0) {
      return NextResponse.json(
        { error: "Uploaded file is empty.", code: "EMPTY_FILE" },
        { status: 400 }
      );
    }
    if (fileEntry.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image is too large. Maximum allowed size is 8MB.", code: "FILE_TOO_LARGE" },
        { status: 413 }
      );
    }

    const file = fileEntry;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const maxAttempts = 10;
    let data: any = null;
    let uploadError: any = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const res = await supabaseServer.storage.from("payment-proof").upload(fileName, buffer, {
        contentType: file.type.toLowerCase() || 'image/png',
        // upsert: true
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
      return NextResponse.json(
        {
          error: "Failed to upload payment screenshot.",
          details: uploadError.message ?? "Unknown upload error",
          code: uploadError.statusCode ?? uploadError.code ?? "UPLOAD_FAILED",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Unexpected error while uploading screenshot.",
        details: err?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
