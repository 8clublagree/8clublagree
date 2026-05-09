import { NextResponse } from "next/server";
import supabaseServer from "../../supabase";

const shouldDebugUploadProof =
  process.env.NODE_ENV !== "production" ||
  process.env.ENABLE_UPLOAD_PROOF_DEBUG === "true";

const NON_RETRYABLE_CODES = new Set([
  "23505", // unique constraint violation
  "23502", // not null violation
  "23503", // foreign key violation
  "22P02", // invalid input syntax
]);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function insertOrder(row: Record<string, unknown>) {
  return supabaseServer.from("orders").insert(row).select();
}

async function insertOrderWithRetry(
  row: Record<string, unknown>,
  requestId: string,
  maxAttempts = 3,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const { data, error } = await insertOrder(row);

    if (!error) return { data, error: null, attempts: attempt };

    lastError = error as typeof lastError;

    if (NON_RETRYABLE_CODES.has((error.code as string) ?? "")) {
      console.warn(`[package/upload-proof] Non-retryable error (${error.code}), aborting retries.`, { requestId });
      return { data: null, error, attempts: attempt };
    }

    if (attempt < maxAttempts) {
      const delay = 200 * 2 ** (attempt - 1);
      console.warn(`[package/upload-proof] Insert attempt ${attempt} failed (${error.code}), retrying in ${delay}ms…`, { requestId });
      await sleep(delay);
    }
  }

  return { data: null, error: lastError, attempts: maxAttempts };
}

export async function POST(req: Request) {
  try {
    const requestId = crypto.randomUUID();
    const { values } = await req.json();

    const {
      userID,
      status,
      manualPaymentMethod,
      uploadedAt,
      paymentProofPath,
      packageID,
      packageTitle,
      packagePrice,
      packageCredits,
      packageValidityPeriod,
      referenceId,
      isTrialPackage,
      isShareable,
      shareableCredits,
      numberOfCreditsShared,
      discounted,
      discountPercentage,
      discountCode
    } = values;

    const debugPayload = {
      requestId,
      userID,
      status,
      manualPaymentMethod,
      uploadedAt,
      paymentProofPath,
      packageID,
      referenceId,
      isTrialPackage,
      isShareable,
      shareableCredits,
      numberOfCreditsShared,
      discounted: discounted ?? false,
      discountPercentage: discountPercentage ?? null,
      hasDiscountCode: Boolean(discountCode),
    };

    if (shouldDebugUploadProof) {
      console.info("[package/upload-proof] Insert attempt:", debugPayload);
    }

    const packagePrice_computed =
      discounted === true
        ? parseFloat(packagePrice) - parseFloat(packagePrice) * ((discountPercentage ?? 0) / 100)
        : packagePrice;

    const { data, error, attempts } = await insertOrderWithRetry(
      {
        status,
        payment_method: manualPaymentMethod,
        payment_proof_path: paymentProofPath,
        user_id: userID,
        package_id: packageID,
        uploaded_at: uploadedAt,
        package_title: packageTitle,
        package_credits: packageCredits,
        package_price: packagePrice_computed,
        package_validity_period: packageValidityPeriod,
        reference_id: referenceId,
        is_trial_package: isTrialPackage,
        is_shareable: isShareable,
        shareable_credits: shareableCredits,
        number_of_credits_shared: numberOfCreditsShared,
        discounted: discounted === true,
        discount_percentage: discountPercentage ?? null,
        discount_code: discountCode || null,
      },
      requestId,
    );

    if (error) {
      console.error("[package/upload-proof] Supabase insert failed:", {
        requestId,
        attempts,
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        payload: shouldDebugUploadProof ? debugPayload : undefined,
      });
      return NextResponse.json(
        {
          error: error.message ?? "Failed to upload payment proof.",
          details: error.details ?? null,
          requestId,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: 200,
      data: data,
      message: "Proof uploaded successfully",
    });
  } catch (err: any) {
    console.error("[package/upload-proof] Unexpected error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unexpected error while uploading proof." },
      { status: 500 }
    );
  }
}
