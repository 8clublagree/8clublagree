import { NextResponse } from "next/server";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const STORAGE_BUCKET = "payment-proof";

function isRetryableUploadError(statusCode: number, msg: string): boolean {
  const m = msg.toLowerCase();
  if (
    statusCode === 502 ||
    statusCode === 503 ||
    m.includes("timeout") ||
    m.includes("timed out") ||
    m.includes("network") ||
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
    const contentType = file.type.toLowerCase() || "image/png";

    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${encodeURIComponent(fileName)}`;

    const maxAttempts = 10;
    let lastStatus = 0;
    let lastBody: any = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          "Content-Type": contentType,
          "x-upsert": "false",
        },
        body: buffer,
      });

      lastStatus = res.status;
      lastBody = await res.json().catch(() => ({}));

      if (res.ok) {
        return NextResponse.json({ data: lastBody });
      }

      if (attempt === maxAttempts) break;

      const errMsg = lastBody?.message ?? lastBody?.error ?? "";
      if (!isRetryableUploadError(lastStatus, errMsg)) break;

      await sleep(250 * 2 ** (attempt - 1));
    }

    return NextResponse.json(
      {
        error: "Failed to upload payment screenshot.",
        details: lastBody?.message ?? lastBody?.error ?? "Unknown upload error",
        code: lastBody?.statusCode ?? lastBody?.error ?? "UPLOAD_FAILED",
      },
      { status: 400 }
    );
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
