import { NextRequest, NextResponse } from "next/server";

const MAYA_SANDBOX_URL = "https://pg-sandbox.paymaya.com/checkout/v1/checkouts";
const MAYA_PUBLIC_KEY =
  process.env.MAYA_PUBLIC_KEY ||
  "pk-Z0OSzLvIcOI2UIvDhdTGVVfRSSeiGStnceqwUE7n0Ah";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); // ✅ Works here

    const response = await fetch(MAYA_SANDBOX_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(MAYA_PUBLIC_KEY + ":").toString(
          "base64"
        )}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.message || "Failed to create checkout session",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: data.redirectUrl,
      checkoutId: data.checkoutId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
