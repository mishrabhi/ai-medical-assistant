"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Search,
  Stethoscope,
  UserRound,
} from "lucide-react";

import { useDoctors } from "@/hooks/useDoctors";
import { DoctorSpecialization } from "@/types/doctor";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const specializationLabels: Record<DoctorSpecialization, string> = {
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

export default function DoctorsPage() {
  const { data, isLoading, isError } = useDoctors();

  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState<
    DoctorSpecialization | "ALL"
  >("ALL");

  const [availability, setAvailability] = useState<
    "ALL" | "AVAILABLE" | "UNAVAILABLE"
  >("ALL");

  const doctors = data?.data ?? [];

  const filteredDoctors = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSearch =
        !normalizedSearch ||
        doctor.fullName.toLowerCase().includes(normalizedSearch) ||
        (doctor.hospital ?? "").toLowerCase().includes(normalizedSearch);

      const matchesSpecialization =
        specialization === "ALL" ||
        doctor.specialization === specialization;

      const matchesAvailability =
        availability === "ALL" ||
        (availability === "AVAILABLE" && doctor.isAvailable) ||
        (availability === "UNAVAILABLE" && !doctor.isAvailable);

      return (
        matchesSearch &&
        matchesSpecialization &&
        matchesAvailability
      );
    });
  }, [doctors, search, specialization, availability]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-3 h-9 w-64" />
          <Skeleton className="mt-3 h-5 w-96 max-w-full" />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <Skeleton className="h-16 w-16 rounded-2xl" />
                <Skeleton className="mt-5 h-6 w-40" />
                <Skeleton className="mt-2 h-4 w-32" />
                <Skeleton className="mt-6 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-3/4" />
                <Skeleton className="mt-6 h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8 text-center">
          <p className="font-medium text-red-700">
            Failed to load doctors.
          </p>
          <p className="mt-1 text-sm text-red-600">
            Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-teal-700">
          Healthcare Providers
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Find a Doctor
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Browse healthcare professionals and find the right doctor
          for your needs.
        </p>
      </div>

      {/* Search + Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by doctor or hospital..."
                className="pl-9"
              />
            </div>

            <select
              value={specialization}
              onChange={(event) =>
                setSpecialization(
                  event.target.value as DoctorSpecialization | "ALL"
                )
              }
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="ALL">All specializations</option>

              {Object.entries(specializationLabels).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                )
              )}
            </select>

            <select
              value={availability}
              onChange={(event) =>
                setAvailability(
                  event.target.value as
                    | "ALL"
                    | "AVAILABLE"
                    | "UNAVAILABLE"
                )
              }
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="ALL">All doctors</option>
              <option value="AVAILABLE">Available now</option>
              <option value="UNAVAILABLE">Currently unavailable</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {filteredDoctors.length}{" "}
          {filteredDoctors.length === 1 ? "doctor" : "doctors"} found
        </p>
      </div>

      {/* Doctors */}
      {filteredDoctors.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="group overflow-hidden border-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <Stethoscope className="h-7 w-7" />
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      doctor.isAvailable
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {doctor.isAvailable
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </div>

                <div className="mt-5">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {doctor.fullName}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-teal-700">
                    {specializationLabels[doctor.specialization]}
                  </p>
                </div>

                <div className="mt-5 space-y-2 text-sm text-slate-500">
                  {doctor.hospital && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="truncate">
                        {doctor.hospital}
                      </span>
                    </div>
                  )}

                  {doctor.experienceYears !== undefined && (
                    <div className="flex items-center gap-2">
                      <UserRound className="h-4 w-4 shrink-0 text-slate-400" />
                      <span>
                        {doctor.experienceYears} years experience
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/doctors/${doctor.id}`}>
                      View Profile
                    </Link>
                  </Button>

                  <Button
                    asChild={doctor.isAvailable}
                    disabled={!doctor.isAvailable}
                    className="bg-teal-700 hover:bg-teal-800"
                  >
                    {doctor.isAvailable ? (
                      <Link href={`/appointments?doctorId=${doctor.id}`}>
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Book
                      </Link>
                    ) : (
                      <span>Unavailable</span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Stethoscope className="h-6 w-6 text-slate-400" />
            </div>

            <h2 className="mt-5 font-semibold text-slate-900">
              No doctors found
            </h2>

            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Try adjusting your search or filters to find
              available healthcare providers.
            </p>

            <Button
              variant="outline"
              className="mt-5"
              onClick={() => {
                setSearch("");
                setSpecialization("ALL");
                setAvailability("ALL");
              }}
            >
              Clear filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}