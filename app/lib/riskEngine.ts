// lib/riskEngine.ts
import { Decision, RiskResult, SimSwapApiResponse } from "../types/sim";

/**
 * Configurable thresholds:
 * - maxAgeHours: the threshold (in hours) used when calling NAC (e.g. 240)
 * - highRiskHours: if lastSimChangeHours <= highRiskHours => HIGH_RISK
 * - manualReviewWindow: borderline hours to request manual review
 */
const config = {
  highRiskHours: 240, // if change within last 240 hours => high risk
  manualReviewWindowHours: 24 * 14, // e.g., 14 days borderline
};

export function evaluateRisk(simApi: SimSwapApiResponse): RiskResult {
  // Heuristic scoring — start at 50 and push up/down
  let score = 50;
  const reasons: string[] = [];
  const actions: string[] = [];

  const lastChange = simApi.lastSimChangeHours ?? (simApi.simChanged ? 1 : Infinity);

  if (simApi.simChanged === true || lastChange <= config.highRiskHours) {
    // Strong signal
    score = Math.min(100, score + 45);
    reasons.push(`SIM changed within ${config.highRiskHours} hours`);
  } else if (lastChange <= config.manualReviewWindowHours) {
    score = Math.min(100, score + 15);
    reasons.push(`SIM change within ${config.manualReviewWindowHours} hours (borderline)`);
  } else {
    score = Math.max(0, score - 35);
    reasons.push("No recent SIM change");
  }

  // Final decision
  let decision: Decision = "LOW_RISK";
  if (score >= 80) {
    decision = "HIGH_RISK";
    actions.push("pause_onboarding", "hold_otp", "enqueue_manual_review", "notify_user");
  } else if (score >= 60) {
    decision = "MANUAL_REVIEW";
    actions.push("enqueue_manual_review", "notify_agent");
  } else {
    decision = "LOW_RISK";
    actions.push("proceed_to_kyc");
  }

  return {
    decision,
    score,
    reasons,
    actions,
    simApi,
  };
}
