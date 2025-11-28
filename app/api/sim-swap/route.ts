export async function POST(req: Request) {
  try {
    const { phoneNumber, maxAge } = await req.json();

    const response = await fetch(
      "https://network-as-code.p-eu.rapidapi.com/passthrough/camara/v1/sim-swap/sim-swap/v0/check",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "network-as-code.nokia.rapidapi.com",
          "x-rapidapi-key": process.env.RAPID_API_KEY!,
        },
        body: JSON.stringify({ phoneNumber, maxAge }),
      }
    );

    const data = await response.json();
    return Response.json({ success: true, data });
  } catch (error) {
    console.error("Sim Swap Error:", error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}
