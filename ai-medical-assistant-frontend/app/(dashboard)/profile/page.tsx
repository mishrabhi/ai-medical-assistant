"use client";

import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Lock,
  Save,
  ShieldAlert,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUserProfile } from "@/hooks/useUser";
import type {
  BloodGroup,
  Gender,
  UpdateProfilePayload,
  UserProfile,
} from "@/types/user";

const bloodGroups: { value: BloodGroup; label: string }[] = [
  { value: "A_POSITIVE", label: "A+" },
  { value: "A_NEGATIVE", label: "A-" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "B_NEGATIVE", label: "B-" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "AB_NEGATIVE", label: "AB-" },
  { value: "O_POSITIVE", label: "O+" },
  { value: "O_NEGATIVE", label: "O-" },
];

const genders: { value: Gender; label: string }[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

function formatDateForInput(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export default function ProfilePage() {
  const { profileQuery } = useUserProfile();

  const profile = profileQuery.data?.data;

  if (profileQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-teal-700">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Profile
          </h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-10 animate-pulse rounded-lg bg-slate-100"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileQuery.isError || !profile) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-red-700">
          Unable to load your profile. Please refresh and try again.
        </CardContent>
      </Card>
    );
  }

  return <ProfileForm profile={profile} />;
}

function ProfileForm({ profile }: { profile: UserProfile }) {
  const {
    updateProfileMutation,
    changePasswordMutation,
    deactivateAccountMutation,
  } = useUserProfile();

  const [form, setForm] = useState<UpdateProfilePayload>(() => ({
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone ?? "",
    gender: profile.gender ?? undefined,
    bloodGroup: profile.bloodGroup ?? undefined,
    dateOfBirth: formatDateForInput(profile.dateOfBirth),
    height: profile.height ?? undefined,
    weight: profile.weight ?? undefined,
  }));

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [formError, setFormError] = useState("");

  const updateField = <K extends keyof UpdateProfilePayload>(
    field: K,
    value: UpdateProfilePayload[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleProfileSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setProfileMessage("");
    setFormError("");

    try {
      const payload: UpdateProfilePayload = {
        firstName: form.firstName?.trim(),
        lastName: form.lastName?.trim(),
        phone: form.phone?.trim() || undefined,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        dateOfBirth: form.dateOfBirth
          ? new Date(`${form.dateOfBirth}T00:00:00.000Z`).toISOString()
          : undefined,
        height:
          typeof form.height === "number" && form.height > 0
            ? form.height
            : undefined,
        weight:
          typeof form.weight === "number" && form.weight > 0
            ? form.weight
            : undefined,
      };

      await updateProfileMutation.mutateAsync(payload);

      setProfileMessage("Profile updated successfully.");
    } catch {
      setFormError("Unable to update your profile. Please try again.");
    }
  };

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setPasswordMessage("");
    setFormError("");

    if (!currentPassword || !newPassword) {
      setFormError("Please enter your current and new password.");
      return;
    }

    if (newPassword.length < 8) {
      setFormError("New password must be at least 8 characters.");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setPasswordMessage("Password changed successfully.");
    } catch {
      setFormError(
        "Unable to change your password. Check your current password and try again.",
      );
    }
  };

  const handleDeactivate = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate your account? You may lose access to your account.",
    );

    if (!confirmed) return;

    try {
      await deactivateAccountMutation.mutateAsync();
      setFormError("");
      window.location.href = "/login";
    } catch {
      setFormError("Unable to deactivate your account. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.16em] text-teal-700">
          Account
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Profile
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Manage your personal and health information.
        </p>
      </div>

      {formError && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-teal-700" />
            Personal information
          </CardTitle>

          <CardDescription>
            Update the information associated with your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-slate-700"
                >
                  First name
                </label>

                <Input
                  id="firstName"
                  value={form.firstName ?? ""}
                  onChange={(event) =>
                    updateField("firstName", event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-slate-700"
                >
                  Last name
                </label>

                <Input
                  id="lastName"
                  value={form.lastName ?? ""}
                  onChange={(event) =>
                    updateField("lastName", event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <Input id="email" value={profile.email} disabled />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-slate-700"
                >
                  Phone
                </label>

                <Input
                  id="phone"
                  value={form.phone ?? ""}
                  onChange={(event) =>
                    updateField("phone", event.target.value)
                  }
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="gender"
                  className="text-sm font-medium text-slate-700"
                >
                  Gender
                </label>

                <select
                  id="gender"
                  value={form.gender ?? ""}
                  onChange={(event) =>
                    updateField(
                      "gender",
                      event.target.value
                        ? (event.target.value as Gender)
                        : undefined,
                    )
                  }
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-teal-500"
                >
                  <option value="">Select gender</option>

                  {genders.map((gender) => (
                    <option key={gender.value} value={gender.value}>
                      {gender.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="bloodGroup"
                  className="text-sm font-medium text-slate-700"
                >
                  Blood group
                </label>

                <select
                  id="bloodGroup"
                  value={form.bloodGroup ?? ""}
                  onChange={(event) =>
                    updateField(
                      "bloodGroup",
                      event.target.value
                        ? (event.target.value as BloodGroup)
                        : undefined,
                    )
                  }
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-teal-500"
                >
                  <option value="">Select blood group</option>

                  {bloodGroups.map((group) => (
                    <option key={group.value} value={group.value}>
                      {group.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="dateOfBirth"
                  className="flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  <CalendarDays className="h-4 w-4" />
                  Date of birth
                </label>

                <Input
                  id="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth ?? ""}
                  onChange={(event) =>
                    updateField("dateOfBirth", event.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label
                    htmlFor="height"
                    className="text-sm font-medium text-slate-700"
                  >
                    Height (cm)
                  </label>

                  <Input
                    id="height"
                    type="number"
                    min="1"
                    value={form.height ?? ""}
                    onChange={(event) =>
                      updateField(
                        "height",
                        event.target.value
                          ? Number(event.target.value)
                          : undefined,
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="weight"
                    className="text-sm font-medium text-slate-700"
                  >
                    Weight (kg)
                  </label>

                  <Input
                    id="weight"
                    type="number"
                    min="1"
                    value={form.weight ?? ""}
                    onChange={(event) =>
                      updateField(
                        "weight",
                        event.target.value
                          ? Number(event.target.value)
                          : undefined,
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
              {profileMessage ? (
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {profileMessage}
                </div>
              ) : (
                <div />
              )}

              <Button
                type="submit"
                className="gap-2 rounded-xl"
                disabled={updateProfileMutation.isPending}
              >
                <Save className="h-4 w-4" />
                {updateProfileMutation.isPending
                  ? "Saving..."
                  : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-teal-700" />
            Change password
          </CardTitle>

          <CardDescription>
            Use a strong password to keep your account secure.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="currentPassword"
                  className="text-sm font-medium text-slate-700"
                >
                  Current password
                </label>

                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-slate-700"
                >
                  New password
                </label>

                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              {passwordMessage ? (
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {passwordMessage}
                </div>
              ) : (
                <div />
              )}

              <Button
                type="submit"
                variant="outline"
                className="gap-2 rounded-xl"
                disabled={changePasswordMutation.isPending}
              >
                <Lock className="h-4 w-4" />
                {changePasswordMutation.isPending
                  ? "Changing..."
                  : "Change password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">Danger zone</CardTitle>

          <CardDescription>
            Deactivating your account will disable access to your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-red-200 text-red-700 hover:bg-red-50"
            onClick={() => void handleDeactivate()}
            disabled={deactivateAccountMutation.isPending}
          >
            {deactivateAccountMutation.isPending
              ? "Deactivating..."
              : "Deactivate account"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}