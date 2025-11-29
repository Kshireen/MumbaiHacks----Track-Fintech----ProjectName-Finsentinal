// app/api/number-verification/verify/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phoneNumber, hashedPhoneNumber } = await req.json();

    // Build request body - can send either phoneNumber or hashedPhoneNumber
    const body: any = {};
    if (phoneNumber) body.phoneNumber = phoneNumber;
    if (hashedPhoneNumber) body.hashedPhoneNumber = hashedPhoneNumber;

    const response = await fetch(
      "https://network-as-code.p-eu.rapidapi.com/number-verification/v0/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "network-as-code.nokia.rapidapi.com",
          "x-rapidapi-key": process.env.RAPID_API_KEY!,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Number Verification Error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

