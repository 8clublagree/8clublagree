import { NextResponse } from "next/server";
import supabaseServer from "../../supabase";

const shouldDebugUploadProof =
  process.env.NODE_ENV !== "production" ||
  process.env.ENABLE_UPLOAD_PROOF_DEBUG === "true";

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

    const { data, error } = await supabaseServer.from("orders").insert({
      status,
      payment_method: manualPaymentMethod,
      payment_proof_path: paymentProofPath,
      user_id: userID,
      package_id: packageID,
      uploaded_at: uploadedAt,
      package_title: packageTitle,
      package_credits: packageCredits,
      package_price: discounted && discounted === true ? parseFloat(packagePrice) - (parseFloat(packagePrice) * (discountPercentage ? (discountPercentage / 100) : 0)) : packagePrice,
      package_validity_period: packageValidityPeriod,
      reference_id: referenceId,
      is_trial_package: isTrialPackage,
      is_shareable: isShareable,
      shareable_credits: shareableCredits,
      number_of_credits_shared: numberOfCreditsShared,
      discounted: discounted === true ? discounted : false,
      discount_percentage: discountPercentage === null ? null : discountPercentage,
      discount_code: discountCode === null ? null : discountCode,
    }).select()

    if (error) {
      console.error("[package/upload-proof] Supabase insert failed:", {
        requestId,
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
