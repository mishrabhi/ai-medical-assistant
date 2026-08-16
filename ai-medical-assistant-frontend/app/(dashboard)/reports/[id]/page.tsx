"use client";

import { useParams } from "next/navigation";
import { AlertTriangle, FileText, Sparkles, Wand2 } from "lucide-react";

import { useReport } from "@/hooks/useReports";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError } = useReport(params.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-red-700">Something went wrong while loading this report.</CardContent>
      </Card>
    );
  }

  const report = data.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-teal-700">Report details</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{report.title}</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="rounded-xl">Process OCR</Button>
          <Button size="sm" className="rounded-xl">
            <Sparkles className="mr-2 h-4 w-4" />
            Analyze with AI
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-teal-700" />
              Report information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Report type</p>
                <p className="mt-1 font-medium text-slate-900">{report.reportType}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Uploaded</p>
                <p className="mt-1 font-medium text-slate-900">{new Date(report.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-500">File</p>
              <p className="mt-1 font-medium text-slate-900">{report.fileName}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">OCR text</p>
              <div className="mt-2 max-h-80 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {report.ocrText || "OCR text will appear once it has been processed."}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Wand2 className="h-5 w-5 text-teal-700" />
              AI analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!report.aiSummary ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                AI analysis is not available yet.
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="success">LOW</Badge>
                  <span className="text-sm text-slate-500">Risk level</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 whitespace-pre-line">
                  {report.aiSummary}
                </div>
              </>
            )}

            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <AlertTriangle className="mt-0.5 h-4 w-4" />
              <span>AI-generated information is not a diagnosis.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
