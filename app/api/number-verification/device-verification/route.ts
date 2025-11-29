import { NextResponse } from "next/server";

// app/api/number-verification/device-phone-number/route.ts
export async function POST(req: Request) {
  try {
    const response = await fetch(
      "https://network-as-code.p-eu.rapidapi.com/number-verification/v0/device-phone-number",
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "network-as-code.nokia.rapidapi.com",
          "x-rapidapi-key": process.env.RAPID_API_KEY!,
        },
      }
    );

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Device Phone Number Error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}