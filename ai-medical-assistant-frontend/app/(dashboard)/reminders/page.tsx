"use client";

import { useState, type FormEvent } from "react";
import {
  Clock,
  Repeat2,
  Trash2,
  Plus,
  Pencil,
  Pause,
  Play,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

import { useReminders } from "@/hooks/useReminders";

import {
  ReminderStatus,
  RepeatInterval,
  type Reminder,
  type CreateReminderPayload,
  type UpdateReminderPayload,
} from "@/types/reminder";

const statusLabels: Record<ReminderStatus, string> = {
  ACTIVE: "Active",
  PAUSED: "Paused",
  COMPLETED: "Completed",
};

const statusVariants: Record<
  ReminderStatus,
  "default" | "secondary" | "outline" | "success" | "warning" | "danger"
> = {
  ACTIVE: "default",
  PAUSED: "warning",
  COMPLETED: "success",
};

const repeatLabels: Record<RepeatInterval, string> = {
  NONE: "Once",
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
};

function formatDateTimeForInput(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const timezoneOffset = date.getTimezoneOffset();

  return new Date(date.getTime() - timezoneOffset * 60 * 1000)
    .toISOString()
    .slice(0, 16);
}

function getApiErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    return response?.data?.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return undefined;
}

export default function RemindersPage() {
  const {
    listQuery,
    createMutation,
    updateMutation,
    updateStatusMutation,
    completeMutation,
    deleteMutation,
  } = useReminders();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [repeatInterval, setRepeatInterval] =
    useState<RepeatInterval>(RepeatInterval.NONE);

  const [formError, setFormError] = useState("");

  const reminders = listQuery.data?.data ?? [];

  const isSaving =
    createMutation.isPending || updateMutation.isPending;

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setScheduledFor("");
    setRepeatInterval(RepeatInterval.NONE);
    setFormError("");
  };

  const handleCreateClick = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingId(reminder.id);
    setTitle(reminder.title);
    setDescription(reminder.description ?? "");
    setScheduledFor(
      formatDateTimeForInput(reminder.scheduledFor),
    );
    setRepeatInterval(reminder.repeatInterval);
    setFormError("");
    setShowForm(true);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setFormError("");

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setFormError("Please enter a reminder title.");
      return;
    }

    if (!scheduledFor) {
      setFormError("Please select a date and time.");
      return;
    }

    const date = new Date(scheduledFor);

    if (Number.isNaN(date.getTime())) {
      setFormError("Please select a valid date and time.");
      return;
    }

    if (date <= new Date()) {
      setFormError("Reminder time must be in the future.");
      return;
    }

    try {
      if (editingId) {
        const payload: UpdateReminderPayload = {
          title: trimmedTitle,
          ...(trimmedDescription && {
            description: trimmedDescription,
          }),
          scheduledFor: date.toISOString(),
          repeatInterval,
        };

        await updateMutation.mutateAsync({
          id: editingId,
          payload,
        });
      } else {
        const payload: CreateReminderPayload = {
          title: trimmedTitle,
          ...(trimmedDescription && {
            description: trimmedDescription,
          }),
          scheduledFor: date.toISOString(),
          repeatInterval,
        };

        await createMutation.mutateAsync(payload);
      }

      resetForm();
    } catch (error: unknown) {
      setFormError(
        getApiErrorMessage(error) ??
          "Unable to save reminder. Please try again.",
      );
    }
  };

  const handleStatusChange = async (
    id: string,
    status: ReminderStatus,
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        id,
        status,
      });
    } catch {
      // React Query mutation state handles the error.
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await completeMutation.mutateAsync(id);
    } catch {
      // React Query mutation state handles the error.
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reminder?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
    } catch {
      // React Query mutation state handles the error.
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

        <Skeleton className="h-24 w-full" />

        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (listQuery.isError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8 text-center">
          <p className="font-medium text-red-700">
            Failed to load reminders.
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
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-teal-700">
            Health Schedule
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Reminders
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Stay on top of your health with timely medication,
            appointment, and wellness reminders.
          </p>
        </div>

        <Button
          onClick={handleCreateClick}
          className="bg-teal-700 hover:bg-teal-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Reminder
        </Button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-cyan-50">
            <CardTitle className="text-lg">
              {editingId ? "Edit Reminder" : "Create Reminder"}
            </CardTitle>

            <p className="text-sm text-slate-500">
              {editingId
                ? "Update the details of your reminder."
                : "Create a reminder to stay on track with your health."}
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Title */}
              <div className="space-y-2">
                <label
                  htmlFor="reminder-title"
                  className="text-sm font-medium text-slate-900"
                >
                  Title
                </label>

                <Input
                  id="reminder-title"
                  value={title}
                  maxLength={150}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="e.g. Take morning medication"
                  disabled={isSaving}
                />

                <p className="text-xs text-slate-400">
                  {title.length}/150
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label
                  htmlFor="reminder-description"
                  className="text-sm font-medium text-slate-900"
                >
                  Description
                </label>

                <textarea
                  id="reminder-description"
                  value={description}
                  maxLength={500}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Add some details about this reminder..."
                  disabled={isSaving}
                  className="min-h-24 w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />

                <p className="text-xs text-slate-400">
                  {description.length}/500
                </p>
              </div>

              {/* Date and Repeat */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="reminder-date"
                    className="text-sm font-medium text-slate-900"
                  >
                    Date & Time
                  </label>

                  <Input
                    id="reminder-date"
                    type="datetime-local"
                    value={scheduledFor}
                    min={new Date()
                      .toISOString()
                      .slice(0, 16)}
                    onChange={(event) =>
                      setScheduledFor(event.target.value)
                    }
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="reminder-repeat"
                    className="text-sm font-medium text-slate-900"
                  >
                    Repeat
                  </label>

                  <select
                    id="reminder-repeat"
                    value={repeatInterval}
                    onChange={(event) =>
                      setRepeatInterval(
                        event.target.value as RepeatInterval,
                      )
                    }
                    disabled={isSaving}
                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value={RepeatInterval.NONE}>
                      Once
                    </option>

                    <option value={RepeatInterval.DAILY}>
                      Daily
                    </option>

                    <option value={RepeatInterval.WEEKLY}>
                      Weekly
                    </option>

                    <option value={RepeatInterval.MONTHLY}>
                      Monthly
                    </option>
                  </select>
                </div>
              </div>

              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isSaving}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-teal-700 hover:bg-teal-800"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingId
                        ? "Updating..."
                        : "Creating..."}
                    </>
                  ) : (
                    <>
                      {editingId ? (
                        <Pencil className="mr-2 h-4 w-4" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}

                      {editingId
                        ? "Update Reminder"
                        : "Create Reminder"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reminders */}
      {reminders.length === 0 ? (
        <Card className="border-dashed border-slate-300">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700">
              <Clock className="h-5 w-5" />
            </div>

            <p className="mt-4 font-medium text-slate-900">
              No reminders yet
            </p>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              Create your first health reminder to stay on top
              of medications, appointments, and daily routines.
            </p>

            {!showForm && (
              <Button
                onClick={handleCreateClick}
                className="mt-5 bg-teal-700 hover:bg-teal-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Reminder
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <Card
              key={reminder.id}
              className="overflow-hidden"
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {reminder.title}
                      </h3>

                      <Badge
                        variant={
                          statusVariants[reminder.status]
                        }
                      >
                        {statusLabels[reminder.status]}
                      </Badge>
                    </div>

                    {reminder.description && (
                      <p className="mt-1 text-sm text-slate-600">
                        {reminder.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-teal-700" />

                        {new Date(
                          reminder.scheduledFor,
                        ).toLocaleString()}
                      </span>

                      <span className="flex items-center gap-2">
                        <Repeat2 className="h-4 w-4 text-teal-700" />

                        {repeatLabels[
                          reminder.repeatInterval
                        ] ?? reminder.repeatInterval}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1">
                    {/* Pause */}
                    {reminder.status ===
                      ReminderStatus.ACTIVE && (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Pause reminder"
                        disabled={
                          updateStatusMutation.isPending
                        }
                        onClick={() =>
                          handleStatusChange(
                            reminder.id,
                            ReminderStatus.PAUSED,
                          )
                        }
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Resume */}
                    {reminder.status ===
                      ReminderStatus.PAUSED && (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Resume reminder"
                        disabled={
                          updateStatusMutation.isPending
                        }
                        onClick={() =>
                          handleStatusChange(
                            reminder.id,
                            ReminderStatus.ACTIVE,
                          )
                        }
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Complete */}
                    {reminder.status !==
                      ReminderStatus.COMPLETED && (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Complete reminder"
                        disabled={
                          completeMutation.isPending
                        }
                        onClick={() =>
                          handleComplete(reminder.id)
                        }
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </Button>
                    )}

                    {/* Edit */}
                    {reminder.status !==
                      ReminderStatus.COMPLETED && (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit reminder"
                        disabled={updateMutation.isPending}
                        onClick={() =>
                          handleEdit(reminder)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete reminder"
                      disabled={deleteMutation.isPending}
                      onClick={() =>
                        handleDelete(reminder.id)
                      }
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}