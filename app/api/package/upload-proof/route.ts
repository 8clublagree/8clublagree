import { NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function POST(req: Request) {
  try {
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
      discountPercentage
    } = values;

    const { data, error } = await supabaseServer.from("orders").insert({
      status,
      payment_method: manualPaymentMethod,
      payment_proof_path: paymentProofPath,
      user_id: userID,
      package_id: packageID,
      uploaded_at: uploadedAt,
      package_title: packageTitle,
      package_credits: packageCredits,
      package_price: packagePrice,
      package_validity_period: packageValidityPeriod,
      reference_id: referenceId,
      is_trial_package: isTrialPackage,
      is_shareable: isShareable,
      shareable_credits: shareableCredits,
      number_of_credits_shared: numberOfCreditsShared,
      discounted: discounted,
      discount_percentage: discountPercentage
    }).select()

    if (error) {
      return NextResponse.json({ error: error }, { status: 400 });
    }

    return NextResponse.json({
      status: 200,
      data: data,
      message: "Proof uploaded successfully",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
