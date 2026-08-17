"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { remindersApi } from "@/lib/api/reminders";
import type {
  CreateReminderPayload,
  UpdateReminderPayload,
  ReminderStatus,
} from "@/types/reminder";

const REMINDERS_QUERY_KEY = ["reminders"];

export function useReminders() {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: REMINDERS_QUERY_KEY,
    queryFn: () => remindersApi.list(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateReminderPayload) =>
      remindersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDERS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateReminderPayload;
    }) => remindersApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDERS_QUERY_KEY });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReminderStatus }) =>
      remindersApi.updateStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REMINDERS_QUERY_KEY,
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => remindersApi.complete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REMINDERS_QUERY_KEY,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remindersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDERS_QUERY_KEY });
    },
  });

  return {
    listQuery,
    createMutation,
    updateMutation,
    updateStatusMutation,
    completeMutation,
    deleteMutation,
  };
}

export function useReminder(id: string) {
  return useQuery({
    queryKey: [...REMINDERS_QUERY_KEY, id],
    queryFn: () => remindersApi.getById(id),
  });
}
