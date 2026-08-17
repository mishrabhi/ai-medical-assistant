"use client";

import { useState } from "react";
import {
  Edit3,
  Plus,
  Stethoscope,
  Trash2,
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

import {
  DoctorSpecialization,
  doctorSpecializationLabels,
  type CreateDoctorPayload,
  type Doctor,
} from "@/types/doctor";

import { useAdminDoctors } from "@/hooks/useAdmin";

const specializations = Object.values(DoctorSpecialization);

const EMPTY_FORM: CreateDoctorPayload = {
  fullName: "",
  specialization: DoctorSpecialization.GENERAL_PHYSICIAN,
  hospital: "",
  experienceYears: undefined,
  email: "",
  phone: "",
};

export default function AdminDoctorsPage() {
  const {
    listQuery,
    createMutation,
    updateMutation,
    availabilityMutation,
    deleteMutation,
  } = useAdminDoctors();

  const [form, setForm] =
    useState<CreateDoctorPayload>(EMPTY_FORM);

  const [editingDoctor, setEditingDoctor] =
    useState<Doctor | null>(null);

  const [showForm, setShowForm] = useState(false);

  const doctors = listQuery.data?.data ?? [];

  const openCreate = () => {
    setEditingDoctor(null);
    setForm({ ...EMPTY_FORM });
    setShowForm(true);
  };

  const openEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);

    setForm({
      fullName: doctor.fullName,
      specialization: doctor.specialization,
      hospital: doctor.hospital ?? "",
      experienceYears:
        doctor.experienceYears ?? undefined,
      email: doctor.email ?? "",
      phone: doctor.phone ?? "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingDoctor(null);
    setForm({ ...EMPTY_FORM });
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const payload: CreateDoctorPayload = {
      fullName: form.fullName.trim(),
      specialization: form.specialization,
      hospital: form.hospital?.trim() || undefined,
      experienceYears:
        form.experienceYears === undefined ||
        Number.isNaN(form.experienceYears)
          ? undefined
          : form.experienceYears,
      email: form.email?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
    };

    try {
      if (editingDoctor) {
        await updateMutation.mutateAsync({
          id: editingDoctor.id,
          payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      closeForm();
    } catch {
      // Error is displayed below.
    }
  };

  const handleDelete = async (doctor: Doctor) => {
    const confirmed = window.confirm(
      `Delete ${doctor.fullName}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(doctor.id);
    } catch {
      // Error is displayed through mutation state.
    }
  };

  const handleAvailability = async (doctor: Doctor) => {
    try {
      await availabilityMutation.mutateAsync({
        id: doctor.id,
        isAvailable: !doctor.isAvailable,
      });
    } catch {
      // Error is displayed through mutation state.
    }
  };

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending;

  const mutationError =
    createMutation.isError ||
    updateMutation.isError ||
    availabilityMutation.isError ||
    deleteMutation.isError;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-teal-700">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Manage Doctors
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create, update, and manage doctor availability.
          </p>
        </div>

        <Button
          onClick={openCreate}
          className="gap-2 rounded-xl"
        >
          <Plus className="h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      {/* Error */}
      {mutationError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to complete the requested operation. Please
          try again.
        </div>
      )}

      {/* Doctor form */}
      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {editingDoctor
                ? "Edit Doctor"
                : "Add New Doctor"}
            </CardTitle>

            <Button
              variant="ghost"
              size="icon"
              onClick={closeForm}
              type="button"
              aria-label="Close form"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="grid gap-4 sm:grid-cols-2"
            >
              {/* Full name */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="doctor-full-name"
                  className="text-sm font-medium text-slate-700"
                >
                  Full name
                </label>

                <Input
                  id="doctor-full-name"
                  className="mt-2"
                  value={form.fullName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                  placeholder="Dr. John Smith"
                  required
                  minLength={2}
                />
              </div>

              {/* Specialization */}
              <div>
                <label
                  htmlFor="doctor-specialization"
                  className="text-sm font-medium text-slate-700"
                >
                  Specialization
                </label>

                <select
                  id="doctor-specialization"
                  value={form.specialization}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      specialization:
                        event.target
                          .value as DoctorSpecialization,
                    }))
                  }
                  className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                  {specializations.map((specialization) => (
                    <option
                      key={specialization}
                      value={specialization}
                    >
                      {
                        doctorSpecializationLabels[
                          specialization
                        ]
                      }
                    </option>
                  ))}
                </select>
              </div>

              {/* Hospital */}
              <div>
                <label
                  htmlFor="doctor-hospital"
                  className="text-sm font-medium text-slate-700"
                >
                  Hospital
                </label>

                <Input
                  id="doctor-hospital"
                  className="mt-2"
                  value={form.hospital ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      hospital: event.target.value,
                    }))
                  }
                  placeholder="Hospital name"
                />
              </div>

              {/* Experience */}
              <div>
                <label
                  htmlFor="doctor-experience"
                  className="text-sm font-medium text-slate-700"
                >
                  Experience (years)
                </label>

                <Input
                  id="doctor-experience"
                  type="number"
                  min={0}
                  step={1}
                  className="mt-2"
                  value={form.experienceYears ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      experienceYears:
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                    }))
                  }
                  placeholder="5"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="doctor-email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <Input
                  id="doctor-email"
                  type="email"
                  className="mt-2"
                  value={form.email ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="doctor@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="doctor-phone"
                  className="text-sm font-medium text-slate-700"
                >
                  Phone
                </label>

                <Input
                  id="doctor-phone"
                  className="mt-2"
                  value={form.phone ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="9876543210"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 sm:col-span-2">
                <Button
                  type="submit"
                  className="rounded-xl"
                  disabled={isSaving}
                >
                  {isSaving
                    ? "Saving..."
                    : editingDoctor
                      ? "Update Doctor"
                      : "Create Doctor"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={closeForm}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Doctors list */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Doctors</CardTitle>

            {!listQuery.isLoading && (
              <span className="text-sm text-slate-500">
                {doctors.length}{" "}
                {doctors.length === 1
                  ? "doctor"
                  : "doctors"}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {listQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : listQuery.isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Unable to load doctors. Please refresh and try
              again.
            </div>
          ) : doctors.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                <Stethoscope className="h-5 w-5" />
              </div>

              <p className="mt-4 font-medium text-slate-900">
                No doctors found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Add your first doctor to get started.
              </p>

              <Button
                onClick={openCreate}
                className="mt-4 gap-2 rounded-xl"
              >
                <Plus className="h-4 w-4" />
                Add Doctor
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  {/* Doctor information */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                      <Stethoscope className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-900">
                          {doctor.fullName}
                        </p>

                        <Badge
                          variant={
                            doctor.isAvailable
                              ? "success"
                              : "secondary"
                          }
                        >
                          {doctor.isAvailable
                            ? "Available"
                            : "Unavailable"}
                        </Badge>
                      </div>

                      <p className="mt-1 text-sm font-medium text-teal-700">
                        {
                          doctorSpecializationLabels[
                            doctor.specialization
                          ]
                        }
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {doctor.hospital ||
                          "Hospital not specified"}

                        {doctor.experienceYears !==
                          null &&
                        doctor.experienceYears !==
                          undefined
                          ? ` • ${doctor.experienceYears} years experience`
                          : ""}
                      </p>

                      {(doctor.email || doctor.phone) && (
                        <p className="mt-1 text-xs text-slate-500">
                          {doctor.email ||
                            doctor.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 rounded-lg"
                      onClick={() => openEdit(doctor)}
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg"
                      disabled={
                        availabilityMutation.isPending
                      }
                      onClick={() =>
                        handleAvailability(doctor)
                      }
                    >
                      {doctor.isAvailable
                        ? "Set Unavailable"
                        : "Set Available"}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 rounded-lg text-red-600 hover:text-red-700"
                      disabled={
                        deleteMutation.isPending
                      }
                      onClick={() =>
                        handleDelete(doctor)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}