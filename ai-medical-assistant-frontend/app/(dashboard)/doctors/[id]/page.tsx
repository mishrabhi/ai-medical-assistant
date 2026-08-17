"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  UserRound,
} from "lucide-react";

import { useDoctor } from "@/hooks/useDoctors";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const specializationLabels: Record<string, string> = {
  CARDIOLOGIST: "Cardiologist",
  DERMATOLOGIST: "Dermatologist",
  ENT: "ENT Specialist",
  GENERAL_PHYSICIAN: "General Physician",
  GYNECOLOGIST: "Gynecologist",
  NEUROLOGIST: "Neurologist",
  ORTHOPEDIC: "Orthopedic Surgeon",
  PEDIATRICIAN: "Pediatrician",
  PSYCHIATRIST: "Psychiatrist",
  RADIOLOGIST: "Radiologist",
};

export default function DoctorDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const doctorId = params.id as string;

  const { data, isLoading, isError } = useDoctor(doctorId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardContent className="space-y-6 p-8">
            <div className="flex gap-5">
              <Skeleton className="h-24 w-24 rounded-2xl" />
              <div className="space-y-3">
                <Skeleton className="h-7 w-56" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>

            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <p className="font-medium text-red-700">
              Unable to load doctor details.
            </p>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const doctor = data.data;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button
        variant="ghost"
        className="gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to doctors
      </Button>

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
              <Stethoscope className="h-10 w-10" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold text-slate-900">
                  {doctor.fullName}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    doctor.isAvailable
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {doctor.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>

              <p className="mt-2 text-lg font-medium text-teal-700">
                {specializationLabels[doctor.specialization] ??
                  doctor.specialization}
              </p>

              {doctor.experienceYears !== undefined && (
                <p className="mt-2 text-sm text-slate-500">
                  {doctor.experienceYears} years of experience
                </p>
              )}
            </div>
          </div>
        </div>

        <CardContent className="space-y-8 p-8">
          <section>
            <h2 className="text-lg font-semibold text-slate-900">
              Professional Information
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {doctor.hospital && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Hospital
                    </p>
                    <p className="text-sm text-slate-500">
                      {doctor.hospital}
                    </p>
                  </div>
                </div>
              )}

              {doctor.email && (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Email
                    </p>
                    <p className="break-all text-sm text-slate-500">
                      {doctor.email}
                    </p>
                  </div>
                </div>
              )}

              {doctor.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Phone
                    </p>
                    <p className="text-sm text-slate-500">
                      {doctor.phone}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <UserRound className="mt-0.5 h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Specialization
                  </p>
                  <p className="text-sm text-slate-500">
                    {specializationLabels[doctor.specialization] ??
                      doctor.specialization}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">
            <Button
              asChild
              className="bg-teal-700 hover:bg-teal-800"
              disabled={!doctor.isAvailable}
            >
              <Link href={`/appointments?doctorId=${doctor.id}`}>
                <CalendarDays className="mr-2 h-4 w-4" />
                {doctor.isAvailable
                  ? "Book Appointment"
                  : "Currently Unavailable"}
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/appointments">View My Appointments</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}