import { NextResponse } from "next/server";
import supabaseServer from "../../supabase";

export async function PUT(req: Request) {
  try {
    const { clientPackageID, values } = await req.json();


    const updateValues: Record<string, unknown> = {};
    if (values?.status !== undefined) updateValues.status = values.status;
    if (values?.expirationDate !== undefined) {
      updateValues.expiration_date = values.expirationDate;
    }
    if (values?.packageCredits !== undefined) {
      updateValues.package_credits = values.packageCredits;
    }
    if (values?.validityPeriod !== undefined) {
      updateValues.validity_period = values.validityPeriod;
    }
    if (values?.numberOfSharedCreditsUsed !== undefined) {
      updateValues.number_of_shared_credits_used =
        values.numberOfSharedCreditsUsed;
    }
    if (values?.numberOfCreditsShared !== undefined) {
      updateValues.number_of_credits_shared = values.numberOfCreditsShared;
    }
    const { data, error } = await supabaseServer
      .from("client_packages")
      .update(updateValues)
      .eq("id", clientPackageID)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
