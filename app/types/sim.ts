// types/sim.ts
export type Decision = "LOW_RISK" | "HIGH_RISK" | "MANUAL_REVIEW";

export interface SimSwapApiResponse {
  // Use actual NAC response shape if available; use any for now
  simChanged?: boolean;
  lastSimChangeHours?: number; // derived or from NAC if available
  raw?: any;
}

export interface RiskResult {
  decision: Decision;
  score: number; // 0-100
  reasons: string[]; // short text reasons
  actions: string[]; // actions we took or recommend
  simApi: SimSwapApiResponse;
}
