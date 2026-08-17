"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  Loader2,
  Search,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { useReports } from "@/hooks/useReports";
import type { ReportType } from "@/types/report";

const reportTypeLabels: Record<string, string> = {
  BLOOD_TEST: "Blood Test",
  XRAY: "X-Ray",
  MRI: "MRI",
  CT_SCAN: "CT Scan",
  ULTRASOUND: "Ultrasound",
  PRESCRIPTION: "Prescription",
  OTHER: "Other",
};

function getReportStatus(report: {
  ocrText?: string | null;
  aiSummary?: string | null;
}) {
  if (report.aiSummary) {
    return "ANALYZED";
  }

  if (report.ocrText) {
    return "OCR_COMPLETED";
  }

  return "UPLOADED";
}

const reportStatusLabels: Record<string, string> = {
  UPLOADED: "Uploaded",
  OCR_COMPLETED: "OCR Complete",
  ANALYZED: "Analyzed",
};

export default function ReportsPage() {
  const { listQuery, uploadMutation } = useReports();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);

  const [title, setTitle] = useState("");
  const [reportType, setReportType] = useState<ReportType>("OTHER");
  const [file, setFile] = useState<File | null>(null);
  const [formError, setFormError] = useState("");

  const reports = listQuery.data?.data ?? [];

  const filteredReports = reports.filter((report) =>
    `${report.title} ${reportTypeLabels[report.reportType]}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  const handleUpload = async () => {
    setFormError("");

    if (!title.trim()) {
      setFormError("Please enter a report title.");
      return;
    }

    if (!file) {
      setFormError("Please select a report file.");
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        title: title.trim(),
        reportType,
        file,
      });

      setTitle("");
      setReportType("OTHER");
      setFile(null);
      setShowUploadForm(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        setFormError(
          axiosError.response?.data?.message ??
            "Unable to upload the report. Please try again.",
        );
      } else {
        setFormError("Unable to upload the report. Please try again.");
      }
    }
  };

  if (listQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-3 h-9 w-64" />
          <Skeleton className="mt-3 h-5 w-96 max-w-full" />
        </div>

        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (listQuery.isError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8 text-center">
          <p className="font-medium text-red-700">
            Failed to load medical reports.
          </p>
          <p className="mt-1 text-sm text-red-600">
            Please refresh the page and try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-teal-700">
            Reports
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Medical Reports
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Upload and understand your medical reports with AI-powered
            assistance.
          </p>
        </div>

        <Button
          type="button"
          className="gap-2 rounded-xl bg-teal-700 hover:bg-teal-800"
          onClick={() => {
            setShowUploadForm((value) => !value);
            setFormError("");
          }}
        >
          {showUploadForm ? (
            <>
              <X className="h-4 w-4" />
              Close
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Report
            </>
          )}
        </Button>
      </div>

      {/* Upload form */}
      {showUploadForm && (
        <Card className="border-teal-100">
          <CardHeader>
            <CardTitle className="text-xl">Upload Medical Report</CardTitle>
            <p className="text-sm text-slate-500">
              Add a report to your medical records.
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="report-title"
                className="text-sm font-medium text-slate-900"
              >
                Report title
              </label>

              <Input
                id="report-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Complete Blood Count"
                maxLength={150}
                disabled={uploadMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="report-type"
                className="text-sm font-medium text-slate-900"
              >
                Report type
              </label>

              <select
                id="report-type"
                value={reportType}
                onChange={(event) =>
                  setReportType(event.target.value as ReportType)
                }
                disabled={uploadMutation.isPending}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                {Object.entries(reportTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="report-file"
                className="text-sm font-medium text-slate-900"
              >
                Report file
              </label>

              <Input
                ref={fileInputRef}
                id="report-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(event) =>
                  setFile(event.target.files?.[0] ?? null)
                }
                disabled={uploadMutation.isPending}
              />

              {file && (
                <p className="text-xs text-slate-500">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {formError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            {uploadMutation.isSuccess && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Report uploaded successfully.
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="gap-2 bg-teal-700 hover:bg-teal-800"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Report
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl">Your reports</CardTitle>

          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="Search reports"
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
                <FileText className="h-5 w-5" />
              </div>

              <p className="mt-4 text-lg font-medium text-slate-900">
                {query
                  ? "No reports match your search."
                  : "No medical reports yet."}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {query
                  ? "Try a different search term."
                  : "Upload your first report to get AI-powered insights."}
              </p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const status = getReportStatus(report);

              return (
                <div
                  key={report.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-slate-900">
                          {report.title}
                        </p>

                        <Badge variant="secondary">
                          {reportTypeLabels[report.reportType] ??
                            report.reportType}
                        </Badge>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>

                        <span>•</span>

                        <span>{reportStatusLabels[status]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {status === "ANALYZED" && (
                      <Badge variant="success" className="gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        AI analysis ready
                      </Badge>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-xl"
                      asChild
                    >
                      <Link href={`/reports/${report.id}`}>
                        View
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}