"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarClock,
  FileText,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { useReports } from "@/hooks/useReports";
import { useAppointments } from "@/hooks/useAppointments";
import { useReminders } from "@/hooks/useReminders";
import { useNotifications } from "@/hooks/useNotifications";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { AppointmentStatus } from "@/types/appointment";
import { ReminderStatus } from "@/types/reminder";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatReportType(type: string) {
  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { listQuery: reportsQuery } = useReports();
  const { listQuery: appointmentsQuery } = useAppointments();
  const { listQuery: remindersQuery } = useReminders();
  const { listQuery: notificationsQuery } = useNotifications();

  const reports = reportsQuery.data?.data ?? [];
  const appointments = appointmentsQuery.data?.data ?? [];
  const reminders = remindersQuery.data?.data ?? [];
  const notifications = notificationsQuery.data?.data ?? [];

  const upcomingAppointments = appointments
    .filter(
      (appointment) =>
        appointment.status === AppointmentStatus.PENDING ||
        appointment.status === AppointmentStatus.CONFIRMED,
    )
    .sort(
      (a, b) =>
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime(),
    );

  const nextAppointment = upcomingAppointments[0];

  const activeReminders = reminders.filter(
    (reminder) => reminder.status === ReminderStatus.ACTIVE,
  );

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead,
  );

  const recentReports = [...reports]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  const stats = [
    {
      label: "Medical Reports",
      value: reports.length,
      icon: FileText,
      href: "/reports",
    },
    {
      label: "Upcoming Appointments",
      value: upcomingAppointments.length,
      icon: CalendarClock,
      href: "/appointments",
    },
    {
      label: "Active Reminders",
      value: activeReminders.length,
      icon: Bell,
      href: "/reminders",
    },
    {
      label: "Unread Notifications",
      value: unreadNotifications.length,
      icon: ShieldAlert,
      href: "/notifications",
    },
  ];

  const isLoading =
    reportsQuery.isLoading ||
    appointmentsQuery.isLoading ||
    remindersQuery.isLoading ||
    notificationsQuery.isLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm uppercase tracking-[0.16em] text-teal-700">
          Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Good morning, {user?.firstName ?? "there"} 👋
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Here&apos;s your health overview.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link href={href} key={label}>
            <Card className="border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-slate-500">{label}</p>

                  {isLoading ? (
                    <Skeleton className="mt-3 h-9 w-12" />
                  ) : (
                    <p className="mt-3 text-3xl font-semibold text-slate-900">
                      {value}
                    </p>
                  )}
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* AI Health Assistant */}
      <Card className="border-teal-100 bg-gradient-to-br from-teal-50 to-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">AI Health Assistant</CardTitle>

          <CardDescription>How can we help you today?</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary" className="gap-2 rounded-full">
              <Link href="/reports">
                Analyze a medical report
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="secondary" className="gap-2 rounded-full">
              <Link href="/symptoms">
                Check symptoms
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="secondary" className="gap-2 rounded-full">
              <Link href="/assistant">
                Ask the AI assistant
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appointment + Reports */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointment</CardTitle>
              <CardDescription>
                Your next scheduled consultation.
              </CardDescription>
            </div>

            <Button asChild variant="ghost" size="sm">
              <Link href="/appointments">View all</Link>
            </Button>
          </CardHeader>

          <CardContent>
            {appointmentsQuery.isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : nextAppointment ? (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                  <CalendarClock className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="font-medium text-slate-900">
                    Dr. {nextAppointment.doctor?.fullName ?? "Doctor"}
                  </p>

                  <p className="mt-1 text-sm text-teal-700">
                    {nextAppointment.doctor?.specialization
                      ?.replaceAll("_", " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (char) => char.toUpperCase()) ??
                      "Healthcare provider"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>{formatDate(nextAppointment.appointmentDate)}</span>
                    <span>{formatTime(nextAppointment.appointmentDate)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                  <CalendarClock className="h-4 w-4" />
                </div>

                <div>
                  <p className="font-medium text-slate-900">
                    No appointments yet
                  </p>

                  <p className="text-sm text-slate-500">
                    Book a consultation to get started.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Medical Reports</CardTitle>
              <CardDescription>Your latest uploaded reports.</CardDescription>
            </div>

            <Button asChild variant="ghost" size="sm">
              <Link href="/reports">View all</Link>
            </Button>
          </CardHeader>

          <CardContent>
            {reportsQuery.isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : recentReports.length > 0 ? (
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <Link
                    key={report.id}
                    href={`/reports/${report.id}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-teal-200 hover:bg-teal-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm">
                      <FileText className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">
                        {report.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatReportType(report.reportType)} ·{" "}
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {report.aiSummary ? (
                      <span className="shrink-0 text-xs font-medium text-emerald-600">
                        AI Ready
                      </span>
                    ) : report.ocrText ? (
                      <span className="shrink-0 text-xs font-medium text-teal-600">
                        OCR Ready
                      </span>
                    ) : (
                      <span className="shrink-0 text-xs text-slate-400">
                        Uploaded
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                <Activity className="h-4 w-4 shrink-0 text-slate-400" />
                No medical reports yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Button asChild variant="outline" className="h-auto justify-start p-4">
          <Link href="/doctors">
            <Stethoscope className="mr-3 h-5 w-5 text-teal-700" />
            <span className="text-left">
              <span className="block font-medium">Find a Doctor</span>
              <span className="mt-1 block text-xs text-slate-500">
                Browse healthcare providers
              </span>
            </span>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-auto justify-start p-4">
          <Link href="/reminders">
            <Bell className="mr-3 h-5 w-5 text-teal-700" />
            <span className="text-left">
              <span className="block font-medium">Health Reminders</span>
              <span className="mt-1 block text-xs text-slate-500">
                Manage your reminders
              </span>
            </span>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-auto justify-start p-4">
          <Link href="/notifications">
            <ShieldAlert className="mr-3 h-5 w-5 text-teal-700" />
            <span className="text-left">
              <span className="block font-medium">Notifications</span>
              <span className="mt-1 block text-xs text-slate-500">
                Check your latest updates
              </span>
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
