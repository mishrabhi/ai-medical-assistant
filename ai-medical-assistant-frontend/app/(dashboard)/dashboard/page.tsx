"use client";

import { useEffect, useState } from "react";
import { Activity, ArrowRight, Bell, CalendarClock, FileText, ShieldAlert } from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ProtectedRoute>
      <DashboardShell>
        <div className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.16em] text-teal-700">Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                {mounted ? `Good morning, ${user?.firstName ?? "there"} 👋` : "Good morning 👋"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">Here&apos;s your health overview.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Medical Reports", value: "0", icon: FileText },
              { label: "Upcoming Appointments", value: "0", icon: CalendarClock },
              { label: "Active Reminders", value: "0", icon: Bell },
              { label: "Unread Notifications", value: "0", icon: ShieldAlert },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label} className="border-slate-200 bg-white">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-teal-100 bg-gradient-to-br from-teal-50 to-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">AI Health Assistant</CardTitle>
              <CardDescription>How can we help you today?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {[
                  "Analyze a medical report",
                  "Check symptoms",
                  "Ask the AI assistant",
                ].map((action) => (
                  <Button key={action} variant="secondary" className="gap-2 rounded-full">
                    {action}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                    <CalendarClock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">No appointments yet</p>
                    <p className="text-sm text-slate-500">Book a consultation to get started.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent medical reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                  <Activity className="h-4 w-4 text-slate-400" />
                  No medical reports yet.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardShell>
    </ProtectedRoute>
  );
}
