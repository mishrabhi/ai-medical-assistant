"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Search,
  ShieldAlert,
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
import { useSymptoms } from "@/hooks/useSymptoms";
import type { SymptomCheck } from "@/types/symptom";

const symptomOptions = [
  "Fever",
  "Fatigue",
  "Headache",
  "Cough",
  "Shortness of breath",
  "Nausea",
  "Dizziness",
  "Chest pain",
  "Joint pain",
  "Sore throat",
];

type SymptomAnalysis = {
  summary?: string;
  possibleCauses?: string[];
  riskLevel?: "LOW" | "MEDIUM" | "HIGH";
  urgency?: "ROUTINE" | "SOON" | "URGENT";
  recommendations?: string[];
  warningSigns?: string[];
};

function getAnalysis(analysis: SymptomCheck["analysis"]): SymptomAnalysis | null {
  if (!analysis || typeof analysis !== "object") {
    return null;
  }

  return analysis as SymptomAnalysis;
}

function getRiskVariant(
  riskLevel: SymptomCheck["riskLevel"],
): "success" | "warning" | "danger" {
  if (riskLevel === "HIGH") {
    return "danger";
  }

  if (riskLevel === "MEDIUM") {
    return "warning";
  }

  return "success";
}

function getUrgencyVariant(
  urgency?: SymptomAnalysis["urgency"],
): "default" | "warning" | "danger" | "secondary" {
  if (urgency === "URGENT") {
    return "danger";
  }

  if (urgency === "SOON") {
    return "warning";
  }

  return "secondary";
}

export default function SymptomsPage() {
  const { checkMutation, listQuery } = useSymptoms();

  const [query, setQuery] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    "Fever",
    "Fatigue",
  ]);

  const recentChecks = useMemo(
    () => listQuery.data?.data ?? [],
    [listQuery.data],
  );

  const latestCheck = checkMutation.data?.data;

  const latestAnalysis = latestCheck
    ? getAnalysis(latestCheck.analysis)
    : null;

  const filteredSymptoms = symptomOptions.filter((symptom) =>
    symptom.toLowerCase().includes(query.toLowerCase()),
  );

  const addSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms((current) => [...current, symptom]);
    }

    setQuery("");
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms((current) =>
      current.filter((item) => item !== symptom),
    );
  };

  const handleCheckSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      return;
    }

    try {
      await checkMutation.mutateAsync({
        symptoms: selectedSymptoms,
      });
    } catch {
      // Mutation error is displayed below.
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm uppercase tracking-[0.16em] text-teal-700">
          Symptoms
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          How are you feeling?
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Tell us what you&apos;re experiencing and we&apos;ll help you
          understand what it may mean.
        </p>
      </div>

      {/* Symptom Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Choose symptoms
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="Search symptoms"
            />
          </div>

          {selectedSymptoms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom) => (
                <Badge
                  key={symptom}
                  variant="default"
                  className="flex items-center gap-2 rounded-full px-3 py-2"
                >
                  {symptom}

                  <button
                    type="button"
                    aria-label={`Remove ${symptom}`}
                    onClick={() => removeSymptom(symptom)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSymptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom);

              return (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => addSymptom(symptom)}
                  disabled={isSelected}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                    isSelected
                      ? "cursor-not-allowed border-teal-200 bg-teal-50 text-teal-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-teal-50"
                  }`}
                >
                  {symptom}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              className="rounded-xl"
              onClick={handleCheckSymptoms}
              disabled={
                checkMutation.isPending ||
                selectedSymptoms.length === 0
              }
            >
              <Activity className="mr-2 h-4 w-4" />

              {checkMutation.isPending
                ? "Checking..."
                : "Check symptoms"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setSelectedSymptoms([])}
              disabled={checkMutation.isPending}
            >
              Clear
            </Button>
          </div>

          {checkMutation.isError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />

              <span>
                We couldn&apos;t analyze these symptoms right now.
                Please try again.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Latest Analysis */}
      {latestCheck && latestAnalysis && (
        <Card className="border-teal-100">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-cyan-50">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-xl">
                  Your symptom analysis
                </CardTitle>

                <p className="mt-1 text-sm text-slate-500">
                  Based on: {latestCheck.symptoms.join(", ")}
                </p>
              </div>

              <div className="flex gap-2">
                <Badge
                  variant={getRiskVariant(latestCheck.riskLevel)}
                >
                  Risk: {latestCheck.riskLevel}
                </Badge>

                {latestAnalysis.urgency && (
                  <Badge
                    variant={getUrgencyVariant(
                      latestAnalysis.urgency,
                    )}
                  >
                    {latestAnalysis.urgency}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {latestAnalysis.summary && (
              <div>
                <h3 className="font-semibold text-slate-900">
                  Summary
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {latestAnalysis.summary}
                </p>
              </div>
            )}

            {latestAnalysis.possibleCauses &&
              latestAnalysis.possibleCauses.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Possible explanations
                  </h3>

                  <ul className="mt-2 space-y-2">
                    {latestAnalysis.possibleCauses.map(
                      (cause, index) => (
                        <li
                          key={`${cause}-${index}`}
                          className="flex gap-2 text-sm text-slate-600"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                          {cause}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}

            {latestAnalysis.recommendations &&
              latestAnalysis.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Recommendations
                  </h3>

                  <ul className="mt-2 space-y-2">
                    {latestAnalysis.recommendations.map(
                      (recommendation, index) => (
                        <li
                          key={`${recommendation}-${index}`}
                          className="flex gap-2 text-sm text-slate-600"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                          {recommendation}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}

            {latestAnalysis.warningSigns &&
              latestAnalysis.warningSigns.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

                    <div>
                      <h3 className="font-semibold text-amber-900">
                        Warning signs
                      </h3>

                      <ul className="mt-2 space-y-2">
                        {latestAnalysis.warningSigns.map(
                          (warning, index) => (
                            <li
                              key={`${warning}-${index}`}
                              className="text-sm text-amber-800"
                            >
                              • {warning}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Recent Checks */}
      {recentChecks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Recent symptom checks
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {recentChecks.slice(0, 3).map((check) => {
              const analysis = getAnalysis(check.analysis);

              return (
                <div
                  key={check.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium text-slate-900">
                      {check.symptoms.join(", ")}
                    </p>

                    <Badge
                      variant={getRiskVariant(check.riskLevel)}
                    >
                      {check.riskLevel}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-600">
                    {analysis?.summary ??
                      "Risk assessment ready."}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(
                      check.createdAt,
                    ).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

        <span>
          This tool provides general health information, not a
          diagnosis. Seek medical attention for urgent or
          concerning symptoms.
        </span>
      </div>
    </div>
  );
}