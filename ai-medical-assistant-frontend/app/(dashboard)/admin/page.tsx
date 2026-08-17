"use client";

import {
  Activity,
  CalendarDays,
  CheckCircle2,
  FileText,
  Stethoscope,
  Users,
  UserCheck,
  Clock,
  XCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useAdminDashboard } from "@/hooks/useAdmin";

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number;
  icon: typeof Users;
  description?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-slate-500">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useAdminDashboard();

  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-teal-700">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Admin Dashboard
          </h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="h-28 animate-pulse p-5">
                <div className="h-4 w-24 rounded bg-slate-200" />
                <div className="mt-4 h-8 w-16 rounded bg-slate-200" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Unable to load admin dashboard data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.16em] text-teal-700">
          Administration
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Overview of users, doctors, appointments, reports, and symptom
          activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.users.total}
          icon={Users}
          description={`${stats.users.active} active users`}
        />

        <StatCard
          title="Total Doctors"
          value={stats.doctors.total}
          icon={Stethoscope}
          description={`${stats.doctors.available} available`}
        />

        <StatCard
          title="Appointments"
          value={stats.appointments.total}
          icon={CalendarDays}
          description={`${stats.appointments.pending} pending`}
        />

        <StatCard
          title="Medical Reports"
          value={stats.medicalReports}
          icon={FileText}
        />

        <StatCard
          title="Symptom Checks"
          value={stats.symptomChecks}
          icon={Activity}
        />

        <StatCard
          title="Completed Appointments"
          value={stats.appointments.completed}
          icon={CheckCircle2}
        />

        <StatCard
          title="Pending Appointments"
          value={stats.appointments.pending}
          icon={Clock}
        />

        <StatCard
          title="Cancelled Appointments"
          value={stats.appointments.cancelled}
          icon={XCircle}
        />
      </div>

      <Card>
        <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
              <UserCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Active users
              </p>

              <p className="text-xl font-semibold text-slate-900">
                {stats.users.active} / {stats.users.total}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
              <Stethoscope className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Available doctors
              </p>

              <p className="text-xl font-semibold text-slate-900">
                {stats.doctors.available} / {stats.doctors.total}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}