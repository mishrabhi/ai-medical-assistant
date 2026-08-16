export type SymptomRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface SymptomCheck {
  id: string;
  userId: string;
  symptoms: string[];
  analysis: Record<string, unknown> | null;
  riskLevel: SymptomRiskLevel;
  createdAt: string;
  updatedAt: string;
}

export interface SymptomCheckInput {
  symptoms: string[];
}
