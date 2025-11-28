import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { phoneNumber } = await req.json();

  let response;

  if (phoneNumber === "+99999991000") {
    response = {
      success: true,
      data: {
        swapped: true,
        simSwapDate: "2024-11-29T10:42:00Z",
        message: "SIM swap has occurred"
      }
    };
  } else if (phoneNumber === "+99999991001") {
    response = {
      success: true,
      data: {
        swapped: false,
        simSwapDate: null,
        message: "SIM has not been swapped"
      }
    };
  } else {
    response = {
      success: false,
      data: {
        detail: "Use simulator numbers: +99999991000 or +99999991001"
      }
    };
  }

  return NextResponse.json(response);
}
