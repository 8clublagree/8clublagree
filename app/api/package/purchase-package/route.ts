import { NextResponse } from "next/server";
import supabaseServer from "../../supabase";
import { getDateFromToday } from "@/lib/utils";
import dayjs from "dayjs";

export async function POST(req: Request) {
  try {
    const {
      userID,
      packageID,
      paymentMethod,
      validityPeriod,
      packageCredits,
      packageName,
      isShareable,
      shareableCredits,
      numberOfCreditsShared,
      isTrialPackage,
      discounted,
      discountPercentage,
    } = await req.json();

    const today = dayjs();

    const { data, error } = await supabaseServer
      .from("client_packages")
      .insert({
        user_id: userID,
        package_id: packageID,
        status: "active",
        validity_period: validityPeriod,
        package_credits: packageCredits,
        purchase_date: today,
        package_name: packageName,
        payment_method: paymentMethod,
        expiration_date: getDateFromToday(validityPeriod),
        ...(isShareable === true && {
          is_shareable: isShareable,
          shareable_credits: shareableCredits,
          number_of_credits_shared: numberOfCreditsShared,
        }),
        discounted: discounted === true ? discounted : false,
        discount_percentage: discountPercentage ? discountPercentage : null,
      })
      .select();


    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (isTrialPackage === true) {
      await supabaseServer.from("user_profiles").update({
        availed_trial_package: true,
      }).eq("id", userID);
    }

    return NextResponse.json({ data: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
