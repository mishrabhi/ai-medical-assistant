"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  MapPin,
  Stethoscope,
  Trash2,
  XCircle,
} from "lucide-react";
import type { AxiosError } from "axios";

import { useAppointments } from "@/hooks/useAppointments";
import { useDoctors } from "@/hooks/useDoctors";
import {
  AppointmentStatus,
  type Appointment,
  type CreateAppointmentPayload,
} from "@/types/appointment";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

const statusLabels: Record<AppointmentStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const statusVariants: Record<
  AppointmentStatus,
  "default" | "secondary" | "outline" | "success" | "warning" | "danger"
> = {
  PENDING: "warning",
  CONFIRMED: "default",
  COMPLETED: "success",
  CANCELLED: "danger",
};

type UpdatableAppointmentStatus =
  | AppointmentStatus.CONFIRMED
  | AppointmentStatus.COMPLETED
  | AppointmentStatus.CANCELLED;

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
};

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

export default function AppointmentsPage() {
  const searchParams = useSearchParams();
  const preselectedDoctorId = searchParams.get("doctorId");

  const {
    listQuery,
    createMutation,
    updateStatusMutation,
    deleteMutation,
  } = useAppointments();

  const { data: doctorsData, isLoading: doctorsLoading } = useDoctors();

  const doctors = doctorsData?.data ?? [];
  const appointments = listQuery.data?.data ?? [];

  const [doctorId, setDoctorId] = useState(preselectedDoctorId ?? "");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor.id === doctorId),
    [doctors, doctorId],
  );

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

  const pastAppointments = appointments
    .filter(
      (appointment) =>
        appointment.status === AppointmentStatus.COMPLETED ||
        appointment.status === AppointmentStatus.CANCELLED,
    )
    .sort(
      (a, b) =>
        new Date(b.appointmentDate).getTime() -
        new Date(a.appointmentDate).getTime(),
    );

  const handleCreateAppointment = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setFormError("");

    if (!doctorId) {
      setFormError("Please select a doctor.");
      return;
    }

    if (!appointmentDate || !appointmentTime) {
      setFormError("Please select both a date and time.");
      return;
    }

    const localDateTime = new Date(
      `${appointmentDate}T${appointmentTime}`,
    );

    if (Number.isNaN(localDateTime.getTime())) {
      setFormError("Please select a valid appointment date and time.");
      return;
    }

    if (localDateTime <= new Date()) {
      setFormError("Appointment date and time must be in the future.");
      return;
    }

    if (!selectedDoctor?.isAvailable) {
      setFormError("This doctor is currently unavailable.");
      return;
    }

    const payload: CreateAppointmentPayload = {
      doctorId,
      appointmentDate: localDateTime.toISOString(),
      ...(reason.trim() ? { reason: reason.trim() } : {}),
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    };

    try {
      await createMutation.mutateAsync(payload);

      setAppointmentDate("");
      setAppointmentTime("");
      setReason("");
      setNotes("");
      setFormError("");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;

      setFormError(
        axiosError.response?.data?.message ??
          "Unable to book the appointment. Please try again.",
      );
    }
  };

  const handleStatusChange = async (
    id: string,
    status: UpdatableAppointmentStatus,
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        id,
        payload: { status },
      });
    } catch {
      // Mutation error is handled by React Query.
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this appointment?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
    } catch {
      // Mutation error is handled by React Query.
    }
  };

  if (listQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-3 h-9 w-64" />
          <Skeleton className="mt-3 h-5 w-96 max-w-full" />
        </div>

        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (listQuery.isError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8 text-center">
          <p className="font-medium text-red-700">
            Failed to load appointments.
          </p>

          <p className="mt-1 text-sm text-red-600">
            Please refresh the page and try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-teal-700">
          Healthcare Schedule
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Appointments
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Schedule consultations and keep track of your upcoming
          healthcare appointments.
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-cyan-50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="h-5 w-5 text-teal-700" />
            Book an Appointment
          </CardTitle>

          <p className="text-sm text-slate-500">
            Choose a doctor, date and time for your consultation.
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <form
            onSubmit={handleCreateAppointment}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label
                htmlFor="doctor"
                className="text-sm font-medium text-slate-900"
              >
                Doctor
              </label>

              <select
                id="doctor"
                value={doctorId}
                onChange={(event) => setDoctorId(event.target.value)}
                disabled={doctorsLoading || createMutation.isPending}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                <option value="">Select a doctor</option>

                {doctors
                  .filter((doctor) => doctor.isAvailable)
                  .map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.fullName} — {doctor.specialization}
                    </option>
                  ))}
              </select>

              {selectedDoctor && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Stethoscope className="h-3.5 w-3.5" />

                  <span>
                    {selectedDoctor.hospital ?? "Healthcare provider"}
                  </span>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="appointment-date"
                  className="text-sm font-medium text-slate-900"
                >
                  Date
                </label>

                <Input
                  id="appointment-date"
                  type="date"
                  value={appointmentDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(event) =>
                    setAppointmentDate(event.target.value)
                  }
                  disabled={createMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="appointment-time"
                  className="text-sm font-medium text-slate-900"
                >
                  Time
                </label>

                <Input
                  id="appointment-time"
                  type="time"
                  value={appointmentTime}
                  onChange={(event) =>
                    setAppointmentTime(event.target.value)
                  }
                  disabled={createMutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="reason"
                className="text-sm font-medium text-slate-900"
              >
                Reason for visit
              </label>

              <Input
                id="reason"
                value={reason}
                maxLength={500}
                onChange={(event) => setReason(event.target.value)}
                placeholder="e.g. Regular check-up, headache, follow-up..."
                disabled={createMutation.isPending}
              />

              <p className="text-xs text-slate-400">
                {reason.length}/500
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="notes"
                className="flex items-center gap-2 text-sm font-medium text-slate-900"
              >
                <FileText className="h-4 w-4 text-slate-400" />
                Additional notes
              </label>

              <textarea
                id="notes"
                value={notes}
                maxLength={1000}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Anything the doctor should know before the appointment..."
                disabled={createMutation.isPending}
                className="min-h-24 w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />

              <p className="text-xs text-slate-400">
                {notes.length}/1000
              </p>
            </div>

            {formError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            {createMutation.isSuccess && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Appointment booked successfully.
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-teal-700 px-6 hover:bg-teal-800"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Book Appointment
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Upcoming appointments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your pending and confirmed consultations.
          </p>
        </div>

        {upcomingAppointments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Calendar className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-4 font-medium text-slate-900">
                No upcoming appointments
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Book an appointment with one of our doctors above.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                isUpdating={updateStatusMutation.isPending}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        )}
      </section>

      {pastAppointments.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Appointment history
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Completed and cancelled appointments.
            </p>
          </div>

          <div className="space-y-3">
            {pastAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                isUpdating={updateStatusMutation.isPending}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        </section>
      )}

      {appointments.length === 0 && (
        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/doctors">
              <Stethoscope className="mr-2 h-4 w-4" />
              Browse Doctors
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function AppointmentCard({
  appointment,
  onStatusChange,
  onDelete,
  isUpdating,
  isDeleting,
}: {
  appointment: Appointment;
  onStatusChange: (
    id: string,
    status: UpdatableAppointmentStatus,
  ) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}) {
  const doctorName = appointment.doctor?.fullName ?? "Doctor";

  const specialization =
    appointment.doctor?.specialization?.replaceAll("_", " ") ??
    "Healthcare provider";

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Stethoscope className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-slate-900">
                  Dr. {doctorName}
                </h3>

                <Badge variant={statusVariants[appointment.status]}>
                  {statusLabels[appointment.status]}
                </Badge>
              </div>

              <p className="mt-1 text-sm text-teal-700">
                {specialization}
              </p>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(appointment.appointmentDate)}
                </span>

                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {formatTime(appointment.appointmentDate)}
                </span>

                {appointment.doctor?.hospital && (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {appointment.doctor.hospital}
                  </span>
                )}
              </div>

              {appointment.reason && (
                <p className="mt-3 text-sm text-slate-600">
                  <span className="font-medium text-slate-800">
                    Reason:
                  </span>{" "}
                  {appointment.reason}
                </p>
              )}

              {appointment.notes && (
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-800">
                    Notes:
                  </span>{" "}
                  {appointment.notes}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            {appointment.status === AppointmentStatus.PENDING && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isUpdating}
                  onClick={() =>
                    onStatusChange(
                      appointment.id,
                      AppointmentStatus.CONFIRMED,
                    )
                  }
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirm
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={isUpdating}
                  onClick={() =>
                    onStatusChange(
                      appointment.id,
                      AppointmentStatus.CANCELLED,
                    )
                  }
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </>
            )}

            {appointment.status === AppointmentStatus.CONFIRMED && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isUpdating}
                  onClick={() =>
                    onStatusChange(
                      appointment.id,
                      AppointmentStatus.CANCELLED,
                    )
                  }
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={isUpdating}
                  onClick={() =>
                    onStatusChange(
                      appointment.id,
                      AppointmentStatus.COMPLETED,
                    )
                  }
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Complete
                </Button>
              </>
            )}

            {appointment.status !== AppointmentStatus.COMPLETED && (
              <Button
                size="sm"
                variant="ghost"
                disabled={isDeleting}
                onClick={() => onDelete(appointment.id)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}