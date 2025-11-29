import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const riskCalculatorTool = tool(
  async (input: unknown) => {
    // Cast input after Zod validation
    const {
      simSwapStatus,
      numberVerified,
      locationMatch,
      transactionAmount,
    } = input as {
      simSwapStatus: "safe" | "swapped" | "unknown";
      numberVerified: boolean;
      locationMatch: boolean;
      transactionAmount?: number;
    };

    let riskScore = 0;
    const factors: string[] = [];

    if (simSwapStatus === "swapped") {
      riskScore += 40;
      factors.push("Recent SIM swap detected");
    }

    if (!numberVerified) {
      riskScore += 30;
      factors.push("Phone number not verified");
    }

    if (!locationMatch) {
      riskScore += 20;
      factors.push("Location mismatch detected");
    }

    if (transactionAmount && transactionAmount > 50000) {
      riskScore += 10;
      factors.push("High transaction amount");
    }

    let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    let action: string;

    if (riskScore >= 70) {
      riskLevel = "CRITICAL";
      action = "BLOCK transaction immediately. Require manual verification.";
    } else if (riskScore >= 40) {
      riskLevel = "HIGH";
      action = "PAUSE transaction. Send voice alert.";
    } else if (riskScore >= 20) {
      riskLevel = "MEDIUM";
      action = "PROCEED with caution. Send SMS alert.";
    } else {
      riskLevel = "LOW";
      action = "ALLOW transaction.";
    }

    return JSON.stringify({
      riskScore,
      riskLevel,
      factors,
      action,
      message: `Risk assessment complete. Score: ${riskScore} (${riskLevel})`,
    });
  },
  {
    name: "calculate_risk_score",
    description: "Computes a risk score for financial transactions",
    schema: z.object({
      simSwapStatus: z.enum(["safe", "swapped", "unknown"]),
      numberVerified: z.boolean(),
      locationMatch: z.boolean(),
      transactionAmount: z.number().optional(),
    }),
  }
);
