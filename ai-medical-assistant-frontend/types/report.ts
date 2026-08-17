export type ReportType =
  | "BLOOD_TEST"
  | "XRAY"
  | "MRI"
  | "CT_SCAN"
  | "ULTRASOUND"
  | "PRESCRIPTION"
  | "OTHER";

export interface MedicalReport {
  id: string;
  userId: string;
  title: string;
  reportType: ReportType;
  fileName: string;
  fileUrl: string;
  mimeType?: string | null;
  fileSize?: number | null;
  ocrText?: string | null;
  aiSummary?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UploadReportPayload {
  title: string;
  reportType: ReportType;
  file: File;
}

export interface AnalysisResult {
  reportId: string;
  aiSummary: string;
}

export interface OCRResult {
  reportId: string;
  text: string;
}

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";