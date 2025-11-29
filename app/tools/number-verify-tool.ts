import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const numberVerificationTool = tool(
  async (input: any) => {
    const { phoneNumber, mode = "verify" } = input;
    try {
      const endpoint =
        mode === "verify"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/number-verification/verify`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/number-verification/device-phone-number`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (mode === "verify") {
        const verified = data.data?.devicePhoneNumberVerified;
        return JSON.stringify({
          status: verified ? "VERIFIED" : "FAILED",
          verified: verified,
          riskLevel: verified ? "LOW" : "HIGH",
          message: verified
            ? `Phone number ${phoneNumber} successfully verified against device.`
            : `Phone number ${phoneNumber} does NOT match the device. Possible spoofing detected.`,
          recommendation: verified
            ? "Proceed with onboarding or transaction."
            : "Block transaction and require additional authentication.",
        });
      } else {
        return JSON.stringify({
          status: "SUCCESS",
          devicePhoneNumber: data.data?.devicePhoneNumber,
          message: `Retrieved device phone number: ${data.data?.devicePhoneNumber}`,
          recommendation: "Use this number for verification purposes.",
        });
      }
    } catch (error) {
      return JSON.stringify({
        status: "ERROR",
        message: `Failed to verify phone number: ${error}`,
        recommendation: "Retry or escalate to manual verification.",
      });
    }
  },
  {
    name: "verify_phone_number",
    description:
      "Verifies that a phone number matches the SIM card in the user's device. " +
      "This prevents number spoofing and ensures the user actually owns the phone number. " +
      "Can operate in two modes: " +
      "1. 'verify': Compare provided number with device SIM (returns true/false) " +
      "2. 'retrieve': Get the actual phone number from device SIM. " +
      "Use during onboarding to ensure genuine user registration.",
    schema: z.object({
      phoneNumber: z
        .string()
        .describe("The phone number to verify in E.164 format"),
      mode: z
        .enum(["verify", "retrieve"])
        .optional()
        .default("verify")
        .describe("Verification mode: 'verify' to compare, 'retrieve' to get device number"),
    }),
  }
);
