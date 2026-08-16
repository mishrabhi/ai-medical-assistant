import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/auth";
import type { AnalysisResult, MedicalReport, OCRResult, ReportType } from "@/types/report";

export const reportsApi = {
  list: async () => {
    const response = await apiClient.get<ApiResponse<MedicalReport[]>>("/reports");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<MedicalReport>>( `/reports/${id}` );
    return response.data;
  },

  upload: async (payload: { title: string; reportType: ReportType; file: File }) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("reportType", payload.reportType);
    formData.append("report", payload.file);

    const response = await apiClient.post<ApiResponse<MedicalReport>>("/reports", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/reports/${id}`);
    return response.data;
  },

  processOCR: async (id: string) => {
    const response = await apiClient.post<ApiResponse<OCRResult>>(`/reports/${id}/ocr`);
    return response.data;
  },

  analyze: async (id: string) => {
    const response = await apiClient.post<ApiResponse<AnalysisResult>>(`/reports/${id}/analyze`);
    return response.data;
  },

  getAnalysis: async (id: string) => {
    const response = await apiClient.get<ApiResponse<MedicalReport>>(`/reports/${id}/analysis`);
    return response.data;
  },
};
