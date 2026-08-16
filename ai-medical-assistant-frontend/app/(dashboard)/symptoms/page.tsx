"use client";

import { useMemo, useState } from "react";
import { Activity, AlertTriangle, Search, ShieldAlert, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSymptoms } from "@/hooks/useSymptoms";

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

export default function SymptomsPage() {
  const { checkMutation, listQuery } = useSymptoms();
  const [query, setQuery] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["Fever", "Fatigue"]);

  const recentChecks = useMemo(() => listQuery.data?.data ?? [], [listQuery.data]);
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
    setSelectedSymptoms((current) => current.filter((item) => item !== symptom));
  };

  const handleCheckSymptoms = async () => {
    if (selectedSymptoms.length === 0) return;

    try {
      await checkMutation.mutateAsync({ symptoms: selectedSymptoms });
    } catch {
      // error is surfaced by mutation state
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.16em] text-teal-700">Symptoms</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">How are you feeling?</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Tell us what you&apos;re experiencing and we&apos;ll help you understand what it may mean.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Choose symptoms</CardTitle>
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

          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map((symptom) => (
              <Badge key={symptom} variant="default" className="flex items-center gap-2 rounded-full px-3 py-2">
                {symptom}
                <button type="button" aria-label={`Remove ${symptom}`} onClick={() => removeSymptom(symptom)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSymptoms.map((symptom) => (
              <button
                key={symptom}
                type="button"
                onClick={() => addSymptom(symptom)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:border-teal-200 hover:bg-teal-50"
              >
                {symptom}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button type="button" className="rounded-xl" onClick={handleCheckSymptoms} disabled={checkMutation.isPending || selectedSymptoms.length === 0}>
              <Activity className="mr-2 h-4 w-4" />
              {checkMutation.isPending ? "Checking..." : "Check symptoms"}
            </Button>
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setSelectedSymptoms([])}>
              Clear
            </Button>
          </div>

          {checkMutation.isError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <ShieldAlert className="mt-0.5 h-4 w-4" />
              We couldn&apos;t analyze these symptoms right now. Please try again.
            </div>
          )}
        </CardContent>
      </Card>

      {recentChecks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent symptom checks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentChecks.slice(0, 3).map((check) => (
              <div key={check.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{check.symptoms.join(", ")}</p>
                  <Badge variant={check.riskLevel === "HIGH" ? "danger" : check.riskLevel === "MEDIUM" ? "warning" : "success"}>
                    {check.riskLevel}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">
                  {typeof check.analysis === "object" && check.analysis && "summary" in check.analysis ? String((check.analysis as Record<string, unknown>).summary) : "Risk assessment ready."}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <AlertTriangle className="mt-0.5 h-4 w-4" />
        This tool provides general guidance, not a diagnosis. Seek medical attention for urgent symptoms.
      </div>
    </div>
  );
}
