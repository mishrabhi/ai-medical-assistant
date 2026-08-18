"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  FileText,
  Loader2,
  ScanText,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { useReport, useReportAnalysis } from "@/hooks/useReports";
import { useReports } from "@/hooks/useReports";
import { apiClient } from "@/lib/api/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const reportTypeLabels: Record<string, string> = {
  BLOOD_TEST: "Blood Test",
  XRAY: "X-Ray",
  MRI: "MRI",
  CT_SCAN: "CT Scan",
  ULTRASOUND: "Ultrasound",
  PRESCRIPTION: "Prescription",
  OTHER: "Other",
};

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    return axiosError.response?.data?.message ?? fallback;
  }

  return fallback;
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();

  const reportId = Array.isArray(params.id)
    ? (params.id[0] ?? "")
    : (params.id ?? "");

  const { data, isLoading, isError } = useReport(reportId);
  const { data: analysisData } = useReportAnalysis(reportId);

  const { processOCRMutation, analyzeMutation, deleteMutation } = useReports();

  const report = data?.data ?? null;
  const analyzedReport = analysisData?.data ?? null;

  const currentReport = analyzedReport ?? report;

  const handleOCR = async () => {
    try {
      await processOCRMutation.mutateAsync(reportId);
    } catch {
      // Error is displayed below through mutation state.
    }
  };

  const handleAnalyze = async () => {
    try {
      await analyzeMutation.mutateAsync(reportId);
    } catch {
      // Error is displayed below through mutation state.
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this medical report?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(reportId);
      router.push("/reports");
    } catch {
      // Error is displayed below through mutation state.
    }
  };

  const handleOpenOriginalReport = async () => {
    try {
      const response = await apiClient.get(`/reports/${reportId}/file`, {
        responseType: "blob",
      });

      const blobUrl = URL.createObjectURL(response.data);

      window.open(blobUrl, "_blank", "noopener,noreferrer");

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 60_000);
    } catch {
      // File could not be opened.
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !currentReport) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/reports">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to reports
          </Link>
        </Button>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <p className="font-medium text-red-700">
              Medical report could not be loaded.
            </p>
            <p className="mt-1 text-sm text-red-600">
              The report may have been deleted or you may not have access to it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasOCR = Boolean(currentReport.ocrText);
  const hasAnalysis = Boolean(currentReport.aiSummary);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" className="-ml-3" asChild>
            <Link href="/reports">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to reports
            </Link>
          </Button>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              {currentReport.title}
            </h1>

            <Badge variant="secondary">
              {reportTypeLabels[currentReport.reportType] ??
                currentReport.reportType}
            </Badge>

            {hasAnalysis && (
              <Badge variant="success" className="gap-1">
                <ShieldCheck className="h-3 w-3" />
                AI analyzed
              </Badge>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Uploaded {new Date(currentReport.createdAt).toLocaleDateString()}
          </p>
        </div>

        <Button
          variant="ghost"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          {deleteMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          Delete Report
        </Button>
      </div>

      {/* Report information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-teal-700" />
            Report Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                File
              </p>
              <p className="mt-1 truncate text-sm font-medium text-slate-800">
                {currentReport.fileName}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Type
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {reportTypeLabels[currentReport.reportType] ??
                  currentReport.reportType}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                File size
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {currentReport.fileSize
                  ? `${(currentReport.fileSize / 1024).toFixed(1)} KB`
                  : "Unknown"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                MIME type
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {currentReport.mimeType ?? "Unknown"}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <Button
              variant="outline"
              onClick={() => void handleOpenOriginalReport()}
            >
              <FileText className="mr-2 h-4 w-4" />
              Open Original Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* OCR */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanText className="h-5 w-5 text-teal-700" />
            OCR Text
          </CardTitle>

          <p className="text-sm text-slate-500">
            Extract text from the uploaded medical report before AI analysis.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {!hasOCR ? (
            <>
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <ScanText className="mx-auto h-8 w-8 text-slate-400" />

                <p className="mt-3 font-medium text-slate-800">
                  OCR has not been processed yet.
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Extract the text from your report to enable AI analysis.
                </p>
              </div>

              <Button
                onClick={handleOCR}
                disabled={processOCRMutation.isPending}
                className="bg-teal-700 hover:bg-teal-800"
              >
                {processOCRMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing OCR...
                  </>
                ) : (
                  <>
                    <ScanText className="mr-2 h-4 w-4" />
                    Process OCR
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                OCR processing completed.
              </div>

              <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-slate-700">
                  {currentReport.ocrText}
                </pre>
              </div>
            </>
          )}

          {processOCRMutation.isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getErrorMessage(
                processOCRMutation.error,
                "OCR processing failed. Please try again.",
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-teal-700" />
            AI Analysis
          </CardTitle>

          <p className="text-sm text-slate-500">
            Get a patient-friendly explanation of the information contained in
            your report.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {!hasOCR ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              Complete OCR processing before starting AI analysis.
            </div>
          ) : !hasAnalysis ? (
            <>
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <Brain className="mx-auto h-8 w-8 text-slate-400" />

                <p className="mt-3 font-medium text-slate-800">
                  AI analysis is not available yet.
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  The extracted report text is ready to be analyzed.
                </p>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={analyzeMutation.isPending}
                className="bg-teal-700 hover:bg-teal-800"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Report...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Report
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="rounded-xl border border-teal-100 bg-teal-50 p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-teal-800">
                <CheckCircle2 className="h-4 w-4" />
                AI analysis completed
              </div>

              <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {currentReport.aiSummary}
              </div>
            </div>
          )}

          {analyzeMutation.isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getErrorMessage(
                analyzeMutation.error,
                "AI analysis failed. Please try again.",
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medical disclaimer */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
        <strong className="text-slate-700">Important:</strong> AI analysis is
        provided for general informational purposes only. It does not constitute
        a medical diagnosis or replace advice from a qualified healthcare
        professional.
      </div>
    </div>
  );
}
