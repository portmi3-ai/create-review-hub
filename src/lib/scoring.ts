export type InvestorSignal = {
  score: number;
  stage: string;
  lastTouch: string;
};

const stageWeight: Record<string, number> = {
  Intro: 5,
  "Follow-up": 12,
  Diligence: 25,
  "Pilot Review": 30,
  Committed: 50,
};

export function calculateInvestorPriority(signal: InvestorSignal): number {
  const base = Math.max(0, Math.min(100, signal.score));
  const weight = stageWeight[signal.stage] ?? 0;
  const daysSinceTouch = Math.max(
    0,
    Math.floor((Date.now() - new Date(signal.lastTouch).getTime()) / 86_400_000),
  );
  const freshnessPenalty = Math.min(15, daysSinceTouch / 2);
  return Math.round(Math.max(0, Math.min(100, base * 0.7 + weight - freshnessPenalty)));
}

export function classifyDocumentRisk(status: string, access: string): "low" | "medium" | "high" {
  if (access === "Restricted" && status !== "Ready") return "high";
  if (status !== "Ready") return "medium";
  return "low";
}
