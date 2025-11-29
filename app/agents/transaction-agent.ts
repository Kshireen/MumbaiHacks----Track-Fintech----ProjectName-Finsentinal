import { ChatOpenAI } from "@langchain/openai";
import { simSwapTool } from "../tools/sim-swap-tool";
import { numberVerificationTool } from "../tools/number-verify-tool";
import { riskCalculatorTool } from "../tools/risk-calculator.tools";

export class TransactionMonitoringAgent {
  private model: ChatOpenAI;
  private tools: any[];

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-4",
      temperature: 0.2,
    });
    this.tools = [
      simSwapTool,
      numberVerificationTool,
      // locationVerificationTool,
      // riskCalculatorTool,
    ];
  }

  async monitorTransaction(input: {
    phoneNumber: string;
    transactionAmount: number;
    transactionType: string;
    merchantName?: string;
  }) {
    console.log(`💳 Monitoring transaction: ${input.transactionType} - ₹${input.transactionAmount}`);

    // Check all security parameters in parallel
    const [simSwapResult, numberResult] = await Promise.all([
      simSwapTool.invoke({ phoneNumber: input.phoneNumber, maxAge: 24 }),
      numberVerificationTool.invoke({ phoneNumber: input.phoneNumber, mode: "verify" }),
    //   locationVerificationTool.invoke({ phoneNumber: input.phoneNumber }),
    ]);

    const simSwap = JSON.parse(simSwapResult);
    const numberVerification = JSON.parse(numberResult);
    // const location = JSON.parse(locationResult);

    // Calculate risk
    const riskResult = await riskCalculatorTool.invoke({
      simSwapStatus: simSwap.swapped ? "swapped" : "safe",
      numberVerified: numberVerification.verified,
      locationMatch: true, // TODO: Replace with actual location verification result
      transactionAmount: input.transactionAmount,
    });

    const risk = JSON.parse(riskResult);

    // Make decision
    const decision = {
      approved: risk.riskLevel === "LOW" || risk.riskLevel === "MEDIUM",
      riskLevel: risk.riskLevel,
      riskScore: risk.riskScore,
      factors: risk.factors,
      action: risk.action,
      requiresUserConfirmation: risk.riskLevel === "HIGH",
      blocked: risk.riskLevel === "CRITICAL",
      message: this.generateAlertMessage(risk, input),
    };

    return decision;
  }

  private generateAlertMessage(risk: any, transaction: any): string {
    if (risk.riskLevel === "LOW") {
      return `Transaction approved: ${transaction.transactionType} of ₹${transaction.transactionAmount}`;
    } else if (risk.riskLevel === "MEDIUM") {
      return `Transaction completed with alert sent to user.`;
    } else if (risk.riskLevel === "HIGH") {
      return `⚠️ ALERT: Suspicious transaction detected! ₹${transaction.transactionAmount} transaction pending user confirmation. Risk factors: ${risk.factors.join(", ")}`;
    } else {
      return `🚫 BLOCKED: Critical risk detected! Transaction of ₹${transaction.transactionAmount} has been blocked. Manual verification required.`;
    }
  }
}
