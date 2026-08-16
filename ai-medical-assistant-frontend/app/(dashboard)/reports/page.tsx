"use client";

import { useState } from "react";
import { FileText, Upload, Search, ArrowUpRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const reports = [
  {
    id: "1",
    title: "Blood Test Report",
    reportType: "BLOOD_TEST",
    createdAt: "2026-08-10T10:10:00.000Z",
    status: "OCR_COMPLETED",
  },
  {
    id: "2",
    title: "Chest X-Ray",
    reportType: "XRAY",
    createdAt: "2026-08-08T14:30:00.000Z",
    status: "ANALYZED",
  },
];

const reportTypeLabels: Record<string, string> = {
  BLOOD_TEST: "Blood Test",
  XRAY: "X-Ray",
  MRI: "MRI",
  CT_SCAN: "CT Scan",
  ULTRASOUND: "Ultrasound",
  PRESCRIPTION: "Prescription",
  OTHER: "Other",
};

const reportStatusLabels: Record<string, string> = {
  UPLOADED: "Uploaded",
  OCR_PROCESSING: "OCR Processing",
  OCR_COMPLETED: "OCR Complete",
  ANALYZING: "Analyzing",
  ANALYZED: "Analyzed",
  FAILED: "Failed",
};

export default function ReportsPage() {
  const [query, setQuery] = useState("");

  const filteredReports = reports.filter((report) =>
    `${report.title} ${reportTypeLabels[report.reportType]}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-teal-700">Reports</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Medical Reports</h1>
          <p className="mt-2 text-sm text-slate-500">Upload and understand your medical reports with AI-powered assistance.</p>
        </div>

        <Button className="gap-2 rounded-xl">
          <Upload className="h-4 w-4" />
          Upload Report
        </Button>
      </div>

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
              <p className="mt-4 text-lg font-medium text-slate-900">No medical reports yet.</p>
              <p className="mt-2 text-sm text-slate-500">Upload your first report to get AI-powered insights.</p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-slate-900">{report.title}</p>
                      <Badge variant="secondary">{reportTypeLabels[report.reportType]}</Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{reportStatusLabels[report.status]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="success" className="gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    AI analysis ready
                  </Badge>
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                    View
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
