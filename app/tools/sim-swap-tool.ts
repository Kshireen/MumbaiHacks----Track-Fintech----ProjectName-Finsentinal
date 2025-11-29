import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const simSwapTool = tool(
  async (input: unknown) => {
    const { phoneNumber, maxAge = 240 } = input as { phoneNumber: string; maxAge?: number };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sim-swap`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber, maxAge }),
        }
      );

      const data = await response.json();

      if (data.success && data.data.swapped) {
        return JSON.stringify({
          status: "ALERT",
          swapped: true,
          swapDate: data.data.simSwapDate,
          riskLevel: "HIGH",
          message: `SIM swap detected for ${phoneNumber} on ${data.data.simSwapDate}. Immediate action required.`,
          recommendation: "Request additional verification before proceeding.",
        });
      }

      return JSON.stringify({
        status: "SAFE",
        swapped: false,
        riskLevel: "LOW",
        message: `No SIM swap detected for ${phoneNumber} in the last ${maxAge} hours.`,
        recommendation: "User can proceed with normal flow.",
      });
    } catch (error) {
      return JSON.stringify({
        status: "ERROR",
        message: `Failed to check SIM swap status: ${error}`,
        recommendation: "Retry or escalate to manual verification.",
      });
    }
  },
  {
    name: "check_sim_swap",
    description:
      "Checks if a phone number has experienced a recent SIM swap event. " +
      "SIM swaps are a major fraud indicator as attackers transfer victim's " +
      "numbers to their own SIM cards to intercept OTPs. " +
      "Returns: status (ALERT/SAFE/ERROR), swapped (boolean), swapDate, riskLevel, and recommendations. " +
      "Use this tool during onboarding or before high-value transactions.",
    schema: z.object({
      phoneNumber: z
        .string()
        .describe("The phone number to check in E.164 format (e.g., +911234567890)"),
      maxAge: z
        .number()
        .optional()
        .default(240)
        .describe("Maximum age in hours to check for SIM swap (default: 240 = 10 days)"),
    }),
  }
);