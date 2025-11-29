// lib/actions.ts
import { RiskResult } from "../types/sim";

/**
 * NOTE: Replace all placeholders with real implementations:
 * - pauseOnboarding: update user record in DB (status = "paused")
 * - holdOtp: stop issuing OTP; mark in DB that OTP blocked
 * - enqueueManualReview: push to queue (Redis, SQS, DB)
 * - notifyUser / notifyAgent: call SMS / Exotel / email
 */

export async function pauseOnboarding(userId: string) {
  // placeholder: update DB
  console.log(`[ACTION] pauseOnboarding for ${userId}`);
  // e.g., await prisma.user.update({ where: { id: userId }, data: { onboardingStatus: 'paused' }})
  return true;
}

export async function holdOtp(userId: string) {
  console.log(`[ACTION] holdOtp for ${userId}`);
  // e.g., set otp_allowed = false in DB for this session
  return true;
}

export async function enqueueManualReview(userId: string, payload: any) {
  console.log(`[ACTION] enqueueManualReview for ${userId}`, payload);
  // e.g., push to Redis list or SQS with payload
  return true;
}

export async function notifyUserSms(phoneNumber: string, message: string) {
  console.log(`[ACTION] notifyUserSms to ${phoneNumber}: ${message}`);
  // call Exotel/Twilio API here
  return true;
}

export async function notifyAgent(agentId: string, summary: string) {
  console.log(`[ACTION] notifyAgent ${agentId}: ${summary}`);
  // send message to nearest agent (via webhook/email)
  return true;
}

/**
 * Execute recommended actions for a RiskResult.
 */
export async function enactActions(userId: string, phoneNumber: string, result: RiskResult) {
  const promises: Promise<any>[] = [];

  if (result.actions.includes("pause_onboarding")) {
    promises.push(pauseOnboarding(userId));
  }
  if (result.actions.includes("hold_otp")) {
    promises.push(holdOtp(userId));
  }
  if (result.actions.includes("enqueue_manual_review")) {
    promises.push(enqueueManualReview(userId, { phoneNumber, result }));
  }
  if (result.actions.includes("notify_user")) {
    const msg = `We detected unusual activity on your number ${phoneNumber}. Please contact support or wait for agent verification.`;
    promises.push(notifyUserSms(phoneNumber, msg));
  }
  if (result.actions.includes("notify_agent")) {
    promises.push(notifyAgent("nearest-agent-id", `Manual review required for ${phoneNumber}`));
  }

  await Promise.all(promises);
  return true;
}
